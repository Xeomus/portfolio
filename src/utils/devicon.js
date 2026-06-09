const DEVICON_BASE_URL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const aliases = {
  angular: "angularjs",
  angularjs: "angularjs",
  "asp classic": "dot-net",
  aws: "amazonwebservices",
  bootstrap: "bootstrap",
  "c#": "csharp",
  csharp: "csharp",
  css: "css3",
  css3: "css3",
  docker: "docker",
  express: "express",
  "express.js": "express",
  figma: "figma",
  firebase: "firebase",
  git: "git",
  github: "github",
  handlebars: "handlebars",
  html: "html5",
  html5: "html5",
  intellij: "intellij",
  "intellij idea": "intellij",
  java: "java",
  javascript: "javascript",
  js: "javascript",
  mongodb: "mongodb",
  mysql: "mysql",
  "no sql databases": "mongodb",
  "nosql databases": "mongodb",
  node: "nodejs",
  "node.js": "nodejs",
  nodejs: "nodejs",
  postgresql: "postgresql",
  python: "python",
  react: "react",
  sql: "mysql",
  "sql databases": "mysql",
  spring: "spring",
  "spring boot": "spring",
  springboot: "spring",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  typescript: "typescript",
  ts: "typescript",
  vercel: "vercel",
  vite: "vitejs",
  "vs code": "vscode",
  vscode: "vscode",
  "visual studio code": "vscode",
  vue: "vuejs",
  vuejs: "vuejs",
};

const variants = {
  angularjs: "original",
  amazonwebservices: "original-wordmark",
  express: "original",
  firebase: "plain",
  github: "original",
  intellij: "original",
  spring: "original",
  vercel: "original",
  vscode: "original",
};

function normalizeTechName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll(".", ".");
}

export function getDevicon(name) {
  const normalizedName = normalizeTechName(name);
  const slug = aliases[normalizedName];

  if (!slug) {
    return {
      alt: `${name} icon`,
      label: name,
      src: "",
    };
  }

  const variant = variants[slug] || "original";

  return {
    alt: `${name} icon`,
    fallbackSrc: `${DEVICON_BASE_URL}/${slug}/${slug}-plain.svg`,
    label: name,
    src: `${DEVICON_BASE_URL}/${slug}/${slug}-${variant}.svg`,
  };
}

export function useDeviconFallback(event, name) {
  const icon = getDevicon(name);

  if (!icon.fallbackSrc || event.target.src === icon.fallbackSrc) {
    event.target.style.display = "none";
    return;
  }

  event.target.src = icon.fallbackSrc;
}
