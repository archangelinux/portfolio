import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, BoomBox, Sprout, NotebookPen, Dumbbell, Film, Grid, List } from 'lucide-react';
import LooTN from "@/assets/loolooloo-thumbnail.svg";
import ThoughtMirrorTN from "@/assets/thoughtmirror-thumbnail.svg";
import BeFitTN from "@/assets/befit-thumbnail-1.svg";
import RadBotTN from "@/assets/radiobot-thumbnail.svg";
import WamTN from "@/assets/sample-wam-thumbnail.svg";
import GrdupTN from "@/assets/gdup-thumbnail.png";

type ViewMode = "spotlight" | "grid";

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

const Projects: React.FC = () => {
    const [activeProject, setActiveProject] = useState<number>(0); //set by Project id
    const [viewMode, setViewMode] = useState<ViewMode>('spotlight');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const projects = [
        {
            id: 1,
            title: "ThoughtMirror",
            description: "GenAI Genesis 2025 Winner | An AI-powered journaling assistant designed to help users recognize and reframe cognitive distortions in real time. ThoughtMirror enhances the journaling experience by identifying distortions within entries, offering therapist-inspired guidance, and visually tracking thought patterns over time. Built by fine-tuning Gemini-2.0 on clinician-annotated data and integrating a RAG pipeline using LangChain and real therapist responses to deliver personalized, judgment-free feedback. Winner of Best Generative AI Technology Hack (🥇 1st place out of 160+ projects and 600+ participants).",
            image: ThoughtMirrorTN,
            icon: <NotebookPen className="w-6 h-6" />,
            button1: "Devpost",
            button2: "Github",
            b1src: "https://devpost.com/software/thoughtmirror",
            b2src: "https://github.com/archangelinux/thought-mirror",
            tags: ["Next.js", "FastAPI", "TypeScript", "Tailwind", "Python", "Firebase"]
        },
        {
            id: 2,
            title: "www.LooLooLoo",
            description: "Hack The North 2024 - Sponsor Award Winner (Defang) | A full-stack web app that detects nearby water fountains and routes users to bathrooms using a ESP32-based Bluetooth beacon. Features a notification system (Twilio's API), dynamic routing (MappedIn's API), and a mobile UI for hydration tracking. Built for reliable scaling through deployment using Defang",
            image: LooTN,
            icon: <Droplets className="w-6 h-6" />,
            button1: "Devpost",
            button2: "Github",
            b1src: "https://devpost.com/software/waterwaterwater-loolooloo",
            b2src: "https://github.com/archangelinux/loolooloo",
            tags: ["ESP32", "React", "Express.js", "TypeScript", "Docker"]
        },
        {
            id: 3,
            title: "Befit",
            description: "Hack Western 2024 - Sponsor Award Winner (Tempolabs) | An AI-driven fitness trainer designed to enhance workouts through real-time form correction and scoring with OpenCV. Compares user performance against workout videos using Mediapipe, generates gamified workout plans, and integrates intuitive hand-gesture controls.",
            image: BeFitTN,
            icon: <Dumbbell className="w-6 h-6" />,
            button1: "DoraHacks",
            button2: "Github",
            b1src: "https://dorahacks.io/buidl/20376",
            b2src: "https://github.com/archangelinux/be-fit",
            tags: ["Typescript", "Tailwind", "React", "JavaScript"]
        },
        {
            id: 4,
            title: "Wat-A-Moment",
            description: "A digital photo booth platform that enables users to instantly upload and share photos with their social networks. Features automated metadata management, secure token-based authentication, and cloud storage - integrating the digital and physical photobooth experience.",
            image: WamTN,
            icon: <Film className="w-6 h-6" />,
            button1: "",
            button2: "",
            b1src: "",
            b2src: "",
            tags: ["Raspberry Pi", "Flask", "Express.js", "SQL", "Python", "HTML/CSS"]
        },
        {
            id: 5,
            title: "RadBot",
            description: "A portable FM radio system paired with a rotary encoder and TEA5767 module, enhanced with a car attachment that uses ultrasonic and infrared sensors to autonomously follow the user.",
            image: RadBotTN,
            icon: <BoomBox className="w-6 h-6" />,
            button1: "",
            button2: "Github",
            b1src: "",
            b2src: "https://github.com/archangelinux/fm-radio-bot",
            tags: ["Arduino", "C++"]
        },
        {
            id: 6,
            title: "Ground Up",
            description: "Designed & developed an educational tool that motivates diligent note-taking and promotes healthy study habits for all ages. Integrated nested React components to achieve functional minimalistic gamification for a rewarding and dynamic experience. Serves as a paperless visual aid, allowing users to track and address important questions to better prepare for assessments.",
            image: GrdupTN,
            icon: <Sprout className="w-6 h-6" />,
            button1: "",
            button2: "Github",
            b1src: "",
            b2src: "https://github.com/archangelinux/ground-up",
            tags: ["JavaScript", "React", "HTML/CSS"]
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                root: null, //use viewport as root
                rootMargin: '0px',
                threshold: 0.2, //trigger at 20% visible
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleProjectClick = (index: number) => {
        setActiveProject(index);
        //switch to spotlight mode when a project is clicked in grid view
        if (viewMode === 'grid') {
            setViewMode('spotlight');
        }
        const element = document.querySelector("#projects")
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'spotlight' ? 'grid' : 'spotlight');
    };

    return (
        <div
            ref={sectionRef}
            id="projects"
            className="flex flex-col items-center w-full px-4 sm:px-10 min-h-[70vh]"
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="w-full max-w-full mb-20 flex justify-between items-center ml-20"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                        >
                            <motion.button
                                onClick={toggleViewMode}
                                className="flex items-center gap-2 px-4 py-2 border-slate-100 border-2 rounded-lg hover:border-[#ff6600] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {viewMode === 'spotlight' ? (
                                    <>
                                        <Grid className="w-5 h-5" />
                                        <span>Grid View</span>
                                    </>
                                ) : (
                                    <>
                                        <List className="w-5 h-5" />
                                        <span>Spotlight View</span>
                                    </>
                                )}
                            </motion.button>
                        </motion.div>

                        <div className="flex flex-col justify-left items-left sm:flex-row max-w-full w-full min-w-[300px]">
                            <AnimatePresence>
                                {viewMode === 'spotlight' && (
                                    <motion.div
                                        className="w-full sm:w-20 sm:mr-8 mb-6 sm:mb-0"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/*icon menu - hide when in grid view*/}
                                        <div className="sm:top-24 flex flex-row sm:flex-col justify-center sm:justify-start items-center space-y-0 space-x-4 sm:space-x-0 sm:space-y-8">
                                            {projects.map((project, index) => (
                                                <motion.div
                                                    key={project.id}
                                                    onClick={() => handleProjectClick(index)}
                                                    className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 
                                                              ${activeProject === index ? 'bg-[#FFB347] text-white' : 'bg-[#3F534E] text-slate-100 hover:bg-gray-300'}`}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    animate={{
                                                        scale: activeProject === index ? 1.1 : 1,
                                                        transition: { type: "spring", stiffness: 300, damping: 15 }
                                                    }}
                                                >
                                                    {project.icon}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {viewMode === 'spotlight' ? (
                                    <motion.div
                                        key="spotlight-view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-1 w-full"
                                    >
                                        {/*spotlighted project panel*/}
                                        <div className="flex-1">
                                            <AnimatePresence mode="wait">
                                                <ProjectSpotlight key={projects[activeProject].id} project={projects[activeProject]} />
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="grid-view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-full max-w-full"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                                            {projects.map((project, index) => (
                                                <ProjectCard
                                                    key={project.id}
                                                    project={project}
                                                    index={index}
                                                    onClick={() => handleProjectClick(index)}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Projects;



//for spotlight mode
interface SpotlightProps { project: Project }
const ProjectSpotlight: React.FC<SpotlightProps> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            layout
            className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-10 h-full max-w-full bg-[#3F534E] rounded-xl shadow-lg"
        >
            <div className="w-full lg:w-1/2 perspective-1000">
                <motion.div
                    className="w-full rounded-lg overflow-hidden shadow-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    style={{ perspective: 900, transformStyle: 'preserve-3d' }}
                >
                    <img
                        className="w-full h-full object-cover"
                        src={project.image}
                        alt={project.title}
                    />
                </motion.div>
            </div>

            <div className="w-full lg:w-1/2">
                <motion.div
                    className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                >
                    <motion.div
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 text-[#294240] rounded-full"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        {project.icon}
                    </motion.div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-100">{project.title}</h3>
                </motion.div>

                <motion.p
                    className="text-slate-100 mb-4 md:mb-6 text-sm md:text-base"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                >
                    {project.description}
                </motion.p>

                <motion.div
                    className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                >
                    {project.tags.map((tag, index) => (
                        <motion.span
                            key={index}
                            className="px-2 md:px-3 py-1 bg-slate-100 text-[#294240] text-xs md:text-sm font-medium rounded-full"
                        >
                            {tag}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-2 md:gap-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                >
                    {project.button1 !== "" && (
                        <a href={project.b1src} target="_blank" rel="noopener noreferrer">
                            <motion.button
                                className="px-3 md:px-4 lg:px-6 py-2 w-full sm:w-auto bg-[#FDECBF] text-[#294240] text-sm md:text-base font-medium rounded-lg hover:bg-[#fdecbfd9]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {project.button1}
                            </motion.button>
                        </a>
                    )}
                    {project.button2 !== "" && (
                        <a href={project.b2src} target="_blank" rel="noopener noreferrer">
                            <motion.button
                                className="px-3 md:px-4 lg:px-6 py-2 w-full sm:w-auto bg-[#FDECBF] text-[#294240] text-sm md:text-base font-medium rounded-lg hover:bg-[#fdecbfd9]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {project.button2}
                            </motion.button>
                        </a>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

//for grid mode
interface ProjectCardProps {
    project: Project,
    index: number,
    onClick: () => void
}
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
                transition: { type: "spring", stiffness: 400, damping: 40 }
            }}
            onClick={onClick}
            className="bg-[#3F534E] rounded-xl overflow-hidden shadow-lg flex flex-col w-full max-w-full self-stretch cursor-pointer"
        >
            <div className="h-48 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-100 text-[#294240] rounded-full">
                        {project.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100">{project.title}</h3>
                </div>

                <p className="text-slate-100 text-xs sm:text-sm mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                    {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-[#294240] text-xs font-medium rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex gap-2 min-w-full">
                    {project.button1 === "" && project.button2 === "" ? (
                        <div className="w-full h-10" />
                    ) : project.button1 !== "" && project.button2 !== "" ? (
                        // two buttons
                        <>
                            <a href={project.b1src} target="_blank" rel="noopener noreferrer" className = "flex-1 w-full">
                                <motion.button
                                    className="flex-1 py-2 text-xs sm:text-sm bg-[#FDECBF] text-[#294240] font-medium rounded-lg hover:bg-[#fdecbfd9] w-full"
                                    onClick={(e) => e.stopPropagation()}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {project.button1}
                                </motion.button>
                            </a>
                            <a href={project.b2src} target="_blank" rel="noopener noreferrer" className = "flex-1 w-full">
                                <motion.button
                                    className="flex-1 py-2 text-xs sm:text-sm bg-[#FDECBF] text-[#294240] font-medium rounded-lg hover:bg-[#fdecbfd9] w-full"
                                    onClick={(e) => e.stopPropagation()}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {project.button2}
                                </motion.button>
                            </a>
                        </>
                    ) : (
                        //one button, take full width
                        <a
                            href={project.b1src || project.b2src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 w-full"
                        >
                            <motion.button
                                className="flex-1 py-2 text-xs sm:text-sm bg-[#FDECBF] text-[#294240] font-medium rounded-lg hover:bg-[#fdecbfd9] w-full"
                                onClick={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {project.button1 || project.button2}
                            </motion.button>
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}