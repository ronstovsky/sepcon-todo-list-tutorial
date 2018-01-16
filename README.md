## SepCon's ToDo List
###### AKA The Hello World of JS Frameworks
---
#### Main Goals
 - Adding new todo items
 - Removing todo items
 - Setting each todo item's status individually
 - All items should be cached
 
#### The Plan
 
In this tutorial we will utilize most of SepCon's different `create` classes. That will include `createComponent`, `createData`, `createModifier` and `createService`. 
 
We will break down our app first into the two main parts:
  - Add Todo
  - Todo List
  
The **Add Todo** will be simplified and stay as one single component.  
The **Todo List** will be made out of several sub components such as the todo item itself, and the item's status changing buttons. It will also have a dedicated sub component that will be in charge of showing the title, to demonstrate how much in depth we could get, and it might be for the best at some times.

As for all of these todo items, for them we will need SepCon's `Data` and `Modifier` objects, so that the components could all be fed by the same source - that's the `Data`, and interact with a centralized kind of an API that is the only one to communicate with `Data` objects - that's the `Modifier`.

And while these 3 classes are basically enough for most of it, we still want to cache it all. So right, it could have been made from the `modifier`, writing directly to the `localStorage` or some equivalent, but that is actually not a great way to scale and redefine what will happen with your data. Because you'll have storage-related code throughout your modifier, of writing to storage, reading from it, cleaning it at some times.  
Let's assume we'll decide later on to store all of the todo items in some cloud based service?  

With a `Service` that is responsible of correspondence with the server, for instance, that already have built-in caching capabilities, we will get both the caching itself, and a separated code that handles the todo items as the data, which will make it easier if we'll decide to send that data to some actual server and all. 
  

#### So Lets Start

First of all, keep in mind we'll be using a `constants.js` file to hold all constant strings/numbers values that we need throughout any code we write, whether it's `component`/`modifier`/`data`/`service`'s IDs, or the different actual values of the different todo statuses. Constants give us better context understanding, because instead of a hardcoded value we have a semantical meaning such as - `CAR_MODEL_TITLE` or `INITIAL_VALUE_TO_SETUP_A_TODO_ITEM` (but maybe shorter names would be for the best). It also centralizes these hardcoded values from all different files to same one, which makes it easier to edit in case of need, or just see what was already defined and where was it used, simply to discover code faster (assuming it's a code that wasn't originally written by yourselves).

Second - this webpack env is configured to user'app' as an absolute location when importing different modules:
```javascript
import Module from 'app/modules/module';
```  

Third thing is that this is a brief explanation of how to think of, and build applications - with SepCon. The code snippets here mostly are a simplified version then the original file. So once you go over the README file (or ideally - simultaneously), I would advise to try and play with the repo locally for a better understanding.

##### Our First `Component`

We will do it quite simple at this stage - our `'add-todo'` `component` will currently be focused on the `view`:
```javascript
import SepCon from 'sepcon';
import {COMP_ADD_TODO, ADD_TODO_INPUT_PLACEHOLDER, ADD_TODO_BUTTON_LABEL} from 'app/constants';
export default SepCon.createComponent({id: COMP_ADD_TODO}, {
    state: {
        methods: {
            local: {
                add(next, title) {}
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
                            <input type="text" name="todo-title" placeholder="${ADD_TODO_INPUT_PLACEHOLDER}" />
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
```
The `render` lifecycle event expects to have a string returned, which will be populating the `component`'s DOM element. In it there is a wrapping div with the `.todo-input` className, and in it both the text input element, and the Add button.  
We also have the `events` property defined, and we pass one event definition: when clicking on `button` element, invoke a method named `addTodo`. This methods is a custom method made especially to handle the button click. It will take the value out of `input[name="todo-title"]` DOM element, pass it to `this.methods.add` - which is a wrapping method that under the hood runs the sequence of `local.add` and if the `next` will be invoked then the rest will follow. After all of that - the text input gets cleaned of all its content.

So we even laid out some foundations for the `component-state` by setting up an empty `add` method. But later on we will modify the `component-state`.


 
##### An Overall View

First lets think of the structure of our system. We will obviously need a `data` object that will keep all of the todo items and its full information, such as the title of the todo item, id, and status, as well as a `modifier` to handle that `data`.

