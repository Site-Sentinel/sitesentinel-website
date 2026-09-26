/**
 * THE HOMEPAGE CONTENT.
 *
 * This is the file to edit to change words on the homepage. You should almost
 * never need to touch a component to change copy, a heading, a button label or
 * a list of features.
 *
 * Everything here is checked when the site builds. If you break a rule (text too
 * long, a missing image description, a forbidden character) the build stops and
 * tells you exactly which line and why. That is deliberate: a failed build is
 * safe, a broken live site is not.
 *
 * Copy source: docs/homepage-brief-v1.md
 */
import { homepageSchema } from './schema.ts';

export const homepage = homepageSchema.parse({
  site: {
    name: 'Site Sentinel',
    tagline: 'Safer Sites. Smarter Access.',
    descriptor: 'Access & Control Systems',
    phone: '+61 8 6149 0555',
    email: 'info@sitesentinel.com.au',
    location: 'Perth, Western Australia',
    seoTitle: 'Site Sentinel | Smarter Access. Safer Sites.',
    seoDescription:
      'Cloud-based site access, contractor management and security solutions for construction, mining, infrastructure and industrial projects.',
  },

  nav: [
    { label: 'Solutions', href: '#pillars' },
    { label: 'Platform', href: '#platform' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Industries', href: '#industries' },
    { label: 'About', href: '#outcomes' },
    { label: 'Contact', href: '#contact' },
  ],
  navCta: { label: 'Talk to our team', href: '#contact', variant: 'primary' },

  hero: {
    id: 'hero',
    eyebrow: 'Site Access & Control Systems',
    heading: 'Smarter Access.',
    headingAccent: 'Safer Sites.',
    lead: 'Cloud-based site access, contractor management and security solutions for construction, mining, infrastructure and industrial projects.',
    body: ['One platform. One site or many. Control from anywhere.'],
    links: [
      { label: 'Explore our solutions', href: '#pillars', variant: 'primary' },
      { label: 'Talk to our team', href: '#contact', variant: 'secondary' },
    ],
    // Cropped from page 1 of the capability statement PDF, so it is the real
    // constructed unit rather than a stock or AI image. It is only 745px wide
    // and will look soft on a large screen: replace it with the original
    // high-resolution photograph when that is available.
    image: {
      src: '/images/hero-container.png',
      alt: 'Site Sentinel containerised site access unit on a construction site, with a worker in high visibility clothing walking through the full height turnstiles',
    },
    sectors: ['Construction', 'Mining', 'Infrastructure', 'Industrial'],
    signature: 'Expectations. Delivered.',
  },

  trust: {
    id: 'trust',
    eyebrow: 'Trusted by industry',
    heading: 'Proven solutions.',
    headingAccent: 'Trusted partners.',
    lead: 'Site Sentinel works with leading construction and infrastructure organisations to deliver safer, smarter and more secure sites.',
    // These are the real client logos, extracted from the capability statement
    // PDF in docs/reference/. They carry their own solid backgrounds, exactly as
    // they appear in the brochure. Replace with supplied vector artwork when the
    // client provides it, and confirm permission to use each one.
    clients: [
      { name: 'Multiplex', logo: '/images/clients/multiplex.png' },
      { name: 'Webuild', logo: '/images/clients/webuild.png' },
      { name: 'ADCO', logo: '/images/clients/adco.png' },
    ],
  },

  pillars: {
    id: 'pillars',
    eyebrow: 'More than turnstiles',
    heading: 'A complete site access',
    headingAccent: 'and management solution.',
    lead: 'Site Sentinel brings together physical access control, people management, safety, compliance and security in one connected ecosystem.',
    body: ['The technology behind the gate is just as important as the gate itself.'],
    features: [
      {
        icon: 'DoorOpen',
        title: 'Site Access',
        body: 'Turnstiles, gates, doors and containerised site-entry solutions.',
      },
      {
        icon: 'Users',
        title: 'People Management',
        body: 'Contractor registration, inductions, access permissions and workforce management.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Safety & Compliance',
        body: 'Controlled entry, emergency egress, compliance rules and real-time personnel visibility.',
      },
      {
        icon: 'Cctv',
        title: 'Site Security',
        body: 'Access records, CCTV integration, security systems and central monitoring.',
      },
    ],
    footnote: 'One platform. Connected ecosystem.',
  },

  platform: {
    id: 'platform',
    eyebrow: 'Cloud-based site management',
    heading: 'Control your sites.',
    headingAccent: 'Anywhere. Anytime.',
    lead: 'One platform. One site or many. Control from anywhere.',
    body: [
      "Site Sentinel's cloud-based platform gives authorised users visibility and control across individual sites, multiple projects or an entire portfolio.",
      'Manage contractors, inductions, permissions and access rules remotely while maintaining a clear, auditable view of site activity and personnel.',
    ],
    features: [
      {
        icon: 'LayoutGrid',
        title: 'Multi-Site Management',
        body: 'Manage multiple projects and access points through one central platform.',
      },
      {
        icon: 'MapPin',
        title: 'Remote Access & Control',
        body: 'Manage contractors and update permissions without needing to be physically on site.',
      },
      {
        icon: 'Activity',
        title: 'Real-Time Visibility',
        body: 'See who is on site and access current attendance and access information.',
      },
      {
        icon: 'Settings',
        title: 'Centralised Management',
        body: 'Bring access, contractors, compliance and connected systems together in one place.',
      },
    ],
    links: [
      { label: 'Explore the Site Sentinel platform', href: '#contact', variant: 'secondary' },
    ],
    image: {
      src: '/images/platform-screens.png',
      alt: 'The Site Sentinel web portal dashboard shown on a laptop, with the Site Sentinel mobile app scan screen on a phone beside it',
    },
  },

  flagship: {
    id: 'flagship',
    eyebrow: 'Containerised site access',
    heading: 'Drop in. Power up.',
    headingAccent: 'Control your site.',
    lead: 'The Site Sentinel Containerised Site Access Solution combines controlled pedestrian entry, full-height turnstiles and intelligent access technology within one robust, rapidly deployable unit.',
    body: [
      'Designed for real-world projects, the system creates a clearly defined boundary between the public arrival area and the controlled worksite, while connecting directly to the Site Sentinel platform.',
    ],
    chips: [
      'Full-Height Turnstiles',
      'Smart Access Control',
      'Rapid Deployment',
      'Emergency Egress',
      'CCTV Integration',
      'Relocatable',
    ],
    links: [{ label: 'Explore containerised site access', href: '#contact', variant: 'primary' }],
    // Same source photograph as the hero, pending a distinct closer shot of
    // the unit. See the note on the hero image.
    image: {
      src: '/images/flagship-container.png',
      alt: 'Close view of the Site Sentinel containerised access unit showing the branded exterior, safety signage and the pedestrian approach',
    },
  },

  intelligentAccess: {
    id: 'intelligent-access',
    eyebrow: 'Intelligent access',
    heading: 'Intelligent access.',
    headingAccent: 'Real site control.',
    lead: 'Site Sentinel gives project teams the tools to control who can enter, where they can go and when their access is valid.',
    body: [
      'Permissions can be configured around the requirements of your project, helping ensure that access reflects current contractor, induction and compliance information.',
    ],
    features: [
      {
        icon: 'Smartphone',
        title: 'Smartphone & Credential Access',
        body: 'Flexible credentials for workers, contractors and visitors.',
      },
      {
        icon: 'SlidersHorizontal',
        title: 'Configurable Permissions',
        body: 'Control access by person, location, date, time or project requirements.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Contractor Management',
        body: 'Connect onboarding, inductions and compliance with physical site access.',
      },
      {
        icon: 'LogOut',
        title: 'Emergency Egress',
        body: 'Support safe, controlled emergency exit requirements.',
      },
      {
        icon: 'WifiOff',
        title: 'Offline Capability',
        body: 'Maintain essential access functionality when connectivity is interrupted.',
      },
      {
        icon: 'MonitorDot',
        title: 'Central Monitoring',
        body: 'Maintain visibility across access points and multiple sites.',
      },
    ],
    links: [{ label: 'Discover intelligent access', href: '#contact', variant: 'secondary' }],
  },

  integrations: {
    id: 'integrations',
    eyebrow: 'Connected ecosystem',
    heading: 'Flexible integration.',
    headingAccent: 'Real customer outcomes.',
    lead: "Site Sentinel isn't designed to force projects into a closed technology ecosystem.",
    body: [
      'Using APIs, we can integrate with approved third-party contractor, workforce, compliance and safety systems, allowing access decisions to reflect the information and processes your project already relies on.',
    ],
    // No artwork exists for these three anywhere in the Site Sentinel
    // repositories or in the capability statement, where they appear as plain
    // text. They render as placeholders until real logos are supplied, and
    // permission to display them is confirmed.
    partners: [
      { name: 'HammerTech', logo: '/images/partners/hammertech.svg' },
      { name: 'Damstra', logo: '/images/partners/damstra.svg' },
      { name: 'WorkMetrics', logo: '/images/partners/workmetrics.svg' },
    ],
    features: [
      {
        icon: 'Plug',
        title: 'Open API Integration',
        body: 'Connect the systems your project already runs on.',
      },
      {
        icon: 'Workflow',
        title: 'Automated Access Permissions',
        body: 'Let compliance data drive access decisions automatically.',
      },
      {
        icon: 'RefreshCw',
        title: 'Real-Time Data Synchronisation',
        body: 'Keep contractor and compliance records current across systems.',
      },
      {
        icon: 'Scaling',
        title: 'Flexible & Scalable',
        body: 'Grow from a single access point to an entire portfolio.',
      },
    ],
    links: [{ label: 'Explore integrations', href: '#contact', variant: 'secondary' }],
  },

  breathTesting: {
    id: 'breath-testing',
    eyebrow: 'Automation that works at the gate',
    heading: 'Alcohol breath testing.',
    headingAccent: 'Integrated with site access.',
    lead: 'Site Sentinel can integrate alcohol breath-testing systems into the controlled entry workflow.',
    body: [
      'Contractor identity, compliance status and breath-test outcomes can work together to determine whether site access is authorised, embedding an additional safety control directly into the entry process.',
    ],
    steps: [
      { icon: 'ScanFace', label: 'Identify' },
      { icon: 'FileCheck', label: 'Verify Compliance' },
      { icon: 'TestTube', label: 'Breath Test' },
      { icon: 'CircleCheck', label: 'Authorise' },
      { icon: 'DoorOpen', label: 'Site Access' },
    ],
    image: {
      src: '/images/breath-testing.jpg',
      alt: 'A worker in high visibility clothing and a hard hat using a breath-testing terminal at a site entry point',
    },
  },

  autonomous: {
    id: 'autonomous',
    eyebrow: 'Autonomous site access',
    heading: 'No mains power?',
    headingAccent: 'No problem.',
    lead: 'Fully autonomous. Drop in. Ready to go.',
    body: [
      'Site Sentinel containerised access systems can be configured with solar generation and battery storage to provide reliable off-grid operation.',
      'Ideal for remote projects, early works and locations where permanent power infrastructure is unavailable or impractical.',
    ],
    flow: ['Solar', 'Battery Storage', 'Site Sentinel Access'],
    chips: [
      'Solar Powered',
      'Battery Storage',
      'Autonomous Operation',
      'Remote Ready',
      'Rapid Deployment',
    ],
    links: [{ label: 'Explore autonomous solutions', href: '#contact', variant: 'secondary' }],
    image: {
      src: '/images/autonomous-container.jpg',
      alt: 'A Site Sentinel containerised access unit fitted with solar panels, positioned at a remote arid work site',
    },
  },

  outcomes: {
    id: 'outcomes',
    eyebrow: 'Customer outcomes first',
    heading: 'Technology built around',
    headingAccent: 'the outcome you need.',
    lead: "We don't believe every project should be forced into the same solution.",
    body: [
      'Site Sentinel combines access control, contractor management, compliance, security and third-party integrations into practical solutions configured around the requirements of each project.',
    ],
    items: [
      { title: 'Safer Sites', body: 'Controlled, compliant access.' },
      { title: 'Stronger People', body: 'Simpler contractor journeys.' },
      { title: 'Greater Productivity', body: 'Less manual administration.' },
      { title: 'Sustainable Solutions', body: 'Solar and autonomous options.' },
      { title: 'Lasting Partnerships', body: 'Flexible integrations.' },
    ],
  },

  industries: {
    id: 'industries',
    eyebrow: 'Built for real-world projects',
    heading: 'Our solutions.',
    headingAccent: 'Your industry.',
    items: [
      {
        name: 'Construction',
        body: 'Controlled access for complex, changing project environments.',
        image: {
          src: '/images/industries/construction.jpg',
          alt: 'A large construction site with tower cranes against a blue sky',
        },
        href: '#contact',
      },
      {
        name: 'Mining',
        body: 'Robust access and workforce solutions for demanding operations.',
        image: {
          src: '/images/industries/mining.jpg',
          alt: 'A large yellow haul truck working in an open cut mine',
        },
        href: '#contact',
      },
      {
        name: 'Infrastructure',
        body: 'Scalable access solutions for major infrastructure projects.',
        image: {
          src: '/images/industries/infrastructure.jpg',
          alt: 'A steel truss bridge spanning a waterway',
        },
        href: '#contact',
      },
      {
        name: 'Industrial',
        body: 'Intelligent control for operational and high-security environments.',
        image: {
          src: '/images/industries/industrial.jpg',
          alt: 'An industrial refinery with storage tanks and pipework at dusk',
        },
        href: '#contact',
      },
    ],
  },

  finalCta: {
    id: 'contact',
    heading: 'Ready to create a',
    headingAccent: 'safer, smarter site?',
    lead: "Whether you need a standalone access point, a containerised site entrance or a fully integrated multi-site solution, we'll work with you to configure Site Sentinel around the needs of your project.",
    links: [
      { label: 'Talk to our team', href: 'mailto:info@sitesentinel.com.au', variant: 'primary' },
      {
        label: 'View our capability statement',
        href: '/site-sentinel-capability-statement.pdf',
        variant: 'secondary',
      },
    ],
    signature: 'Expectations. Delivered.',
  },
});
