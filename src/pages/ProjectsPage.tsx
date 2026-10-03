import React from "react";
import PageShell from "./PageShell";
import Projects from "@/scenes/projects";

const ProjectsPage: React.FC = () => (
  <PageShell id="projects" title="projects">
    <Projects />
  </PageShell>
);

export default ProjectsPage;
