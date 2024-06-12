import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../CSS/todos.module.css'
import { useNavigate } from 'react-router-dom';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoFormData {
  title: string;
  description: string;
}

const Todos: React.FC = () => {
  const cookies = document.cookie;
  //const cookiesToken = document.cookie.split('jwt=')[1]
  //const sessionToken = sessionStorage.getItem('loggedUser');
 console.log(cookies);
  const navigate = useNavigate()
  let loggedUser = sessionStorage.getItem('loggedUser');
  if(loggedUser){
    loggedUser=JSON.parse(loggedUser).token;
  }
  if(!loggedUser){
    navigate('/login');
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: ''
  });

  const { title, description } = formData;
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('/todos/getAllTodos', {
        headers: {
          Authorization: `Bearer ${loggedUser}`
        }
      });
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        console.log('Response',response.data)
        //setTodos([]); 
      }
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/todos/saveTodo', formData, {
        headers: {
          Authorization: `Bearer ${loggedUser}`
        }
      });
      setTodos([...todos, response.data]);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error('General error:', error.message);
          } else {
            console.error('Unexpected error:', error);
          }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`/todos/deleteTodo/${id}`, {
        headers: {
          Authorization: `Bearer ${loggedUser}`
        }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error('General error:', error.message);
          } else {
            console.error('Unexpected error:', error);
          }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.inputField}
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Title"
          required
        />
        <input
          className={styles.inputField}
          type="text"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
        />
        <button className={styles.button} type="submit">Add Todo</button>
      </form>
      <ul className={styles.todoList}>
        {todos.map(todo => (
          <li className={styles.todoItem} key={todo._id}>
            <div>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <button className={styles.deleteButton} onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
