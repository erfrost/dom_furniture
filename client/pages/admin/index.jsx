import AdminHeader from "@/AdminComponents/AdminNav/AdminNav";
import styles from "@/Admin styles/AdminIndex.module.css";

const AdminMain = () => {
  return (
    <div className={styles.Admin}>
      <AdminHeader />
      <div className={styles.adminTitles}>
        <span className={styles.title1}>Добро пожаловать, Админ!</span>
        <span className={styles.title2}>
          Здесь вы можете управлять каталогом сайта
        </span>
      </div>
    </div>
  );
};

export default AdminMain;
