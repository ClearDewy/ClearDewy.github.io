import { sidebar } from "vuepress-theme-hope";
import {ACMSidebar} from "./sidebars/ACMSidebar";
import {ProjectsSidebar} from "./sidebars/ProjectsSidebar";
import {ProblemSolveSidebar} from "./sidebars/ProblemSolveSidebar"
import {DewySidebar} from "./sidebars/Dewy-docs"
import {EnidSidebar} from "./sidebars/Enid-docs";


export const Sidebar = sidebar({
    "/ACM-docs/": ACMSidebar,
    "/Projects-docs/":ProjectsSidebar,
    "/Enid-docs/":EnidSidebar,
    "/ProblemSolve-docs/":ProblemSolveSidebar,
    "/Dewy-docs/":DewySidebar
});
