import CustomHeader from "../../components/CustomHeader/CustomHeader";
import styles from "./UserHomePage.module.css";
import { useNavigate } from "react-router-dom";

const UserHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.customHeader}>
        <CustomHeader />
      </div>
      <main>
        <div className={styles.containerMain}>
          <div className={styles.OptionsContainer}>
            <div className={styles.item}>
              <h2 className={styles.itemTitle}>Gestionar solicitudes</h2>
              <button onClick={() => navigate("/request-manager")} className={styles.itemButton}>
                Solicitudes
              </button>
            </div>
            <div className={styles.item}>
              <h3 className={styles.itemTitle}>Gestionar usuarios</h3>
              <button onClick={() => navigate("/user-manager")} className={styles.itemButton}>
                Usuarios
              </button>
            </div>
            <div className={styles.item}>
              <h2 className={styles.itemTitle}>Gestionar aplicaciones</h2>
              <button onClick={() => navigate("/aplication-manager")} className={styles.itemButton}>
                Aplicaciones
              </button>
            </div>
            <div className={styles.item}>
              <h2 className={styles.itemTitle}>Gestionar desarolladoras</h2>
              <button onClick={() => navigate("/developer-manager")} className={styles.itemButton}>
                Desarolladoras
              </button>
            </div>
            <div className={styles.item}>
              <h2 className={styles.itemTitle}>Gestionar Categorias</h2>
              <button onClick={() => navigate("/category-manager")} className={styles.itemButton}>
                Categorias
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserHomePage;
