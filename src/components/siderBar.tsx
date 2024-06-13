import styles from '../CSS/header.module.css'
import todoIcon from '../assets/todoIcon.jpeg'
const SideBar=()=>{
    return <div className={styles.sideBar}>
        <div className={styles.logo}>
            <img src={todoIcon} alt="Todo Icon" />
            <p>Nyanja Todo App</p>
        </div>
    </div>
}
export default SideBar;