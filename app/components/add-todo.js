import SepCon from 'sepcon';
import {COMP_ADD_TODO, MOD_TODOS, ADD_TODO_INPUT_PLACEHOLDER, ADD_TODO_BUTTON_LABEL} from 'app/constants';

export default SepCon.createComponent({id: COMP_ADD_TODO}, {
    state: {
        methods: {
            local: {
                add(next, title) {
                    next({ title });
                }
            },
            global: {
                add: {
                    modifier: MOD_TODOS,
                    key: 'add'
                }
            }
        }
    },
    view: {
        events: [
            {
                selector: 'button',
                event: 'click',
                callback: 'addTodo'
            }
        ],
        lifecycle: {
            render() {
                return `<div class="todo-input">
                            <div class="type">
                                <span class="icon-plus"></span>
                                <input type="text" name="todo-title" placeholder="${ADD_TODO_INPUT_PLACEHOLDER}" />
                            </div>
                            <button>${ADD_TODO_BUTTON_LABEL}</button>
                        </div>`;
            }
        },
        addTodo() {
            const el = this.element.querySelector('input[name="todo-title"]');
            const title = el.value;
            this.methods.add(title);
            el.value = '';
        }
    }
});