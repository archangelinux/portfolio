// Per-tool color lookup: tool label -> color name
// Used by projects.tsx for tag color correspondence
const toolColorLookup: Record<string, string> = {
  // Languages
  Python: "blue",
  Java: "rose",
  "C++/C": "blue",
  TypeScript: "blue",
  JavaScript: "yellow",
  SQL: "blue",
  "HTML/CSS": "copper",
  "Elixir/Erlang": "purple",
  // Frameworks
  React: "blue",
  "Next.js": "space-gray",
  "Express.js": "space-gray",
  "Node.js": "emerald",
  FastAPI: "teal",
  Flask: "space-gray",
  Phoenix: "copper",
  LangChain: "emerald",
  CrewAI: "copper",
  PyTorch: "rose",
  TensorFlow: "copper",
  // Cloud & Data
  AWS: "gold",
  Azure: "blue",
  GCP: "blue",
  Terraform: "purple",
  Docker: "blue",
  Kubernetes: "blue",
  PostgreSQL: "blue",
  Supabase: "emerald",
  Firebase: "yellow",
  MongoDB: "emerald",
  // Tools
  Git: "rose",
  Linux: "yellow",
  "RESTful APIs": "teal",
  WebSockets: "copper",
  "Distributed Sys": "blue",
  "GenAI/LLMs": "purple",
  "SDLC/Agile": "teal",
  "CI/CD": "emerald",
  Figma: "purple",
  Gemini: "blue",
  Gemma: "blue",
  "Three.js": "space-gray",
  "Vertex AI": "blue",
  Mapbox: "teal",
  Railtracks: "emerald",
  // Roles
  "Full-Stack Dev": "teal",
  "Product Design": "purple",
};

export { toolColorLookup };
