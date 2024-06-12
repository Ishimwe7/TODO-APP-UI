import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/login.module.css'
import Header from './header';
import { Link } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}
const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/login', formData);
      if(response.status===404 || response.status===400){
        setError("Invalid Login");
      }
      if(response.status===200){
        sessionStorage.setItem('loggedUser', JSON.stringify(response.data));
        console.log('Login Successfully ')
        navigate('/todos');
      }
      else{
        setError("Invalid Login");
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            setError(error.message)
          } else if (error instanceof Error) {
            setError(error.message)
            console.error('General error:', error.message);
          } else {
            setError("Unexpected error occurred")
            console.error('Unexpected error:', error);
          }
    }
  };

  return (
    <div>
    <Header/>
     <div className={styles.loginForm}>
        <h1>Login</h1>
     <form className={styles.formContainer} onSubmit={onSubmit}>
      <input className={styles.inputField} type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input className={styles.inputField} type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <p className={styles.error}>{error}</p>
      <button className={styles.button} type="submit">Login</button>
    </form>
    <p>Don't have an account? <Link className={styles.link} to='/register'>Register</Link></p>
     </div>
    </div>
  );
};

export default Login;
