import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Droplets,
  BoomBox,
  NotebookPen,
  Dumbbell,
  Film,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Globe,
  Shell,
  HeartPulse,
  Satellite,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import LooTN from "@/assets/loolooloo-thumbnail.svg";
import ThoughtMirrorTN from "@/assets/thoughtmirror-thumbnail.svg";
import BeFitTN from "@/assets/befit-thumbnail-1.svg";
import RadBotTN from "@/assets/radiobot-thumbnail.svg";
import WamTN from "@/assets/sample-wam-thumbnail.svg";
import RouviaTN from "@/assets/rouvia_thumbnail 1.svg";
import EcoscoreTN from "@/assets/ecoscore-thumbnail.png";
import CorallTN from "@/assets/corall-thumbnail.png";
import MedUnityTN from "@/assets/medunity-thumbnail.png";
import HaloTN from "@/assets/halo.png";
import { toolColorLookup } from "@/scenes/toolColors";

const tagColorMap: Record<string, { text: string; border: string }> = {
  gold: { text: "text-gold/70", border: "border-gold/25" },
  teal: { text: "text-teal/70", border: "border-teal/25" },
  copper: { text: "text-copper/70", border: "border-copper/25" },
  emerald: { text: "text-emerald/70", border: "border-emerald/25" },
  rose: { text: "text-rose/70", border: "border-rose/25" },
  blue: { text: "text-blue/70", border: "border-blue/25" },
  purple: { text: "text-purple/70", border: "border-purple/25" },
  yellow: { text: "text-yellow/70", border: "border-yellow/25" },
  "space-gray": { text: "text-space-gray/70", border: "border-space-gray/25" },
};

// Aliases for project tags that don't exactly match tool labels
const tagAliases: Record<string, string> = {
  "Typescript": "TypeScript",
  "C++": "C++/C",
  "C": "C++/C",
};

function getTagClasses(tag: string): string {
  const resolved = tagAliases[tag] || tag;
  const color = toolColorLookup[resolved];
  const mapped = color ? tagColorMap[color] : null;
  if (mapped) return `${mapped.text} ${mapped.border}`;
  return "text-copper/70 border-copper/25";
}

