import React, { useState } from "react";
import CreateTodo from "../components/CreateTodo";
import ShowTodos from "../components/ShowTodos";

const Home = () => {
  const [todos, setTodos] = useState([]);
  return (
    <div className="flex flex-col items-center">
      <div className="border-b-2 border-b-amber-700 w-full h-[23vh]">
        <CreateTodo setTodos={setTodos} />
      </div>
      <div className="w-full h-[70vh] overflow-hidden ">
        <ShowTodos todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
};

export default Home;
