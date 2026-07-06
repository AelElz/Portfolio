function youtubeId(url) {
  return url.split('/').pop();
}

export const MOTION_GRAPHICS_VIDEOS = [
  {
    title: 'Motion Graphics and Video Editing for the UM6P Language Center Department',
    youtubeId: youtubeId('https://youtu.be/cy5gcsj1ZcI'),
  },
  {
    title: 'Motion Graphic video editing with Cora Intelligence',
    youtubeId: youtubeId('https://youtu.be/Dz3KZ0cwutM'),
  },
];

export const CINEMATIC_VIDEOS = [
  {
    title: 'What OCP actually does?',
    description:
      "In this cinematic story, we dive into the world of OCP Group, a global leader in phosphate mining and fertilizer production. But OCP is more than just mining. It transforms Morocco's rich natural resources into essential nutrients that help farmers grow crops and sustain life across the planet.",
    youtubeId: youtubeId('https://youtu.be/XR_fBVJ9gCI'),
  },
  {
    title: 'Short cinematic teaser for a new creative club called Fikra',
    youtubeId: youtubeId('https://youtu.be/UwyVIRsoZGw'),
  },
];
