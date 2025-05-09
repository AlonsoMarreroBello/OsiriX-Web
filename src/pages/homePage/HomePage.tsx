import "./HomePage.css";
import logo from "../../assets/OsiriX-Logo.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  const windowsInstallerUrl = "/installers/YourAppSetup.exe";
  const macInstallerUrl = "/installers/YourApp.dmg";
  const linuxDebInstallerUrl = "/installers/YourApp.deb";

  return (
    <div className="container">
      <header className="container-header">
        <img src={logo} alt={`Osirix Logo`} />
        <span>
          <h1>OsiriX</h1>
        </span>
        <ul>
          <li>
            <Link to="/features">Características</Link>
          </li>
          <li>
            <Link to="/download">Descarga</Link>
          </li>
          <li>
            <Link to="/publishers">Portal de publisher</Link>
          </li>
        </ul>
      </header>

      <main>
        <div className="container-main">
          <h2>¿Qué es OsiriX?</h2>
          <p>
            OsiriX es un proyecto de código abierto que se desarrolla en el marco de la Fundación
            OsiriX, con el objetivo de facilitar a la usuarios un lugar centralizado para gestionar
            y descargar sus aplicaciones favoritas.
          </p>
        </div>

        <div className="container-main download-section">
          <h2>Descarga la Última Versión</h2>
          <p>
            Obtén Osirix para tu sistema operativo y empieza a disfrutar de todas sus
            funcionalidades.
          </p>
          <h3>Disponible para:</h3>
          <div className="download-buttons">
            <a href={windowsInstallerUrl} className="download-button" download>
              <span className="os-icon">🪟</span> {/* Emoji como ejemplo de icono */}
              Descargar para Windows
            </a>
            <a href={macInstallerUrl} className="download-button" download>
              <span className="os-icon"></span>
              Descargar para macOS
            </a>
            <a href={linuxDebInstallerUrl} className="download-button" download>
              <span className="os-icon">🐧</span>
              Descargar para Linux (.deb)
            </a>
          </div>
          <p className="version">
            Versión actual: 1.0.0 | Compatible con Windows 10+, macOS 11+, Ubuntu 20.04+
          </p>
        </div>
      </main>

      <footer className="container-footer">
        <p>© {new Date().getFullYear()} Osirix. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