So First will be the easiest - the `data` structure here is quite simple currently. We only know of a need to store *all* todos, so that's basically 1 property.  

##### Adding The `Data`
So The `data` object will probably look similar to this:
```javascript
import SepCon from 'sepcon';
import {DATA_TODO_ITEMS} from 'app/constants';
export default SepCon.createData({id: DATA_TODO_ITEMS}, {
    todos: []
});
```
And we would obviously need  a `modifier` to manage that `data` and be accessible for `components` to interact with.

##### Adding The `Modifier`
We should think of all capabilities we need to implement.  
That's **adding a todo item**, **changing a todo item's status** and **removing a todo item**.  
We should also handle the `mount` of that `modifier`, to maybe initiate there the `data` todo-items.  
So the basic structure should look like this:
```javascript
import SepCon from 'sepcon';
import {MOD_TODOS} from 'app/constants';
export default SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {},
        remove(tid) {},
        setStatus(tid, status) {}
    },
    lifecycle: {
        mount() {}
    }
});
```
This is what we will basically do with the `add` if we don't have a `service`:
```javascript
import SepCon from 'sepcon';
import {MOD_TODOS, DATA_TODO_ITEMS} from 'app/constants';
export default SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {
            const {todos} = this.getProps(DATA_TODO_ITEMS);
            todos.push(todo);
            this.setProps(DATA_TODO_ITEMS, {todos});
        },
        remove(tid) {},
        setStatus(tid, status) {}
    },
    lifecycle: {
        mount() {}
    }
});
```
But in our case we will have.  
So we should start thinking of our `service` before we start writing the `modifier` methods in vain.

##### Last Piece Of The Data Assembly Line - `Service`

So this is probably the hardest part. And no decision here is the right or wrong one, simply depends on your convenience and preferred way of work.  
In this tutorial we'll rely on the `service`'s `channels` capabilities. Because we want to take advantage of the `service`'s caching mechanism, it will be the easiest way to simply make a dedicated `channel` broadcasting the whole todo list on every update, and that value will automatically be stored at the `localStorage` of the browser.  
Then on every `mount` of that `service`, this todo list (which will probably be an array in a property of that `service`) will be restored from the last cache of that `channel`.  
So this will look something like this:
```javascript
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
        todos() {
            return this.todos;
        }
    },
    lifecycle: {
        mount() {
            const todos = this.getCache('channels', 'todos');
            this.todos = todos ? todos : [];
            this.channels.todos();
        }
    }
});
```

##### Short Revision Of Our `Modifier`

If we go back to our `modifier`, now we have some additional things to set:
```javascript
import SepCon from 'sepcon';
import {MOD_TODOS, DATA_TODO_ITEMS, SERV_TODOS} from 'app/constants';
export default SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {},
        remove(tid) {},
        setStatus(tid, status) {}
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
```
Due to the fact that we know that the `service` will be using a `channel`, which will basically shoot out the full list of the todo items on `mount` and on every update - we will subscribe to that `channel` with some "unique" key (so that if we would like to later on unsubscribe we could easily invoke that same `todos` function, but with `null` instead of a handler).  
We will pass as the handler a reference to `updateTodos`, so we have to use the `.bind` method to keep the `modifier`'s context. But it could be easily be done like this:
```javascript
import SepCon from 'sepcon';
import {MOD_TODOS, DATA_TODO_ITEMS, SERV_TODOS} from 'app/constants';
export default SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {},
        remove(tid) {},
        setStatus(tid, status) {}
    },
    lifecycle: {
        mount() {
            SepCon.service(SERV_TODOS).channels.todos(MOD_TODOS, (todos) => {
                this.setProps(DATA_TODO_ITEMS, {todos});
            });
        }
    }
});
```


##### Lets Start Building Components

Now let's go back to the first `component` we've made - `add-todo`. It's time to define its `state`:

```javascript
import SepCon from 'sepcon';
import {COMP_ADD_TODO, MOD_TODOS} from 'app/constants';
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
    }
});
```
What we see here is two things:
- How `SepCon` enables `components` a reference of a `modifier`'s method. So under the method name `add`, we will have a reference to the `add` method of the `'todos'` `modifier`.
- How the segmented methods are invoked in a sequence controlled by the `next` argument, which always comes as the first argument of each `component-state`'s local method. Also - the value that will be passed to the `modifier`'s `global` (and `external`) `add` method will be an object, because of how the `local` `add` handled the `title` which is probably a string:
```javascript
next({title}); // next({title: '...'})
```

