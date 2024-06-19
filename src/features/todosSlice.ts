// src/features/todos/todosSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Todo {
  _id: string;
  title: string;
  description: string;
  status: string;
  updatedAt: string;
}

interface TodosState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk<Todo[], string>('todos/fetchTodos', async (token) => {
  const response = await axios.get('/todos/getAllTodos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const saveTodo = createAsyncThunk<Todo, { todo: Omit<Todo, '_id' | 'updatedAt'>; token: string }>(
  'todos/saveTodo',
  async ({ todo, token }) => {
    const response = await axios.post('/todos/saveTodo', todo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const updateTodo = createAsyncThunk<Todo, { id: string; updatedTodo: Omit<Todo, '_id' | 'updatedAt'>; token: string }>(
  'todos/updateTodo',
  async ({ id, updatedTodo, token }) => {
    const response = await axios.put(`/todos/updateTodo/${id}`, updatedTodo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk<string, { id: string; token: string }>(
  'todos/deleteTodo',
  async ({ id, token }) => {
    await axios.delete(`/todos/deleteTodo/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  }
);

export const changeStatus = createAsyncThunk<Todo, { id: string; status: string; token: string }>(
  'todos/changeStatus',
  async ({ id, status, token }) => {
    const response = await axios.put(`/todos/changeStatus/${id}/${status}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(saveTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        state.todos[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(changeStatus.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        state.todos[index] = action.payload;
      });
  },
});

export default todosSlice.reducer;
