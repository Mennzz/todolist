import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

// In-memory storage for todo lists (replace with a database in production)
let todoLists = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: ['First todo of first list!'],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: ['First todo of second list!'],
  },
}

// GET all todo lists
app.get('/api/todolists', (req, res) => {
  res.json(todoLists)
})

// GET a specific todo list
app.get('/api/todolists/:id', (req, res) => {
  const todoList = todoLists[req.params.id]
  
  if (!todoList) {
    return res.status(404).json({ error: 'TodoList not found' })
  }
  
  res.json(todoList)
})

// POST a new todo list
app.post('/api/todolists', (req, res) => {
  const { title } = req.body
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }
  
  const id = Date.now().toString()
  const newTodoList = {
    id,
    title,
    todos: []
  }
  
  todoLists = {
    ...todoLists,
    [id]: newTodoList
  }
  
  res.status(201).json(newTodoList)
})

// PUT (update) a todo list
app.put('/api/todolists/:id', (req, res) => {
  const { id } = req.params
  const updates = req.body
  
  if (!todoLists[id]) {
    return res.status(404).json({ error: 'TodoList not found' })
  }
  
  // Update the todoList while preserving other properties
  todoLists = {
    ...todoLists,
    [id]: {
      ...todoLists[id],
      ...updates
    }
  }
  
  res.json(todoLists[id])
})

// DELETE a todo list
app.delete('/api/todolists/:id', (req, res) => {
  const { id } = req.params
  
  if (!todoLists[id]) {
    return res.status(404).json({ error: 'TodoList not found' })
  }
  
  // Delete the list directly using delete operator
  const newTodoLists = { ...todoLists }
  delete newTodoLists[id]
  todoLists = newTodoLists
  
  res.status(204).send()
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
