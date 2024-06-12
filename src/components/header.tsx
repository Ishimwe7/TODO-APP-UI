import styles from '../CSS/header.module.css'
import todoIcon from '../assets/todoIcon.jpeg'
const Header=()=>{
    return <div className={styles.header}>
        <div className={styles.logo}>
            <img src={todoIcon} alt="Todo Icon" />
            <p>Nyanja Todo App</p>
        </div>
    </div>
}
export default Header;