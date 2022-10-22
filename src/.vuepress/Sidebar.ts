import { sidebar } from "vuepress-theme-hope";
import {ACMSidebar} from "./sidebars/ACMSidebar";
import {ProjectsSidebar} from "./sidebars/ProjectsSidebar";
import {ProblemSolveSidebar} from "./sidebars/ProblemSolveSidebar"


export const Sidebar = sidebar({
    '/ACM-docs/': ACMSidebar,
    "/Projects-docs/":ProjectsSidebar,
    "/ProblemSolve-docs/":ProblemSolveSidebar,
});
