import styles from "./HomePage.module.css";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

const HomePage = () => {
  const windowsInstallerUrl = "/src/downloads/OsiriX.exe";

  return (
    <div className={styles.container}>
      <div className={styles.customHeader}>
        <CustomHeader />
      </div>
      <main>
        <div className={styles.containerMain}>
          <h2>¿Qué es OsiriX?</h2>
          <p>
            OsiriX es un proyecto de código abierto que se desarrolla en el marco de la Fundación
            OsiriX, con el objetivo de facilitar a la usuarios un lugar centralizado para gestionar
            y descargar sus aplicaciones favoritas.
          </p>
        </div>

        <div className={(styles.ContainerMain, styles.downloadSection)}>
          <h2>Descarga la Última Versión</h2>
          <p>
            Obtén Osirix para tu sistema operativo y empieza a disfrutar de todas sus
            funcionalidades.
          </p>
          <h3>Disponible para:</h3>
          <div className={styles.downloadButtons}>
            <a href={windowsInstallerUrl} className={styles.downloadButton} download>
              <span className={styles.osIcon}>🪟</span> {/* Emoji como ejemplo de icono */}
              Descargar para Windows
            </a>
          </div>
          <p className={styles.version}>Versión actual: 1.0.0 | Compatible con Windows 10+</p>
        </div>
      </main>

      <footer className={styles.containerFooter}>
        <p>© {new Date().getFullYear()} Osirix. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
