import { useUnit } from 'effector-react';
import './App.css';
import {
  $filteredTodos,
  $todoName,
  todoNameChanged,
  todoCreated,
  todoIsDoneToggled,
  filterModeChanged,
  FILTER_MODES
} from './model.js';

function Ui () {
  const filteredTodos = useUnit($filteredTodos);
  const todoName = useUnit($todoName);

  return (
    <div>
      <input type="text" value={todoName} onChange={(e) => todoNameChanged(e.target.value)}/>
      <button onClick={() => todoCreated(todoName)}>создать</button>
      <button onClick={() => filterModeChanged(FILTER_MODES.DONE)}>выполненные</button>
      <button onClick={() => filterModeChanged(FILTER_MODES.NOT_DONE)}>не выполненные</button>
      <button onClick={() => filterModeChanged(FILTER_MODES.ALL)}>все</button>
      <div>
        {filteredTodos.map(todo => (
          <div key={todo.id}>
            <input type="checkbox" checked={todo.isDone} onChange={() => todoIsDoneToggled(todo.id)}/>
            <span>{todo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ui;
