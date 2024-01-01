// TodoList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Container,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import API_URL from "./host";
const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #4E4376 30%, #2C3E50 90%)",
  color: "#fff",
  padding: "20px",
});

const StyledList = styled(List)({
  width: "100%",
  maxWidth: "360px",
  margin: "20px auto",
  padding: "0",
});

const StyledListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ccc",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#2C3E50",
  },
});

const StyledListItemText = styled(ListItemText)({
  flex: "1",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const StyledTextField = styled(TextField)({
  width: "35%",
  margin: "10px 0",
});

const StyledButton = styled(Button)({
  marginTop: "10px",
});

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://${API_URL}:3001/todos`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          setError("Invalid data format received from the server");
        }
      })
      .catch((error) => {
        setError(`Error fetching todos: ${error.message}`);
      });
  }, []);

  const addTodo = () => {
    axios
      .post(`http://${API_URL}:3001/todos`, { text: newTodo })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://${API_URL}:3001/todos/${id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Todo List
      </Typography>
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <StyledList>
          {todos.map((todo) => (
            <StyledListItem key={todo.id}>
              <StyledListItemText primary={todo.text} />
              <IconButton color="secondary" onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
            </StyledListItem>
          ))}
        </StyledList>
      )}
      <StyledTextField
        label="New Todo"
        variant="outlined"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <StyledButton variant="contained" color="primary" onClick={addTodo}>
        Add Todo
      </StyledButton>
    </StyledContainer>
  );
};

export default TodoList;
