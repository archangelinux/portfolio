import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import App from "./App.tsx";
import WritingIndex from "./writing/WritingIndex.tsx";
import WritingPost from "./writing/WritingPost.tsx";
import WorkPage from "./pages/WorkPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";

/* Start each route at the top (unless a hash is present — the page handles it) */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/writing" element={<WritingIndex />} />
        <Route path="/writing/:slug" element={<WritingPost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </StrictMode>
);
