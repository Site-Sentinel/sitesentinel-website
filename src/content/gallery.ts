import { z } from 'zod';
import { imageSchema } from './schema.ts';

const text = z.string().min(1);
const gallerySchema = z.object({
  title: text.max(65),
  description: text.max(160),
  eyebrow: text,
  heading: text,
  lead: text,
  editingNote: text,
  viewLabel: text,
  images: z
    .array(
      imageSchema.extend({
        title: text,
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const gallery = gallerySchema.parse({
  title: 'Image Gallery | Site Sentinel',
  description: 'Explore Site Sentinel containerised access units and freestanding turnstiles.',
  eyebrow: 'Site access systems',
  heading: 'Image gallery',
  lead: 'Explore Site Sentinel containerised entrances, exits and freestanding turnstiles.',
  editingNote:
    'Images have been digitally edited to remove surrounding objects and adjust pavement and lighting.',
  viewLabel: 'View full-size image',
  images: [
    {
      src: '/images/gallery/freestanding-turnstiles.jpg',
      alt: 'Two galvanised full-height freestanding turnstiles with access readers and a central pedestrian gate at a construction site.',
      width: 1666,
      height: 944,
      title: 'Site Sentinel Freestanding Turnstiles',
    },
    {
      src: '/images/gallery/container-entrance-open.jpg',
      alt: 'Site Sentinel container entrance with open shutters and stainless steel turnstiles.',
      width: 1920,
      height: 770,
      title: 'SSA Customised Modular Containers - Entry',
    },
    {
      src: '/images/gallery/container-exit.jpg',
      alt: 'Site Sentinel container exit with stainless steel turnstiles and yellow access ramps.',
      width: 1920,
      height: 674,
      title: 'Exit',
    },
    {
      src: '/images/gallery/container-entrance-closed.jpg',
      alt: 'Site Sentinel container entrance with both roller shutters closed.',
      width: 1899,
      height: 828,
      title: 'Entrance closed',
    },
  ],
});
