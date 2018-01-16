import SepCon from 'sepcon';
import {MOD_TODOS, SERV_TODOS, DATA_TODO_ITEMS} from 'app/constants';

export default SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {
            todo = Object.assign({
                tid: SepCon.createUid(),
                status: 0
            }, todo);
            SepCon.service(SERV_TODOS).requests.addTodo(todo);
        },
        remove(tid) {
            SepCon.service(SERV_TODOS).requests.removeTodo(tid);
        },
        setStatus(tid, status) {
            let {todos} = this.getProps(DATA_TODO_ITEMS);
            let todo = todos
                .filter(todo => todo.tid === tid)[0];
            todo.status = status;
            SepCon.service(SERV_TODOS).requests.updateTodo(todo);
        }
    },
    lifecycle: {
        mount() {
            SepCon.service(SERV_TODOS).channels.todos(MOD_TODOS, this.updateTodos.bind(this));
        }
    },
    updateTodos(todos) {
        this.setProps(DATA_TODO_ITEMS, {todos});
    }
});