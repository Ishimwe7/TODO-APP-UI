import React, { useState } from 'react';
import axios from 'axios';
import styles from '../CSS/login.module.css'
import { Link } from 'react-router-dom';
import Header from './header';

interface RegisterFormData {
  names: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    names: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { names, email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/register', formData);
      console.log(response.data);
      if(response.status===201){
        setSuccess("Registration done Successfully !");
      }
      else{
        setError("Registration Failed");
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
           setError(error.message)
            console.error('Axios error:', error.response?.data || error.message);
          } else if (error instanceof Error) {
            setError(error.message)
            console.error('General error:', error.message);
          } else {
            setError("Unexpected Error Occurred")
            console.error('Unexpected error:', error);
          }
    }
  };

  return (
    <div>
     <Header/>
    <div className={styles.loginForm}>
    <h1>Registration</h1>
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <input className={styles.inputField} type="text" name="names" value={names} onChange={onChange} placeholder="Names" required />
      <input className={styles.inputField} type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input className={styles.inputField} type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <p className={styles.error}>{error}</p>
      <p className={styles.success}>{success}</p>
      <button className={styles.button} type="submit">Register</button>
    </form>
    <p>Alredy have an account? <Link className={styles.link} to='/login'>Login</Link></p>
    </div>
    </div>
  );
};

export default Register;
