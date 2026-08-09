export const C_PROJECTS = [
  {
    id: 'concurrency',
    index: '01',
    name: 'Runtime Concurrency System',
    tagline: 'The dining philosophers, solved without deadlock or starvation.',
    what:
      "A simulation where N philosophers sit at a round table, each needing two shared forks to eat. Every philosopher runs on its own pthread, cycling through thinking, being hungry, eating, and sleeping. It runs forever without crashing, deadlocking, or letting a philosopher starve.",
    how: [
      'Each fork is a mutex. A philosopher must lock both their left and right fork before eating, and release both after. That\'s the entire resource-contention problem in one sentence.',
      'Picking up both forks in the same order for every philosopher is how you get deadlock: everyone grabs their left fork simultaneously and waits forever for a right fork that\'s already taken. The fix is breaking the symmetry, e.g. even-indexed philosophers pick up right-then-left.',
      'A monitoring thread checks timestamps against a time-to-die limit so starvation is caught and reported instead of hanging silently, the classic bug in a naive implementation.',
    ],
    concepts: ['pthreads', 'Mutexes', 'Deadlock avoidance', 'Race conditions', 'Starvation detection'],
    diagram: 'concurrency',
    lang: 'C',
    href: 'https://github.com/AelElz/runtime-concurrency-system',
  },
  {
    id: 'raycasting',
    index: '02',
    name: 'Raycasting Engine',
    tagline: 'A 3D-looking renderer with zero 3D math library.',
    what:
      "A first-person renderer in the style of Wolfenstein 3D, built entirely on a 2D grid map. There's no mesh, no camera matrix, no GPU pipeline. Every frame is just a fan of rays cast from the player's position, one per screen column.",
    how: [
      'For every vertical strip of the screen, a ray is cast from the player into the 2D map using a DDA (Digital Differential Analysis) algorithm. It walks grid cell by grid cell until it hits a wall, which is far cheaper than checking every pixel.',
      'The distance to that wall hit determines how tall the rendered column is: close wall → tall column, far wall → short column. That single distance-to-height mapping is what makes a flat map look like a 3D corridor.',
      'Raw distance would warp straight walls into a fish-eye curve, so the distance is corrected by the cosine of the angle between the ray and the player\'s viewing direction before it\'s used for height.',
      'Where exactly the ray hit a wall tile (not just that it hit one) picks which column of the wall texture to sample, so textures scroll correctly instead of stretching.',
    ],
    concepts: ['DDA algorithm', 'Fish-eye correction', 'Texture mapping', 'Collision detection', 'Real-time rendering loop'],
    diagram: 'raycasting',
    lang: 'C',
    href: 'https://github.com/AelElz/raycasting-engine',
  },
  {
    id: 'shell',
    index: '03',
    name: 'Custom Unix Shell',
    tagline: 'bash, minus the safety net.',
    what:
      "A POSIX-flavored shell built from scratch: no readline shortcuts, no borrowed parser. It tokenizes what you type, builds pipelines, forks processes, wires their file descriptors together, and handles the builtins bash users take for granted.",
    how: [
      'Input is lexed into tokens (words, pipes, redirections, quotes) and parsed into a command list before anything runs. Get the quoting rules wrong here and every downstream feature breaks in subtle ways.',
      'Each stage of a pipeline (cmd1 | cmd2 | cmd3) is fork()\'d into its own process; dup2() rewires that child\'s stdin/stdout onto the pipe\'s read/write ends so data flows between processes exactly like a real shell.',
      'Redirections (<, >, >>, heredocs) are resolved per-command before execve(), and builtins like cd, export, and exit run directly in the parent process, since a forked cd would only change its own child\'s directory and vanish with it.',
      'Signal handling (SIGINT, SIGQUIT) is remapped to match bash\'s actual behavior in interactive mode vs. inside a running child process.',
    ],
    concepts: ['Lexing & parsing', 'fork / execve / pipe / dup2', 'Signal handling', 'Builtins', 'Environment variables'],
    diagram: 'shell',
    lang: 'C',
    href: 'https://github.com/AelElz',
  },
];
