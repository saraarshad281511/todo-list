const createProject = (name) => {
    return {
        name: name,
        todos: [],

        addTodo(todo) {
            this.todos.push(todo);
        },

        removeTodo(todo) {
            const index = this.todos.indexOf(todo);

            if (index !== -1) {
                this.todos.splice(index, 1);
            }
        },

        findTodoByTitle(title) {
            const todo = this.todos.find((todo) => {
                return todo.title === title;
            });

            return todo;
        }
    };
};

export default createProject;