export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Kanban App",
  description:
    "Just another toy app for basic task management. Built with Next.js",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  appNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Boards",
      href: "/boards",
    },
  ],
  links: {
    github: "https://github.com/engrjeff/next-kanban-app",
    jeff: "https://jeffsegovia.dev",
  },
}
