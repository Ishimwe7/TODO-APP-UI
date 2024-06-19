import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../app/store';
import { loginUser } from '../features/authSlice';
import styles from '../CSS/login.module.css';
import Header from './header';
import { Link } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const authError = useSelector((state: RootState) => state.auth.error);
  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        navigate('/todos');
      }
    });
  };

  return (
    <div>
      <Header />
      <div className={styles.loginForm}>
        <h1>Login</h1>
        <form className={styles.formContainer} onSubmit={onSubmit}>
          <input className={styles.inputField} type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
          <input className={styles.inputField} type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
          {authStatus === 'failed' && <p className={styles.error}>{authError}</p>}
          <button className={styles.button} type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link className={styles.link} to='/register'>Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
