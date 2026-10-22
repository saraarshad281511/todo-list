
import { saveProjects } from "./storage";
import createTodo from "./todo";
import createProject from "./project";

const todoForm = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");
const descriptionInput = document.getElementById("todo-description");
const dueDateInput = document.getElementById("todo-due-date");
const priorityInput = document.getElementById("todo-priority");

const projectsSection = document.querySelector("#projects-section");
const todosContainer = document.querySelector("#todos-container");
const addProjectButton = document.querySelector("#add-project-btn");
const sortTodosSelect = document.querySelector("#sort-todos");
const filterTodosSelect = document.querySelector("#filter-todos");

let currentProject = null;
let projectsReference = [];

// Set up the todo form
const setupTodoForm = (projects) => {
    projectsReference = projects;

    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const description = descriptionInput.value;
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (title === "") {
            alert("Please enter a todo title!");
            return;
        }

        if (currentProject === null) {
            alert("Please select a project first!");
            return;
        }

        const todo = createTodo(
            title,
            description,
            dueDate,
            priority
        );

        currentProject.addTodo(todo);

        saveProjects(projectsReference);
        renderTodos(currentProject.todos, projectsReference);

        todoForm.reset();
    });
};

// Render a single todo
const renderTodo = (todo, projects = projectsReference) => {
    const todoElement = document.createElement("div");

   todoElement.classList.add("todo-item");
todoElement.classList.add(`priority-${todo.priority.toLowerCase()}`);

if (todo.completed) {
    todoElement.classList.add("completed");
}

    const titleElement = document.createElement("h3");
    titleElement.textContent = todo.title;
    todoElement.appendChild(titleElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = todo.description;
    todoElement.appendChild(descriptionElement);

    const dueDateElement = document.createElement("p");
    dueDateElement.textContent = todo.dueDate;
    todoElement.appendChild(dueDateElement);

    const priorityElement = document.createElement("p");
    priorityElement.textContent = todo.priority;
    todoElement.appendChild(priorityElement);

    // Completion checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute(
        "aria-label",
        `Mark ${todo.title} as completed`
    );
    todoElement.appendChild(checkbox);

    const completedElement = document.createElement("p");
    completedElement.textContent = todo.completed
        ? "Completed"
        : "Not completed";
    todoElement.appendChild(completedElement);

   checkbox.addEventListener("change", () => {
    todo.toggleComplete();

    completedElement.textContent = todo.completed
        ? "Completed"
        : "Not completed";

    todoElement.classList.toggle("completed", todo.completed);

    saveProjects(projects);
});

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        if (currentProject === null) {
            return;
        }

        currentProject.removeTodo(todo);

        saveProjects(projects);
        renderTodos(currentProject.todos, projects);
    });

    todoElement.appendChild(deleteButton);

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        const newTitle = prompt("Enter the new title:", todo.title);

        if (newTitle === null || newTitle.trim() === "") {
            return;
        }

        const newDescription = prompt(
            "Enter the new description:",
            todo.description
        );

        if (newDescription === null) {
            return;
        }

        const newDueDate = prompt(
            "Enter the new due date:",
            todo.dueDate
        );

        if (newDueDate === null) {
            return;
        }

        const newPriority = prompt(
            "Enter the new priority (Low, Medium, High):",
            todo.priority
        );

        if (newPriority === null) {
            return;
        }

        todo.title = newTitle.trim();
        todo.description = newDescription;
        todo.dueDate = newDueDate;
        todo.priority = newPriority;

        saveProjects(projects);
        renderTodos(currentProject.todos, projects);
    });

    todoElement.appendChild(editButton);
    todosContainer.appendChild(todoElement);
};

// Render all todos
const renderTodos = (todos, projects = projectsReference) => {
    todosContainer.textContent = "";

    const sortedTodos = [...todos];

    if (sortTodosSelect.value === "dueDate") {
        sortedTodos.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }

    if (sortTodosSelect.value === "priority") {
        const priorityOrder = {
            High: 3,
            Medium: 2,
            Low: 1
        };

        sortedTodos.sort((a, b) => {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

  const filterValue = filterTodosSelect.value;

const filteredTodos = sortedTodos.filter((todo) => {
    if (filterValue === "active") {
        return !todo.completed;
    }

    if (filterValue === "completed") {
        return todo.completed;
    }

    return true;
});

filteredTodos.forEach((todo) => {
    renderTodo(todo, projects);
});
};

// Render a project button
const renderProject = (project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-item");

    const nameElement = document.createElement("button");
    nameElement.textContent = project.name;

    nameElement.addEventListener("click", () => {
        currentProject = project;

        // Remove selection from all project buttons
        const projectButtons =
            projectsSection.querySelectorAll("button");

        projectButtons.forEach((button) => {
            button.classList.remove("selected-project");
        });

        // Highlight the selected project
        nameElement.classList.add("selected-project");

        // Display its todos
        renderTodos(project.todos, projectsReference);
    });

    projectElement.appendChild(nameElement);
    projectsSection.appendChild(projectElement);
};

// Set up project creation
const setupAddProjectButton = (projects) => {
    projectsReference = projects;

    addProjectButton.addEventListener("click", () => {
        const projectName = prompt("Enter your project name:");

        if (projectName === null || projectName.trim() === "") {
            return;
        }

        const project = createProject(projectName.trim());

        projects.push(project);
        saveProjects(projects);

        renderProject(project);
    });
};


filterTodosSelect.addEventListener("change", () => {
    if (currentProject !== null) {
        renderTodos(currentProject.todos, projectsReference);
    }
});

export {
    renderTodo,
    renderTodos,
    renderProject,
    setupAddProjectButton,
    setupTodoForm
};
