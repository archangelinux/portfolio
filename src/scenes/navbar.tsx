import React, { useState, useEffect } from "react";
import GitLogo from "@/assets/github.svg";
import LinkedinLogo from "@/assets/linkedin.svg";

const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h16v3H4V6zm0 5h16v7H4v-7zm2 2v1h2v-1H6zm4 0v1h6v-1h-6z"/>
    <path d="M6 8.5l1.5 1L6 10.5V8.5z"/>
  </svg>
);

const Navbar: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("home");

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();

    //smooth scroll to the element
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "experience", "projects", "connect"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-7 bg-[#2A3D36] border-b border-[#E87A30]/20">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Cloud icon and menu items */}
        <div className="flex items-center gap-4">
          {/* Terminal Icon - like Apple logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="hover:bg-[#E87A30]/10 transition duration-200 px-2 py-1 rounded"
          >
            <TerminalIcon className="h-4 w-4 text-[#FDECBF]" />
          </a>

          {/* Menu Items */}
          <a
            href="#experience"
            className={`text-[#FDECBF] hover:bg-[#E87A30]/10 transition duration-200 px-2 py-1 rounded text-xs ${
              currentSection === "experience" ? "font-bold" : "font-medium"
            }`}
            onClick={(e) => handleLinkClick(e, "#experience")}
          >
            Work
          </a>
          <a
            href="#projects"
            className={`text-[#FDECBF] hover:bg-[#E87A30]/10 transition duration-200 px-2 py-1 rounded text-xs ${
              currentSection === "projects" ? "font-bold" : "font-medium"
            }`}
            onClick={(e) => handleLinkClick(e, "#projects")}
          >
            Build
          </a>
          <a
            href="#connect"
            className={`text-[#FDECBF] hover:bg-[#E87A30]/10 transition duration-200 px-2 py-1 rounded text-xs ${
              currentSection === "connect" ? "font-bold" : "font-medium"
            }`}
            onClick={(e) => handleLinkClick(e, "#connect")}
          >
            Connect
          </a>
        </div>

        {/* Right side - Social icons and system-like items */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/archangelinux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-[#E87A30]/10 transition duration-200 px-2 py-1 rounded"
          >
            <img src={GitLogo} className="h-4 w-4 opacity-80" alt="GitHub" />
          </a>
          <a
            href="https://www.linkedin.com/in/angelinabai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-[#E87A30]/10 transition duration-200 px-2 py-1 rounded"
          >
            <img src={LinkedinLogo} className="h-4 w-4 opacity-80" alt="LinkedIn" />
          </a>

          {/* System-like indicators */}
          <div className="flex items-center gap-1 ml-2">
            <div className="text-[#FDECBF] text-xs font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
