import { createEvent, createStore, sample } from 'effector';
import { v4 } from 'uuid';

export const FILTER_MODES = {
  ALL: 'ALL',
  DONE: 'DONE',
  NOT_DONE: 'NOT_DONE',
};

const $todos = createStore({});
export const $filteredTodos = createStore([]);
export const $todoName = createStore('');
const $filterMode = createStore(FILTER_MODES.ALL);

export const todoCreated = createEvent('take todo name');
export const todoIsDoneToggled = createEvent('take todo id');
export const todoNameChanged = createEvent('change todo name');
export const filterModeChanged = createEvent('take filter mode');
$todos.watch(state => console.log('$todos', state));
$todos
  .on(todoCreated, (state, todoName) => {
    const id = v4();
    return {
      ...state,
      [id]: {
        id,
        name: todoName,
        isDone: false,
      }
    };
  })
  .on(todoIsDoneToggled, (state, todoId) => ({
    ...state,
    [todoId]: {
      ...state[todoId],
      isDone: !state[todoId].isDone,
    },
  }));
$filterMode.on(filterModeChanged, (_, filterMode) => filterMode);
$todoName.on(todoNameChanged, (_, todoName) => todoName);

const $doneTodos = $todos.map(todos => Object.keys(todos).reduce((acc, todoId) => {
  if (todos[todoId].isDone) {
    acc[todoId] = todos[todoId];
  }
  return acc;
}, {}));

const $notDoneTodos = $todos.map(todos => Object.keys(todos).reduce((acc, todoId) => {
  if (!todos[todoId].isDone) {
    acc[todoId] = todos[todoId];
  }
  return acc;
}, {}));

sample({
  clock: [$filterMode, $todos],
  source: {
    filterMode: $filterMode,
    todos: $todos,
    doneTodos: $doneTodos,
    notDoneTodos: $notDoneTodos,
  },
  fn: ({ filterMode, todos, doneTodos, notDoneTodos }) => {
    if (filterMode === FILTER_MODES.ALL) return Object.values(todos);
    if (filterMode === FILTER_MODES.DONE) return Object.values(doneTodos);
    if (filterMode === FILTER_MODES.NOT_DONE) return Object.values(notDoneTodos);
  },
  target: $filteredTodos,
});
