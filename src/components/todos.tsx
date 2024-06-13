import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../CSS/todos.module.css'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt,faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import SideBar from './siderBar';

interface Todo {
  _id: string;
  title: string;
  description: string;
  status: string;
  updatedAt: string;
}

interface TodoFormData {
  title: string;
  description: string;
}
interface EditTodoFormData {
  id:string;
  title: string;
  description: string;
  status: string;
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

  const [editFormData, setEditFormData] = useState<EditTodoFormData>({
    id:'',
    title: '',
    description: '',
    status:''
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
  }, [loggedUser]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  const setEditData = (todo: Todo) => {
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    if(addForm){
      addForm.style.display='none'
    }
    if(editForm){
      editForm.style.display='flex'
    }
    setEditFormData({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      status:todo.status
    });
  };

  const closeEditForm = (e:React.MouseEvent) => {
    e.p
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    if(editForm){
      editForm.style.display='none'
    }
    if(addForm){
      addForm.style.display='flex'
    }
    setEditFormData({
      id: '',
      title: '',
      description: '',
      status:''
    });
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/todos/saveTodo', formData, {
        headers: {
          Authorization: `Bearer ${loggedUser}`
        }
      });
      setTodos([...todos, response.data]);
      setFormData({ title: '', description: '' });
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


  const editTodo = async (e: React.FormEvent,id:string) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/todos/updateTodo/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${loggedUser}`
        }
      });
      setTodos([...todos, response.data]);
      setEditFormData({id:'', title: '', description: '',status:'' });
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
    <div className={styles.todos}>
      <SideBar/>
      <div className={styles.container}>
      <form id='addForm' className={styles.form} onSubmit={onSubmit}>
        <div className={styles.input}>
        <input
          className={styles.inputField}
          type="text"
          name="title"
          value={formData.title}
          maxLength={50}
          onChange={onChange}
          placeholder="Add TODO Item Title"
          required
        />
        <input
          className={styles.inputField}
          type="text"
          name="description"
          value={formData.description}
          maxLength={150}
          onChange={onChange}
          placeholder="Add TODO Item Description"
          required
        />
        </div>
        <button className={styles.button} type="submit">Add Todo</button>
      </form>
      <form id='editForm' className={styles.editForm} onSubmit={(e) => editTodo(e, editFormData.id)}>
        <p onClick={(e)=>{closeEditForm(e)}} className={styles.closeEdit}><FontAwesomeIcon icon={faTimes} /></p>
        <div className={styles.input}>
        <input
          className={styles.inputField}
          type="text"
          name="title"
          value={editFormData.title}
          maxLength={50}
          onChange={onEditChange}
          placeholder="Edit TODO Item Title"
          required
        />
        <input
          className={styles.inputField}
          type="text"
          name="description"
          value={editFormData.description}
          maxLength={150}
          onChange={onEditChange}
          placeholder="Edit TODO Item Description"
          required
        />
        </div>
        <button className={styles.button} type="submit">Save</button>
      </form>
       <ul className={styles.todoList}>
       {todos.length===0 && <h1 className={styles.noTodos}>NOTHING IN YOUR TODOS AT THE TIME !</h1>}
        {todos.map(todo => (
          <li className={styles.todoItem} key={todo._id}>
            <div className={styles.todosData}>
              <h3>{todo.title}</h3>
              <p className={styles.todoDesc}>{todo.description}</p>
              <p className={styles.todoDate}>{todo.updatedAt}</p>
            </div>
            <div className={styles.controlBtns}>
                <button className={styles.deleteButton} onClick={() => deleteTodo(todo._id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                <button className={styles.editButton} onClick={() => setEditData(todo)}><FontAwesomeIcon icon={faEdit} /></button>
            </div>
           </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Todos;
