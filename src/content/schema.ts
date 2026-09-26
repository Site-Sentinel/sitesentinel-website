/**
 * Content schema for the Site Sentinel marketing site.
 *
 * Every piece of copy on the homepage is validated against these shapes before
 * the site will build. If you add a field here you must also handle it in the
 * component that renders it, or `pnpm check` will fail.
 *
 * The point of this file: content lives as data, not as markup. Editing copy
 * should never mean editing a component.
 */
import { z } from 'zod';

// Built from char codes so this file contains no dash characters itself,
// which keeps it passing its own tools/check-dashes.mjs gate.
const DASH = new RegExp(`[${String.fromCharCode(0x2014)}${String.fromCharCode(0x2013)}]`);

/** Rejects the characters the brand style guide forbids. See AGENTS.md. */
const prose = z
  .string()
  .min(1, 'Text cannot be empty')
  .refine((s) => !DASH.test(s), {
    message: 'Em dashes and en dashes are not allowed. Use a comma, colon, full stop or brackets.',
  });

/** A short all-caps label that sits above a heading. */
const eyebrow = prose.max(48, 'Eyebrow text must be 48 characters or fewer');

export const linkSchema = z.object({
  label: prose.max(40, 'Button labels must be 40 characters or fewer'),
  href: prose,
  /**
   * primary   magenta, the main action. At most one per section.
   * secondary outlined, sits beside a primary.
   * ghost     text plus arrow, for low emphasis section links.
   */
  variant: z.enum(['primary', 'secondary', 'ghost']).default('ghost'),
});

export const featureSchema = z.object({
  /** Any icon name from lucide.dev. Validated at build time against the real export list. */
  icon: prose,
  title: prose.max(60, 'Feature titles must be 60 characters or fewer'),
  body: prose.max(240, 'Feature body text must be 240 characters or fewer'),
});

export const stepSchema = z.object({
  /** Rendered as 01, 02, 03. Derived from position, not authored. */
  icon: prose,
  label: prose.max(28, 'Step labels must be 28 characters or fewer'),
});

export const imageSchema = z.object({
  src: prose,
  alt: prose.min(8, 'Alt text must describe the image for screen readers. At least 8 characters.'),
});

export const sectionSchema = z.object({
  /** Stable anchor id. Used by the nav and by inbound links. Do not rename casually. */
  id: prose.regex(/^[a-z0-9-]+$/, 'Section ids must be lowercase letters, numbers and hyphens'),
  eyebrow: eyebrow.optional(),
  /** First headline line, rendered in the heading colour. */
  heading: prose.max(80, 'Headings must be 80 characters or fewer'),
  /** Optional second headline line, rendered in cyan. */
  headingAccent: prose.max(80, 'Headings must be 80 characters or fewer').optional(),
  lead: prose.max(400, 'Lead paragraphs must be 400 characters or fewer').optional(),
  body: z.array(prose.max(400, 'Body paragraphs must be 400 characters or fewer')).default([]),
  features: z.array(featureSchema).default([]),
  chips: z.array(prose.max(40)).default([]),
  steps: z.array(stepSchema).default([]),
  links: z.array(linkSchema).default([]),
  image: imageSchema.optional(),
});

export const navItemSchema = z.object({
  label: prose.max(24, 'Navigation labels must be 24 characters or fewer'),
  href: prose,
});

export const siteSchema = z.object({
  name: prose,
  tagline: prose,
  descriptor: prose,
  phone: prose,
  email: z.email('Must be a valid email address'),
  location: prose,
  /** Used as the <title> suffix and in structured data. */
  seoTitle: prose.max(65, 'SEO titles must be 65 characters or fewer'),
  seoDescription: prose
    .min(70, 'SEO descriptions should be at least 70 characters')
    .max(160, 'SEO descriptions must be 160 characters or fewer'),
});

export const clientSchema = z.object({
  name: prose,
  logo: prose,
});

export const industrySchema = z.object({
  name: prose.max(30),
  body: prose.max(160),
  image: imageSchema,
  href: prose,
});

export const outcomeSchema = z.object({
  title: prose.max(40),
  body: prose.max(120),
});

export const homepageSchema = z.object({
  site: siteSchema,
  nav: z.array(navItemSchema).min(1),
  navCta: linkSchema,
  hero: sectionSchema.extend({
    sectors: z.array(prose.max(24)).min(1),
    signature: prose.max(40),
  }),
  trust: sectionSchema.extend({ clients: z.array(clientSchema).min(1) }),
  pillars: sectionSchema.extend({ footnote: prose.optional() }),
  platform: sectionSchema,
  flagship: sectionSchema,
  intelligentAccess: sectionSchema,
  integrations: sectionSchema.extend({ partners: z.array(clientSchema).min(1) }),
  breathTesting: sectionSchema,
  autonomous: sectionSchema.extend({ flow: z.array(prose.max(40)).min(2) }),
  outcomes: sectionSchema.extend({ items: z.array(outcomeSchema).min(1) }),
  industries: sectionSchema.extend({ items: z.array(industrySchema).min(1) }),
  finalCta: sectionSchema.extend({ signature: prose.max(40) }),
});

export type Homepage = z.infer<typeof homepageSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type LinkItem = z.infer<typeof linkSchema>;
