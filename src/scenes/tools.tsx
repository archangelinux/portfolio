import React from "react";
import { motion } from "framer-motion";
import {
  FaJava,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaDocker,
  FaAws,
  FaGoogle,
  FaFigma,
  FaReact
} from "react-icons/fa";
import {
  SiTypescript,
  SiCplusplus,
  SiMysql,
  SiExpress,
  SiNextdotjs,
  SiFlask,
  SiFastapi,
  SiTerraform,
  SiFirebase,
  SiTableau
} from "react-icons/si";

import AzureLogo from "@/assets/azure.svg";
import CLogo from "@/assets/c.svg";

const tools = [
  { icon: <FaJava />, label: "Java" },
  { icon: <FaPython />, label: "Python" },
  { icon: <img src={CLogo} alt="C" className="h-6 w-6 text-[#E87A30]" />, label: "C" },
  { icon: <SiCplusplus />, label: "C++" },
  { icon: <SiMysql />, label: "SQL" },
  { icon: <FaJs />, label: "JavaScript" },
  { icon: <SiTypescript />, label: "TypeScript" },
  { icon: <FaHtml5 />, label: "HTML5" },
  { icon: <FaCss3Alt />, label: "CSS3" },

  { icon: <FaReact />, label: "React" },
  { icon: <SiNextdotjs />, label: "Next.js" },
  { icon: <SiExpress />, label: "Express" },
  { icon: <SiFlask />, label: "Flask" },
  { icon: <SiFastapi />, label: "FastAPI" },

  { icon: <FaAws />, label: "AWS" },
  { icon: <img src={AzureLogo} alt="Azure" className="h-6 w-6 text-[#E87A30]" />, label: "Azure" },
  { icon: <FaGoogle />, label: "GCP" },
  { icon: <FaDocker />, label: "Docker" },
  { icon: <SiTerraform />, label: "Terraform" },
  { icon: <SiFirebase />, label: "Firebase" },
  { icon: <FaFigma />, label: "Figma" },
  { icon: <SiTableau />, label: "Tableau" }
];

const ToolItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="flex items-center space-x-2 px-4 py-2 border-[#3F534E] border-2 rounded-full"
  >
    <span className="text-xl text-[#E87A30] flex-shrink-0">{icon}</span>
    <span className="text-sm font-medium text-[#d3cbb8]">{label}</span>
  </motion.div>
);

const ToolsSection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="mt-12 mb-20 w-full max-w-6xl mx-auto"
  >
    <h4 className = "text-2xl text-center">Tools</h4>
    <div className="p-6 ">
      <div className="flex flex-wrap gap-3 justify-center">
        {tools.map((tool, i) => (
          <ToolItem key={i} icon={tool.icon} label={tool.label} />
        ))}
      </div>
    </div>
  </motion.div>
);

export default ToolsSection;