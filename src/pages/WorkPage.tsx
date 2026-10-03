import React from "react";
import PageShell from "./PageShell";
import Experience from "@/scenes/experience";
import ToolsSection from "@/scenes/tools";

const WorkPage: React.FC = () => (
  <PageShell id="work" title="work">
    <Experience />
    <hr className="border-0 border-t border-ink/[0.08] mt-20 md:mt-28" />
    <section className="pt-16 md:pt-20">
      <ToolsSection />
    </section>
  </PageShell>
);

export default WorkPage;
