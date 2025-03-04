import { Button } from "@mui/material";
import React, { useState } from "react";

const CreateTodo = ({ setTodos }) => {
  const [todo, setTodo] = useState("");
  const handleCreateTodo = () => {
    todo.length > 0 && setTodos((prev) => [...prev, todo]);
    setTodo("");
  };
  const handleCreateTodoEnter = (e) => {
    if(e.key === "Enter") {
      handleCreateTodo();
    }
  }
  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  return (
    <div className="flex flex-col h-full items-center justify-evenly">
      <div className="text-2xl font-bold">Create Todo</div>
      <div>
        <input
          type="text"
          value={todo}
          placeholder="Enter your todo..."
          onChange={handleChange}
          onKeyDown={handleCreateTodoEnter}
          className="border p-3 rounded-md"
        />
      </div>
      <div>
        <Button variant="contained" color="success" onClick={handleCreateTodo}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateTodo;