Now lets see how the `component` seems like with the `view` as well:
```javascript
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
```
Nice.


##### Starting The Add Flow

So we have a component, it allows the user to type a new todo item title, and adding it to the todo list. But it won't really do anything, because we still haven't handled any updates to the list, we only initiated it until now.

##### Setting The `Add` Of The Modifier

Now we should start writing what will happen when the `add` method on the `modifier` side will be invoked:

```javascript
import SepCon from 'sepcon';
import {MOD_TODOS, SERV_TODOS, DATA_TODO_ITEMS} from 'app/constants';
export default SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {
            SepCon.service(SERV_TODOS).requests.addTodo(todo);
        },
        remove(tid) {},
        setStatus(tid, status) {}
    },
    lifecycle: {
        mount() {
            SepCon.service(SERV_TODOS).channels.todos(MOD_TODOS, (todos) => {
                this.setProps(DATA_TODO_ITEMS, {todos});
            });
        }
    }
});
```
So according to our decision of all updates will be pushed via a dedicated `channel` - we shall obviously have requests, so the `modifiers` could also be able to trigger methods of the `service` on demand, but they shouldn't really return everything, because we will rely on the `'todos'` `channel` we have.  
So if `requests` are usually treated something like this:
```javascript
import {SERV_TODOS} from 'app/constants';
SepCon.service(SERV_TODOS).requests.addTodo(todo).then(todos => {
    this.updateTodos(todos);
});
``` 
In our case we won't do anything with the returned `promise`.

##### Updating The `Service` Responsively

Now lets set the `addTodo` request:
```javascript
import {SERV_TODOS} from 'app/constants';
SepCon.createService({id: SERV_TODOS}, {
    todos: [],
    cache: {
        channels: {
            todos: { storage: 'local' }
        }
    },
    channels: {
        todos() {
            return this.todos;
        }
    },
    requests: {
        addTodo(resolve, reject, todo) {
            this.todos.push(todo);
            this.clearCache('channels', 'todos');
            this.channels.todos();
        }
    },
    lifecycle: {
        mount() {
            const todos = this.getCache('channels', 'todos');
            this.todos = todos ? todos : [];
            this.channels.todos();
        }
    }
});
```
Notice how we simply push the new todo to our `this.todos` array, clear the cache of the `'todos'` `channel` and call the `'todos'` `channel` so that the `modifier` (and any other subscribers) could get updated about the change.

But **WAIT** - the todo object should have a bit more then just a title, right?
It should look like this:
```
{
    tid: null,
    title: '',
    stutus: 0
}
```
This is what we have our `modifier` for, it will format the data in any way needed before handing it over.  
It should also be in charge of validating the returned values from `services`, but in this example we won't go that deep.

So back to our  `modifier`:
```javascript
import SepCon from 'sepcon';
import {MOD_TODOS, DATA_TODO_ITEMS, SERV_TODOS} from 'app/constants';
SepCon.createModifier({id: MOD_TODOS}, {
    methods: {
        add(todo) {
            todo = Object.assign({
                tid: SepCon.createUid(),
                status: 0
            }, todo);
            SepCon.service(SERV_TODOS).requests.addTodo(todo);
        },
        remove(tid) {},
        setStatus(tid, status) {}
    },
    lifecycle: {
        mount() {
            SepCon.service(SERV_TODOS).channels.todos(MOD_TODOS, (todos) => {
                this.setProps(DATA_TODO_ITEMS, {todos});
            });
        }
    }
});
```
What is going on now at `add` is that we first assign to the `todo` variable a new object, that is an extension of an object with `tid` and `status` initiated values. If overriding values will come from the `'add-todo'` `component` - they will take over (e.g. if the add-todo could also set an initial status). 
`SepCon` also lets us utilize its own "uid generator" by using `SepCon.createUid()`, so that's how we set our `tid` property for each new todo item.
 
 
 ![SepCon's ToDo List Diagram](/sepcon-todo-list-diag.jpg)