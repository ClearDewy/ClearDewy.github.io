import { sidebar } from "vuepress-theme-hope";
import {ACMSidebar} from "./sidebars/ACMSidebar";
import {ProjectsSidebar} from "./sidebars/ProjectsSidebar";
import {ProblemSolveSidebar} from "./sidebars/ProblemSolveSidebar"
import {DewySidebar} from "./sidebars/Dewy-docs"


export const Sidebar = sidebar({
    '/ACM-docs/': ACMSidebar,
    "/Projects-docs/":ProjectsSidebar,
    "/ProblemSolve-docs/":ProblemSolveSidebar,
    "/Dewy-docs/":DewySidebar
});
