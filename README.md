# Sellpy web interview

Welcome to Sellpy's web interview repo!

## Submission

Completed tasks:
- Main Task:
  - Created RESTful API in the backend to provide CRUD operations for todo lists in the frontend

- Additional Task:
  - Autosave function when a todo item is added or deleted
  - Checkbox for user to cross-off a todo item as the indication of completion
  - Documented all the changes in code

## Components

### TodoLists Component

The `TodoLists.jsx` component serves as the main interface for managing todo lists.

#### Core Functionality
- Provides CRUD operations for todo list management

#### Backend Integration
- Connects with REST API endpoints at `http://localhost:3001/api`
- Implements API calls for:
  - Fetching all todo lists
  - Creating new todo lists
  - Updating existing todo lists
  - Deleting todo lists

#### User Interface Elements
- **List Display**
  - Card container with list of todo lists
  - Icons for visual identification
  - Empty state handling
  
- **Action Buttons**
  - New List button with add icon
  - Edit and Delete buttons for each list
  - Tooltips for improved UX

- **Dialog Modals**
  - Create List dialog with form
  - Rename List dialog with form
  - Cancel/Confirm action buttons

#### State Management
- React hooks for managing component state:
  - Todo lists data
  - Active list selection
  - Loading and error states
  - Dialog visibility states
  - Form input values

#### Error Handling
- API error catching with appropriate user feedback
- Loading state indication during API operations

### TodoListForm Component

The `TodoListForm.jsx` component handles the editing interface for individual todo lists.

#### Core Functionality
- Supports creating, updating, and deleting individual todos
- Implements todo completion tracking with visual indicators
- Features auto-saving with debounce for improved performance

#### Data Structure Enhancement
- Upgraded todo format from simple strings to structured objects:
  ```javascript
  { text: "Todo text", completed: false }
  ```
- Backward compatibility with automatic conversion of string-based todos

#### Todo Management Features
- **Todo Creation**
  - Add button for creating new empty todo items
  - Sequential numbering of todos for easy reference
  
- **Todo Editing**
  - Text input fields for modifying todo content
  - Checkbox controls for marking todos as complete/incomplete
  - Delete button for removing individual todos
  
- **Visual Feedback**
  - Strikethrough styling for completed todos
  - Grayed-out text for completed items
  - Automatic sorting to move completed todos to the bottom

#### Advanced State Management
- Implements efficient state handling with React hooks:
  - Tracking of todo items and their completion status
  - Save operation states (in-progress, error)
  - Last saved state tracking to prevent unnecessary API calls
  
- **Auto-save Implementation**
  - Debounced saving to prevent API overload
  - 1-second delay after the last change before triggering save
  - State comparison to avoid redundant API calls
  - Cleanup on unmount to prevent memory leaks

#### User Experience Enhancements
- **Feedback Mechanisms**
  - "Saving..." indicator during API operations
  - Error notifications via Snackbar component
  - Visual differentiation of completed vs. active todos

#### Code Optimization
- useCallback for memoized function references
- Sorted todo display with completed items at bottom
- Efficient state updates using immutable patterns

## Todo List API

This backend service provides a RESTful API for managing todo lists.

#### API Overview

The backend implements the following endpoints:

#### Todo Lists Management

- `GET /api/todolists` - Retrieve all todo lists
- `GET /api/todolists/:id` - Retrieve a specific todo list by ID
- `POST /api/todolists` - Create a new todo list
- `PUT /api/todolists/:id` - Update an existing todo list
- `DELETE /api/todolists/:id` - Delete a todo list

#### Data Structure

Todo lists are stored in-memory with the following structure:

```javascript
{
  "id": "0000000001",
  "title": "First List",
  "todos": ["First todo of first list!"]
}
```

### Implementation Details

- Uses in-memory storage (would be replaced with a database later on)
- Implements CRUD operations for todo lists


