import SepCon from 'sepcon';
import {SERV_TODOS} from 'app/constants';

export default SepCon.createService({id: SERV_TODOS}, {
    todos: [],
    cache: {
        channels: {
            todos: { storage: 'local' }
        }
    },
    channels: {
        todos(ids = false) {
            if(ids) {
                return this.todos
                    .filter(todo => ids.indexOf(todo.tid) >= 0);
            }
            return this.todos;
        }
    },
    requests: {
        addTodo(resolve, reject, todo) {
            this.todos.push(todo);
            this.updateTodos();
        },
        updateTodo(resolve, reject, updatedTodo) {
            this.todos
                .filter(todo => todo.tid === updatedTodo.tid)
                .forEach(todo => {
                    Object.assign(todo, updatedTodo);
                });
            this.updateTodos();
        },
        removeTodo(resolve, reject, tid) {
            this.todos = this.todos
                .filter(todo => todo.tid != tid);
            this.updateTodos();
        }
    },
    lifecycle: {
        mount() {
            const todos = this.getCache('channels', 'todos');
            this.todos = todos ? todos : [];
            this.channels.todos();
        }
    },
    updateTodos() {
        this.clearCache('channels', 'todos');
        this.channels.todos();
    }
});