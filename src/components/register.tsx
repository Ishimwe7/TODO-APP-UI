import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { registerUser } from '../features/authSlice';
import styles from '../CSS/login.module.css';
import { Link } from 'react-router-dom';
import Header from './header';

interface RegisterFormData {
  names: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({ names: '', email: '', password: '' });
  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const authError = useSelector((state: RootState) => state.auth.error);
  const { names, email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ names, email, password }));
  };

  return (
    <div>
      <Header />
      <div className={styles.loginForm}>
        <h1>Registration</h1>
        <form className={styles.formContainer} onSubmit={onSubmit}>
          <input className={styles.inputField} type="text" name="names" value={names} onChange={onChange} placeholder="Names" required />
          <input className={styles.inputField} type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
          <input className={styles.inputField} type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
          {authStatus === 'failed' && <p className={styles.error}>{authError}</p>}
          {authStatus === 'succeeded' && <p className={styles.success}>Registration done Successfully!</p>}
          <button className={styles.button} type="submit">Register</button>
        </form>
        <p>Already have an account? <Link className={styles.link} to='/login'>Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
