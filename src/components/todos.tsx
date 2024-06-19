import React, { useEffect, useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTodos, saveTodo, updateTodo, deleteTodo, changeStatus } from '../features/todosSlice';
import { RootState, AppDispatch } from '../app/store';
import styles from '../CSS/todos.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import SideBar from './siderBar';

const Todos: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const token = JSON.parse(sessionStorage.getItem('loggedUser') || '{}').token;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status:'Pending'
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: ''
  });
   const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos(token))
      .then(() => setLoading(false)) 
      .catch(() => setLoading(false));
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onEditChange = (e: ChangeEvent<HTMLInputElement>) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const setEditData = (todo: { _id: string; title: string; description: string; status: string }) => {
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    if (addForm) addForm.style.display = 'none';
    if (editForm) editForm.style.display = 'flex';
    setEditFormData({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      status: todo.status
    });
  };

  const closeEditForm = (e: MouseEvent) => {
    e.preventDefault();
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    if (editForm) editForm.style.display = 'none';
    if (addForm) addForm.style.display = 'flex';
    setEditFormData({
      id: '',
      title: '',
      description: '',
      status: ''
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(saveTodo({
      todo: formData,
      token
    }));
    setFormData({ title: '', description: '', status: 'Pending' });
  };

  const editTodo = (e: FormEvent, id: string) => {
    e.preventDefault();
    dispatch(updateTodo({
      id,
      updatedTodo: editFormData,
      token
    }));
    closeEditForm(e as unknown as MouseEvent<HTMLParagraphElement>);
  };

  const removeTodo = (id: string) => {
    dispatch(deleteTodo({ id, token }));
  };

  const updateStatus = (e: MouseEvent, id: string, status: string) => {
    e.preventDefault();
    dispatch(changeStatus({
      id,
      status,
      token
    }));
  };

  return (
    <div className={styles.todos}>
      <SideBar />
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
          <div className={styles.saveClose}>
             <p onClick={(e) => closeEditForm(e)} className={styles.closeEdit}><FontAwesomeIcon icon={faTimes} /></p>
             <button className={styles.saveButton} type="submit">Save</button>
          </div>
        </form>
        <ul className={styles.todoList}>
          {loading && <h1 className={styles.noTodos}>Loading your Todos! Please wait</h1>}
          {!loading && todos.length === 0 && <h1 className={styles.noTodos}>NOTHING IN YOUR TODOS AT THE TIME!</h1>}
          {todos.map((todo) => (
            <li className={styles.todoItem} key={todo._id}>
              <div className={styles.todosData}>
                <h3>{todo.title}</h3>
                <p className={styles.todoDesc}>{todo.description}</p>
                {todo.status === 'Pending' && <button onClick={(e) => updateStatus(e, todo._id, 'In Progress')} className={styles.startTodo}>Start</button>}
                {todo.status === 'In Progress' && <button onClick={(e) => updateStatus(e, todo._id, 'Completed')} className={styles.progressTodo}>Finish</button>}
                {todo.status === 'Completed' && <button disabled className={styles.doneTodo}>Completed</button>}
                <p className={styles.todoDate}>{todo.updatedAt}</p>
              </div>
              <div className={styles.controlBtns}>
                <button className={styles.deleteButton} onClick={() => removeTodo(todo._id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
