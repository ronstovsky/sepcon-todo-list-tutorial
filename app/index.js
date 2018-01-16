import 'app/init';
import 'app/datas';
import 'app/modifiers';
import 'app/services';
import '../style/style.scss';

import todoInput from 'app/components/add-todo';
import todoList from 'app/components/todo-list';



document.getElementById('app').innerHTML = `<div class="todo-app">
    ${todoInput}
    ${todoList}
</div>`;