type ViewMode = "list" | "spotlight";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  button1: string;
  button2: string;
  b1src: string;
  b2src: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: 8,
    title: "Corall",
    description:
      "The intelligence layer for your network. An AI-powered platform that turns real-world interactions into lasting, searchable connections with smart LinkedIn syncing, second-degree discovery, contextual AI search, and automated follow-ups.",
    image: CorallTN,
    icon: <Shell className="w-5 h-5" />,
    button1: "Site",
    button2: "Chrome Extension",
    b1src: "https://corall.co",
    b2src: "https://chromewebstore.google.com/detail/corall-linkedin-sync/iddhdggpdifeiiejfnemhmhddhdadbgg",
    tags: ["Full-Stack Dev", "Product Design"],
  },
  {
    id: 10,
    title: "HALO",
    description:
      "Google DeepMind Build With Gemma Kaggle Competition | Hypothesis Arbitration for Link Outages — lets satellites diagnose why a comms link failed and respond on their own, onboard, in real-time. Gemma 4 E4B reads each node's observations and returns a cause, a confidence, and a rationale a flight controller can actually read, with evidence gossiped between passing satellites in 24-byte packets. Simulates real Iridium-NEXT orbits, proves when two failure causes are physically indistinguishable, and replays it all in a React + Three.js UI.",
    image: HaloTN,
    icon: <Satellite className="w-5 h-5" />,
    button1: "Kaggle",
    button2: "Github",
    b1src: "https://www.kaggle.com/competitions/build-with-gemma-triage-in-light-speed/writeups/new-writeup-1785614353507",
    b2src: "https://github.com/archangelinux/halo",
    tags: ["Gemma", "Python", "React", "TypeScript", "Three.js"],
  },
  {
    id: 7,
    title: "Ecoscore",
    description:
      "ElleHacks 2026 | Winner of Best Use of Solana | Makes hidden environmental impact visible during purchase, with product scoring and on-chain corporate donations to NGOs.",
    image: EcoscoreTN,
    icon: <Globe className="w-5 h-5" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/ecoscore-zh63x0",
    b2src: "https://github.com/archangelinux/ecoscore",
    tags: ["Solana", "React", "TypeScript", "Python"],
  },
  {
    id: 1,
    title: "ThoughtMirror",
    description:
      "An AI-powered journaling assistant that identifies cognitive distortions in real-time, offering therapist-inspired guidance, and visually tracking thought patterns over time. Built by fine-tuning Gemini-2.0 on clinician-annotated data and integrating a RAG pipeline using LangChain and real therapist responses to deliver personalized, judgment-free feedback. Winner of Best Generative AI Technology Hack (1st place out of 160+ projects and 600+ participants).",
    image: ThoughtMirrorTN,
    icon: <NotebookPen className="w-5 h-5" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/thoughtmirror",
    b2src: "https://github.com/archangelinux/thought-mirror",
    tags: ["Next.js", "FastAPI", "TypeScript", "Tailwind", "Python", "Firebase"],
  },
  {
    id: 2,
    title: "Rouvia",
    description:
      "A voice-first navigation system that transforms natural language into intelligent route planning. Built to address safety concerns in traditional GPS by enabling hands-free control through OpenAI Whisper transcription and Google Gemini intent parsing. Features a multi-stage processing pipeline that handles unstructured voice input, implements trendiness scoring using Cohere's AI, and integrates MongoDB for personalized location memory.",
    image: RouviaTN,
    icon: <MapPin className="w-5 h-5" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/rouvia",
    b2src: "https://github.com/archangelinux/rouvia",
    tags: ["OpenAI Whisper", "Google Gemini", "Cohere", "MongoDB", "Python"],
  },
  {
    id: 9,
    title: "MedUnity",
    description:
      "A longitudinal health platform that creates a shared layer of medical intelligence. Features an AI-powered triage system fine-tuned on CTAS 2025 (the Canadian Triage and Acuity Scale), real-time ER demand projections for healthcare providers with cluster detection and diversion recommendations, and community health resource dashboards. Fine-tuned Gemini 2.5 Flash on Vertex AI achieving 77% validation accuracy on 5-class CTAS classification, with an agentic Railtracks framework powering deterministic ER analytics.",
    image: MedUnityTN,
    icon: <HeartPulse className="w-5 h-5" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/medunity",
    b2src: "https://github.com/archangelinux/medunity",
    tags: ["Next.js", "FastAPI", "Gemini", "Vertex AI", "Supabase", "TypeScript", "Python"],
  },
  {
    id: 3,
    title: "www.LooLooLoo",
    description:
      "Hack The North 2024 - Sponsor Award Winner (Defang) | A full-stack web app that detects nearby water fountains and routes users to bathrooms using a ESP32-based Bluetooth beacon. Features a notification system (Twilio's API), dynamic routing (MappedIn's API), and a mobile UI for hydration tracking.",
    image: LooTN,
    icon: <Droplets className="w-5 h-5" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/waterwaterwater-loolooloo",
    b2src: "https://github.com/archangelinux/loolooloo",
    tags: ["ESP32", "React", "Express.js", "TypeScript", "Docker"],
  },
  {
    id: 4,
    title: "Befit",
    description:
      "Hack Western 2024 - Sponsor Award Winner (Tempolabs) | An AI-driven fitness trainer designed to enhance workouts through real-time form correction and scoring with OpenCV. Compares user performance against workout videos using Mediapipe, generates gamified workout plans, and integrates intuitive hand-gesture controls.",
    image: BeFitTN,
    icon: <Dumbbell className="w-5 h-5" />,
    button1: "DoraHacks",
    button2: "Github",
    b1src: "https://dorahacks.io/buidl/20376",
    b2src: "https://github.com/archangelinux/be-fit",
    tags: ["Typescript", "Tailwind", "React", "JavaScript"],
  },
  {
    id: 5,
    title: "Wat-A-Moment",
    description:
      "A digital photo booth platform that enables users to instantly upload and share photos with their social networks. Features automated metadata management, secure token-based authentication, and cloud storage.",
    image: WamTN,
    icon: <Film className="w-5 h-5" />,
    button1: "",
    button2: "",
    b1src: "",
    b2src: "",
    tags: ["Raspberry Pi", "Flask", "Express.js", "SQL", "Python", "HTML/CSS"],
  },
  {
    id: 6,
    title: "RadBot",
    description:
      "A portable FM radio system paired with a rotary encoder and TEA5767 module, enhanced with a car attachment that uses ultrasonic and infrared sensors to autonomously follow the user.",
    image: RadBotTN,
    icon: <BoomBox className="w-5 h-5" />,
    button1: "",
    button2: "Github",
    b1src: "",
    b2src: "https://github.com/archangelinux/fm-radio-bot",
    tags: ["Arduino", "C++"],
  },
];

