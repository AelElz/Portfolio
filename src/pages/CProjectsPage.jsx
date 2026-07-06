import DeepDivePage from '../components/DeepDivePage';
import { ConcurrencyDiagram, RaycastDiagram, ShellPipelineDiagram } from '../components/diagrams/ProjectDiagrams';
import { C_PROJECTS } from '../data/c-projects';

const DIAGRAMS = {
  concurrency: ConcurrencyDiagram,
  raycasting: RaycastDiagram,
  shell: ShellPipelineDiagram,
};

export default function CProjectsPage() {
  return (
    <DeepDivePage
      eyebrow="C / C++"
      title="Systems projects, explained"
      intro="Three projects from the 1337 (42 Network) curriculum, built with no external libraries — just C, POSIX APIs, a compiler, and a lot of time with gdb and valgrind. Here's what each one does and the systems concept it forced me to actually understand, not just use."
      items={C_PROJECTS}
      diagrams={DIAGRAMS}
    />
  );
}
