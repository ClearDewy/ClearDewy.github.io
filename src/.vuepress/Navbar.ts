import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
    '/',
    {
        icon: "qiqiu",
        text: "ACM-Note",
        link: "/ACM-docs/",
    },
    {
        text: "Projects-Note",
        icon: "xiangmu",
        link: "/Projects-docs/",
    },
    {
        text: "Enid-docs",
        icon: "enid",
        link: "/Enid-docs/",
    },
    {
        text: "ProblemSolve-Note",
        icon: "wentijieda",
        link: "/ProblemSolve-docs/",
    },
    {
        text: "ClearDewy-Blog",
        icon: "edit",
        link: "/article/",
    },

]);
