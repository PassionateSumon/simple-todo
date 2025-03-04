import { useState } from "react";
import "./App.css";
import CreateTodo from "./components/CreateTodo";
import ShowTodos from "./components/ShowTodos";

function App() {
  const [todos, setTodos] = useState([]);
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="border border-b-2 border-b-amber-700 w-full h-[30%]">
        <CreateTodo setTodos={setTodos} />
      </div>
      <div className="w-full h-[70%] overflow-hidden ">
        <ShowTodos todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
}

export default App;
