
import createProject from "./project";
import createTodo from "./todo";

const saveProjects = (projects) => {
    localStorage.setItem("projects", JSON.stringify(projects));
};

const loadProjects = () => {
    const savedProjects = localStorage.getItem("projects");

    if (!savedProjects || savedProjects === "undefined") {
        return [];
    }

    const parsedProjects = JSON.parse(savedProjects);

    return parsedProjects.map((savedProject) => {
        const project = createProject(savedProject.name);

        (savedProject.todos || []).forEach((savedTodo) => {
            const todo = createTodo(
                savedTodo.title,
                savedTodo.description,
                savedTodo.dueDate,
                savedTodo.priority
            );

            todo.completed = savedTodo.completed;
            project.addTodo(todo);
        });

        return project;
    });
};

export { saveProjects, loadProjects };
