import SepCon from 'sepcon';
import todoRemove from 'app/components/todo-remove';
import todoTitle from 'app/components/todo-title';
import todoStatus from 'app/components/todo-status';
import {COMP_TODO_ITEM, MOD_TODOS} from 'app/constants';


export default SepCon.createComponent({id: COMP_TODO_ITEM}, {
    state: {
        props: {
            local: {
                id: null,
                text: '',
                status: 0
            }
        },
        methods: {
            local: {
                setStatus(next, status) {
                    next(this.getProps().id, status);
                },
                remove(next) {
                    next(this.getProps().id);
                }
            },
            global: {
                setStatus: {
                    modifier: MOD_TODOS,
                    key: 'setStatus'
                },
                remove: {
                    modifier: MOD_TODOS,
                    key: 'remove'
                }
            }
        },
        lifecycle: {
            change(changed) {
                if(changed.status && Object.keys(changed).length === 1) {
                    return false;
                }
            }
        }
    },
    view: {
        lifecycle: {
            render() {
                const remove = todoRemove.createTag().refMethods({remove: 'remove'});
                const title = todoTitle.createTag().refProps({value: 'text'});
                const status = todoStatus.createTag()
                    .refProps({status: 'status'})
                    .refMethods({setStatus: 'setStatus'});
                return `<div class="todo-item">${remove} ${title} ${status}</div>`;
            }
        }
    }
});