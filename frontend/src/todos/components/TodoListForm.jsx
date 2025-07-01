import React, { useState, useEffect, useCallback } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  Checkbox
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  // Convert simple string array to objects with text and completed properties
  const initializeTodos = () => {
    return todoList.todos.map(item => {
      // If the item is already an object with the right structure, use it
      if (typeof item === 'object' && 'text' in item && 'completed' in item) {
        return item;
      }
      // Otherwise convert string to object format
      return { text: item, completed: false };
    });
  };

  const [todos, setTodos] = useState(initializeTodos);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSavedTodos, setLastSavedTodos] = useState(JSON.stringify(initializeTodos()));

  // Function to sort todos with completed items at the bottom
  const sortTodos = useCallback((todoList) => {
    return [...todoList].sort((a, b) => {
      // Sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // If same completion status, maintain original order
      return 0;
    });
  }, []);

  // Debounced save function with useCallback to prevent recreation on each render
  const saveChanges = useCallback(async () => {
    // Skip saving if it matches the last saved state
    if (JSON.stringify(todos) === lastSavedTodos) return;

    setIsSaving(true);
    try {
      const success = await saveTodoList(todoList.id, { todos });

      if (success) {
        // Update the last saved state
        setLastSavedTodos(JSON.stringify(todos));
        // Clear any previous errors
        setError(null);
      } else {
        throw new Error('Save operation returned false');
      }
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [todos, todoList.id, saveTodoList, lastSavedTodos]);

  // Set up autosave with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(todos) !== lastSavedTodos) {
        saveChanges();
      }
    }, 1000); // Wait 1 second after last change before saving

    // Cleanup function to clear timeout if todos change again within the delay
    return () => clearTimeout(timeoutId);
  }, [todos, saveChanges, lastSavedTodos]);

  const handleAddTodo = () => {
    setTodos(sortTodos([...todos, { text: '', completed: false }]));
  };

  const handleDeleteTodo = (index) => {
    setTodos([
      ...todos.slice(0, index),
      ...todos.slice(index + 1),
    ]);
  };

  const handleTodoChange = (index, value) => {
    setTodos([
      ...todos.slice(0, index),
      { ...todos[index], text: value },
      ...todos.slice(index + 1),
    ]);
  };

  const handleTodoToggle = (index) => {
    // Toggle the completed status
    const updatedTodos = [
      ...todos.slice(0, index),
      { ...todos[index], completed: !todos[index].completed },
      ...todos.slice(index + 1),
    ];

    // Sort the list to move completed items to the bottom
    setTodos(sortTodos(updatedTodos));
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <Checkbox
                checked={todo.completed}
                onChange={() => handleTodoToggle(index)}
                sx={{ mr: 1 }}
              />
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.text}
                onChange={(event) => handleTodoChange(index, event.target.value)}
                InputProps={{
                  sx: todo.completed ? {
                    textDecoration: 'line-through',
                    color: 'text.disabled'
                  } : {}
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => handleDeleteTodo(index)}
            >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={handleAddTodo}
      >
              Add Todo <AddIcon />
            </Button>
            {isSaving && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Saving...
              </Typography>
            )}
          </CardActions>
        </div>
      </CardContent>

      {/* Error Notification only */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Card>
  )
}
