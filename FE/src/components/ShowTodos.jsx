import { Button } from "@mui/material";
import React, { useState } from "react";

const ShowTodos = ({ todos, setTodos }) => {
  const [editInd, setEditInd] = useState(null);
  const [editText, setEditText] = useState("");
  const handleTodoEdit = (index, text) => {
    setEditInd(index);
    setEditText(text);
  };
  const handleTodoEditChange = (e) => {
    setEditText(e.target.value);
  };
  const handleTodoEditSave = (index) => {
    const newTodos = todos?.map((t, i) => (i === index ? editText : t));
    setTodos(newTodos);
    setEditInd(null);
  };
  const handleTodoEditKeyDown = (e, index) => {
    if (e.key === "Enter") {
      handleTodoEditSave(index);
    }
  };
  const handleTodoEditCancel = () => {
    setEditInd(null);
    setEditText("");
  };
  const handleTodoDelete = (index) => {
    setTodos((prev) => prev.filter((_, ind) => ind !== index));
  };

  
  return (
    <div className="flex flex-col items-center h-full overflow-y-auto">
      {todos?.map((todo, ind) => (
        <div key={ind} className="flex items-center justify-between space-x-2">
          {editInd === ind ? (
            <input
              type="text"
              value={editText}
              onChange={handleTodoEditChange}
              onKeyDown={(e) => handleTodoEditKeyDown(e, ind)}
              className="border p-1 rounded-md m-1.5"
            />
          ) : (
            <div
              key={ind}
              className="text-lg m-1.5 px-4 py-1 bg-green-400 rounded-lg"
            >
              {todo}
            </div>
          )}
          <div>
            {editInd === ind ? (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleTodoEditSave(ind)}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleTodoEdit(ind, todo)}
              >
                Edit
              </Button>
            )}
          </div>
          <div>
            {editInd === ind ? (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleTodoEditCancel(ind)}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleTodoDelete(ind)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTodos;
