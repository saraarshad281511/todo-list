
import "./style.css";
import {
    renderTodos,
    renderProject,
    setupAddProjectButton,
    setupTodoForm
} from "./dom";
import { saveProjects, loadProjects } from "./storage";
import createProject from "./project";

// 1. Load saved projects
let projects = loadProjects();

// 2. Create default projects only if none exist
if (projects.length === 0) {
    projects = [
        createProject("Learning"),
        createProject("Work")
    ];

    saveProjects(projects);
}

// 3. Render all projects
projects.forEach((project) => {
    renderProject(project);
});

// 4. Display the first project's todos
if (projects.length > 0) {
    renderTodos(projects[0].todos, projects);

    // Select the first project automatically
    document
        .querySelector("#projects-section button")
        ?.click();
}

// 5. Set up event listeners
setupAddProjectButton(projects);
setupTodoForm(projects);

console.log(projects);
