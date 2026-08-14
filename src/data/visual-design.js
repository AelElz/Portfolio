/* UI/UX Projects & UI/UX portfolio, grouped by client.
   Add a client object to this array and the page renders it —
   nothing else to touch.

   A client may ship more than once. `versions` is that history:
   each entry is a live build with its own screenshot and its own
   URL, rendered side by side so the progression is the point
   rather than a footnote.

   Images live in public/Design/web/ — 1920px JPEG copies generated
   from the 4K originals in public/Design/ (kept untouched). To add
   a new one:
     cd public/Design && sips -s format jpeg -s formatOptions 82 -Z 1920 "New File.png" --out "web/New File.jpg" */

export const DESIGN_CLIENTS = [
  {
    index: '01',
    name: 'Claro Digital Service',
    tagline: 'Brand designs and a full UI/UX landing page for a digital service company, shipped twice.',
    versions: [
      {
        id: 'v1',
        label: 'Version One',
        website: 'https://claro-xi.vercel.app/',
        image: '/Design/web/Landing Page.jpg',
        alt: 'Claro Digital Service landing page, first version',
      },
      {
        id: 'v2',
        label: 'Version Two — Enhanced',
        website: 'https://claro-digital-services.vercel.app/',
        image: '/Design/web/claro-v2.jpg',
        alt: 'Claro Digital Service landing page, enhanced version',
      },
    ],
    designs: [
      { image: '/Design/web/Design 1.jpg', alt: 'Claro Digital Service design 1' },
      { image: '/Design/web/Design 2.jpg', alt: 'Claro Digital Service design 2' },
      { image: '/Design/web/Design 3.jpg', alt: 'Claro Digital Service design 3' },
      { image: '/Design/web/Design 4.jpg', alt: 'Claro Digital Service design 4' },
      { image: '/Design/web/Design 5.jpg', alt: 'Claro Digital Service design 5' },
    ],
  },
  {
    index: '02',
    name: 'Beyondex',
    tagline: 'Full-stack digital marketing studio — brand, product and story, from Morocco to the world.',
    versions: [
      {
        id: 'live',
        label: 'Live site',
        website: 'https://beyondex.vercel.app/',
        image: '/Design/web/beyondex.jpg',
        alt: 'Beyondex studio landing page',
      },
    ],
  },
];
