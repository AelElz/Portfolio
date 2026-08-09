/* Visual design & UI/UX portfolio, grouped by client.
   Add a new client object to this array and the page renders it —
   nothing else to touch.

   Images live in public/Design/web/ — 1920px JPEG copies generated from
   the 4K originals in public/Design/ (kept untouched). To regenerate
   after adding new work:
     cd public/Design && sips -s format jpeg -s formatOptions 82 -Z 1920 "New File.png" --out "web/New File.jpg" */

export const DESIGN_CLIENTS = [
  {
    index: '01',
    name: 'Claro Digital Service',
    tagline: 'Brand designs and a full UI/UX landing page for a digital service company.',
    website: 'https://claro-xi.vercel.app/',
    uiux: {
      label: 'UI / UX Landing Page',
      image: '/Design/web/Landing Page.jpg',
      alt: 'Claro Digital Service landing page, UI/UX design',
    },
    designs: [
      { image: '/Design/web/Design 1.jpg', alt: 'Claro Digital Service design 1' },
      { image: '/Design/web/Design 2.jpg', alt: 'Claro Digital Service design 2' },
      { image: '/Design/web/Design 3.jpg', alt: 'Claro Digital Service design 3' },
      { image: '/Design/web/Design 4.jpg', alt: 'Claro Digital Service design 4' },
      { image: '/Design/web/Design 5.jpg', alt: 'Claro Digital Service design 5' },
    ],
  },
];
