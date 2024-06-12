import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Todos from './components/todos';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'; 

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/todos" element={<Todos />}/>
        </Routes>
    </Router>
  );
}

export default App;
