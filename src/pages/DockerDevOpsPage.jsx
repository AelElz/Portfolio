import DeepDivePage from '../components/DeepDivePage';
import { ComposeDiagram, HardeningLayersDiagram } from '../components/diagrams/DevOpsDiagrams';
import { DOCKER_DEVOPS_PROJECTS } from '../data/docker-devops-projects';

const DIAGRAMS = {
  compose: ComposeDiagram,
  hardening: HardeningLayersDiagram,
};

export default function DockerDevOpsPage() {
  return (
    <DeepDivePage
      eyebrow="Docker & DevOps"
      title="Infrastructure, explained"
      intro="Two projects from the 1337 (42 Network) curriculum and freelance work — one about isolating services with containers, one about hardening a real server. Here's what each one does and the operational concept behind it."
      items={DOCKER_DEVOPS_PROJECTS}
      diagrams={DIAGRAMS}
    />
  );
}
