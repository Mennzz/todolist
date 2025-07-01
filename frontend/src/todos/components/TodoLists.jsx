import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { TodoListForm } from './TodoListForm'

const API_URL = 'http://localhost:3001/api'

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newListDialogOpen, setNewListDialogOpen] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [listToRename, setListToRename] = useState(null)
  const [renameTitle, setRenameTitle] = useState('')

  // Fetch all todo lists
  const fetchTodoLists = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/todolists`)
      if (!response.ok) throw new Error('Failed to fetch todo lists')
      const data = await response.json()
      setTodoLists(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching todo lists:', err)
      setError('Failed to load todo lists. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new todo list
  const createTodoList = async () => {
    if (!newListTitle.trim()) return

    try {
      const response = await fetch(`${API_URL}/todolists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newListTitle }),
      })

      if (!response.ok) throw new Error('Failed to create todo list')
      
      const newList = await response.json()
      setTodoLists(prevLists => ({
        ...prevLists,
        [newList.id]: newList
      }))
      
      setNewListTitle('')
      setNewListDialogOpen(false)
      setActiveList(newList.id)
    } catch (err) {
      console.error('Error creating todo list:', err)
      setError('Failed to create new list. Please try again.')
    }
  }

  // Delete a todo list
  const deleteTodoList = async (id, e) => {
    e.stopPropagation() // Prevent triggering the list item click
    
    try {
      const response = await fetch(`${API_URL}/todolists/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete todo list')
      
      const { [id]: removed, ...remainingLists } = todoLists
      setTodoLists(remainingLists)
      
      if (activeList === id) {
        setActiveList(null)
      }
    } catch (err) {
      console.error('Error deleting todo list:', err)
      setError('Failed to delete list. Please try again.')
    }
  }

  // Save updated todo list
  const saveTodoList = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/todolists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update todo list')
      
      const updatedList = await response.json()
      setTodoLists(prevLists => ({
        ...prevLists,
        [id]: updatedList
      }))
      
      return true // Success flag
    } catch (err) {
      console.error('Error updating todo list:', err)
      setError('Failed to save changes. Please try again.')
      return false
    }
  }

  // Open rename dialog
  const openRenameDialog = (id, e) => {
    e.stopPropagation() // Prevent triggering the list item click
    setListToRename(id)
    setRenameTitle(todoLists[id].title)
    setRenameDialogOpen(true)
  }

  // Rename a todo list
  const renameTodoList = async () => {
    if (!renameTitle.trim() || !listToRename) return

    try {
      const response = await fetch(`${API_URL}/todolists/${listToRename}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renameTitle }),
      })

      if (!response.ok) throw new Error('Failed to rename todo list')

      const updatedList = await response.json()
      setTodoLists(prevLists => ({
        ...prevLists,
        [listToRename]: updatedList
      }))

      setRenameDialogOpen(false)
      setListToRename(null)
      setRenameTitle('')
    } catch (err) {
      console.error('Error renaming todo list:', err)
      setError('Failed to rename list. Please try again.')
    }
  }

  useEffect(() => {
    fetchTodoLists()
  }, [])

  if (isLoading) return <Typography>Loading todo lists...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  if (!Object.keys(todoLists).length) return null
  return (
    <Fragment>
<Card style={style}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography component='h2'>My Todo Lists</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => setNewListDialogOpen(true)}
            >
              New List
            </Button>
          </div>
          {Object.keys(todoLists).length > 0 ? (
            <List>
              {Object.keys(todoLists).map((key) => (
                <ListItemButton key={key} onClick={() => setActiveList(key)}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={todoLists[key].title} />
                  <div>
                    <Tooltip title="Edit list name">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => openRenameDialog(key, e)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete list">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => deleteTodoList(key, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography style={{ marginTop: '1rem' }}>
              No todo lists yet. Create one to get started!
            </Typography>
          )}
        </CardContent>
      </Card>

      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={saveTodoList}
        />
      )}

      {/* New List Dialog */}
      <Dialog open={newListDialogOpen} onClose={() => setNewListDialogOpen(false)}>
        <DialogTitle>Create New Todo List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Title"
            fullWidth
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                createTodoList();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewListDialogOpen(false)}>Cancel</Button>
          <Button onClick={createTodoList} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename List Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Todo List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Title"
            fullWidth
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                renameTodoList();
}
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={renameTodoList} color="primary" variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
