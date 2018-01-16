import SepCon from 'sepcon';
import todoItem from 'app/components/todo-item';
import {COMP_TODO_LIST, DATA_TODO_ITEMS, TODO_STATUS} from 'app/constants';

export default SepCon.createComponent({id: COMP_TODO_LIST}, {
    state: {
        props: {
            global: {
                todos: {
                    data: DATA_TODO_ITEMS,
                    key: 'todos'
                }
            }
        }
    },
    view: {
        setClasses: false,
        lifecycle: {
            on: {
                render(changed) {
                    if(changed && typeof changed === 'object') {
                        if(changed.todos && changed.todos.newValue.length === changed.todos.oldValue.length) {
                            this.setClasses = true;
                            return;
                        }
                    }
                    this.setClasses = false;
                    return this.createTodoListHTML();
                }
            },
            post: {
                render() {
                    if(this.setClasses) {
                        this.addStatusClassToItem();
                        this.setClasses = false;
                    }
                }
            }
        },
        createTodoListHTML() {
            const list = this.props.todos.map((todo, idx) => {
                const liStatusClass = this.getStatusAsClass(todo.status);
                const prefix = 'todos.' + idx + '.';
                return `<li class="${liStatusClass}">${todoItem.createTag()
                    .id(idx)
                    .refProps({
                        id: prefix + 'tid',
                        text: prefix + 'title',
                        status: prefix + 'status'
                    })}</li>`;
            });
            return `<ul class="todo-list">${list.join('')}</ul>`;
        },
        addStatusClassToItem() {
            const todoLis = this.element.querySelector('ul').children;
            this.props.todos.forEach((todo, idx) => {
                const liStatusClass = this.getStatusAsClass(todo.status);
                todoLis[idx].className = liStatusClass;
            });
        },
        getStatusAsClass(status) {
            return TODO_STATUS.labels[status].toLowerCase().replace(/ /g, '-');
        }
    }
});