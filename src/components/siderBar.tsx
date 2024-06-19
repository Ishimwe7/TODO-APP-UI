import styles from '../CSS/header.module.css'
import todoIcon from '../assets/todoIcon.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const SideBar = () => {
    const navigate = useNavigate();
    const logout = (event: React.MouseEvent) => {
        event.preventDefault();
        const loggedUser = sessionStorage.getItem('loggedUser');
        if (loggedUser) {
            sessionStorage.removeItem('loggedUser');
        }
        navigate('/login');
    }

    return <div className={styles.sideBar}>
        <div className={styles.logo}>
            <img src={todoIcon} alt="Todo Icon" />
            <p>Nyanja Todo App</p>
        </div>
        <h2 className={styles.logoutBtn} onClick={(event)=>{logout(event)}}>
           <span>Logout</span>  <FontAwesomeIcon icon={faSignOutAlt} />
        </h2>
    </div>
}
export default SideBar;