const renderProjectDetail = (project: Project) => (
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Image */}
    <div className="lg:w-[55%] flex-shrink-0">
      <img
        className="w-full h-auto object-cover rounded-sm shadow-[0_4px_12px_-2px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.08)]"
        src={project.image}
        alt={project.title}
      />
    </div>

    {/* Info */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-rose">{project.icon}</span>
        <h3 className="text-xl font-bold text-rose">{project.title}</h3>
      </div>

      <p className="text-base-content/80 text-sm leading-relaxed mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag, i) => (
          <span
            key={i}
            className={`text-[11px] px-2 py-0.5 border rounded-sm ${getTagClasses(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        {project.b1src && (
          <a href={project.b1src} target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-copper/40 text-copper text-sm font-medium rounded-sm hover:bg-copper/10 hover:border-copper transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              {project.button1}
            </button>
          </a>
        )}
        {project.b2src && (
          <a href={project.b2src} target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-copper/40 text-copper text-sm font-medium rounded-sm hover:bg-copper/10 hover:border-copper transition-colors">
              {project.button2 === "Github" ? <FaGithub className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
              {project.button2}
            </button>
          </a>
        )}
      </div>
    </div>
  </div>
);

const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (!isAutoplay || viewMode !== "spotlight" || !isInView) return;
    const interval = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projects.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoplay, viewMode, isInView]);

  const stopAutoplay = () => setIsAutoplay(false);

  const handleProjectClick = (index: number) => {
    stopAutoplay();
    setActiveProject(index);
    setViewMode("spotlight");
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    stopAutoplay();
    setViewMode(mode);
  };

  const handleSidebarClick = (index: number) => {
    stopAutoplay();
    setActiveProject(index);
  };

  return (
    <div ref={sectionRef} className="w-full">
      <div className="bg-base-100 rounded-sm overflow-hidden border border-rose/25">
        {/* Panel header with view toggle */}
        <div className="px-6 py-3 border-b border-rose/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose" />
            <span className="text-[10px] font-mono text-rose uppercase tracking-widest">manifest</span>
            <span className="text-[10px] font-mono text-rose/40 uppercase tracking-widest">| projects</span>
          </div>
          <div className="flex items-center gap-1 bg-base-200 border border-rose/20 rounded-sm">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors rounded-sm ${
                viewMode === "list" ? "bg-rose/10 text-rose" : "text-space-gray hover:text-rose"
              }`}
            >
              List
            </button>
            <button
              onClick={() => handleViewModeChange("spotlight")}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors rounded-sm ${
                viewMode === "spotlight" ? "bg-rose/10 text-rose" : "text-space-gray hover:text-rose"
              }`}
            >
              Detail
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2"
            >
              {projects.map((project, index) => {
                const isOdd = projects.length % 2 !== 0;
                const isFirst = index === 0;
                const gridIndex = isOdd ? index - 1 : index;
                const isLeftCol = gridIndex % 2 === 0;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                    onClick={() => handleProjectClick(index)}
                    className={`px-5 py-4 border-b border-rose/20 cursor-pointer hover:bg-rose/5 transition-colors group ${
                      isOdd && isFirst ? "md:col-span-2" : ""
                    } ${isLeftCol && !(isOdd && isFirst) ? "md:border-r md:border-r-rose/10" : ""}`}
                  >
                    {/* Top: icon + title + description */}
                    <div className="flex items-start gap-2.5 mb-2">
                      <span className="text-rose mt-0.5 flex-shrink-0">{project.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-rose font-semibold text-sm mb-0.5 group-hover:text-copper transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-base-content/70 text-xs line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                    {/* Bottom: thumbnail + tags + links */}
                    <div className="flex gap-3 ml-7">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-28 h-20 object-cover rounded-sm flex-shrink-0 shadow-[0_3px_8px_-2px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.08)]"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 4).map((tag, i) => (
                            <span key={i} className={`text-[10px] px-1.5 py-0.5 border rounded-sm ${getTagClasses(tag)}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {project.b1src && (
                            <a
                              href={project.b1src}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-space-gray hover:text-copper transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {project.button1}
                            </a>
                          )}
                          {project.b2src && (
                            <a
                              href={project.b2src}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-space-gray hover:text-copper transition-colors"
                            >
                              {project.button2 === "Github" ? <FaGithub className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                              {project.button2}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="spotlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {/* Icon sidebar */}
              <div className="w-14 flex-shrink-0 border-r border-rose/25 py-3">
                <div className="flex flex-col items-center gap-2">
                  {projects.map((project, index) => (
                    <motion.button
                      key={project.id}
                      onClick={() => handleSidebarClick(index)}
                      className={`relative w-9 h-9 flex items-center justify-center rounded-sm transition-colors ${
                        activeProject === index
                          ? "text-rose"
                          : "text-space-gray hover:text-rose"
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {activeProject === index && (
                        <motion.div
                          layoutId="activeProjectHighlight"
                          className="absolute inset-0 bg-rose/15 rounded-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{project.icon}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Detail content */}
              <div className="flex-1 p-6">
                <button
                  onClick={() => handleViewModeChange("list")}
                  className="flex items-center gap-1 text-space-gray hover:text-rose text-xs mb-4 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to list</span>
                </button>

                <div className="grid">
                  {/* Hidden measurement layer — sizes the grid cell to the tallest project */}
                  {projects.map((project) => (
                    <div
                      key={`measure-${project.id}`}
                      className="row-start-1 col-start-1 invisible"
                      aria-hidden="true"
                    >
                      {renderProjectDetail(project)}
                    </div>
                  ))}

                  {/* Visible cycling layer — only the active project is mounted */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={projects[activeProject].id}
                      className="row-start-1 col-start-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderProjectDetail(projects[activeProject])}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;
