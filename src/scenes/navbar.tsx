import React from "react";
import GitLogo from "@/assets/github.svg";
import LinkedinLogo from "@/assets/linkedin.svg";

const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h16v3H4V6zm0 5h16v7H4v-7zm2 2v1h2v-1H6zm4 0v1h6v-1h-6z"/>
    <path d="M6 8.5l1.5 1L6 10.5V8.5z"/>
  </svg>
);

const Navbar: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-7 bg-base-100/80 backdrop-blur-md border-b border-gold-light/20">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <a
            href="#home"
            onClick={scrollToTop}
            className="hover:bg-primary/10 transition duration-200 px-2 py-1 rounded-sm"
          >
            <TerminalIcon className="h-4 w-4 text-primary" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/archangelinux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-primary/10 transition duration-200 px-2 py-1 rounded-sm"
          >
            <img src={GitLogo} className="h-4 w-4 opacity-80" alt="GitHub" />
          </a>
          <a
            href="https://www.linkedin.com/in/angelinabai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-primary/10 transition duration-200 px-2 py-1 rounded-sm"
          >
            <img src={LinkedinLogo} className="h-4 w-4 opacity-80" alt="LinkedIn" />
          </a>
          <div className="flex items-center gap-1 ml-2">
            <div className="text-neutral text-xs font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
