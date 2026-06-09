export const githubUsername = "Xeomus";

export const stats = [
  { value: "0", label: "stars" },
  { value: "0", label: "contributions" },
  { value: "0", label: "repositorios" },
  { value: "0", label: "Github followers" },
];

export const experiences = [
  {
    mark: "2",
    title: "Backend Developer",
    company: "Pro Internet",
    date: "Nov 2024 - Oct 2025",
    location: "Prescencial",
    badge: "Web Development",
    summary:
      "Designed and developed backend solutions for business applications, focusing on API development, database optimization, system scalability, and the migration of legacy platforms to modern web architectures.",
    bullets: [
      "Development of robust applications using Node.js, Express, and SQL, integrating dynamic interfaves with Handlebars and styling with CSS.",
      "Implementaion of optimized RESTful APIs, improving perfomance thorugh adjusments in SQL queries and system architectrure.",
      "Creation of scalable solutions with clean, secure, and well-structured code, integrating backend services with frontend interfaces to deliver seamless user experiences.",
      "Active participation in the migration of legacy systems(ASP Classic and traditional ASP) to modern web technologies, ensuring data integrity and system reliability throughout the process.",
    ],
    stack: ["Express", "Node.js", "SQL", "Handlebars", "Asp Classic"],
  },

  {
    mark: "1",
    title: "Web Development and Testing Intern",
    company: "GBCI Group",
    date: "Dec 2023 - Oct 2024",
    location: "Prescencial",
    badge: "Web Development",
    summary:
      "Contributed to the development, testing, and optimization of web applications using React, Python, and SQL. Worked in Agile teams, built responsive user interfaces, improved database performance, and ensured software quality through testing and team collaboration.",
    bullets: [
      "Hands-on expirience in web application during my profesional Intership. I have implemented functional projects using technologies sush as React, Python and SQL, demostrating strong skills as a full stack developer.",
      "Project develoment following Agaile methodology, applying Scrum practices and collaborative mananagement with Git, GitHub and Jira.",
      "Responsible for testing functionalities developed by the team, ensuring quality and proper performance. I also provided technical support to new members to help them integrate into the project. ",
      "Implemented visual interfaces using component libraries (Ant Design, Bootstrap) to deliver a modern and responsive user experience. ",
      "Optimized database queries to improve application performance and efficiency. ",
    ],
    stack: ["React", "Python", "MySQL", "AWS"],
  },
];

export const technologies = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "C#", "Java", "HTML", "CSS"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["Vue", "React", "Angular", "Spring Boot", "Node.js", "Express"],
  },
  {
    category: "Databases & Cloud",
    items: ["SQL", "Firebase", "MongoDB"],
  },
  {
    category: "Tools",
    items: ["GitHub", "Git", "IntelliJ", "VS Code"],
  },
];

export const contributionWeeks = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const seed = (week * 11 + day * 7 + 3) % 9;
    return seed > 6 ? 4 : seed > 4 ? 3 : seed > 2 ? 2 : seed > 0 ? 1 : 0;
  }),
);
