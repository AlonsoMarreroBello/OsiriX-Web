import { useState } from "react";
import styles from "./LoginPage.module.css";
import InputField from "../../components/InputField/InputField";
import authService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import logoUrl from "../../assets/OsiriX-Logo.png";
import { toast } from "react-toastify";
import notificationService from "../../services/notificationService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  /**
   * Handles the change of the email input
   * @param e the event object
   * @returns void
   */
  const handleEmail = (e: string) => {
    setUser((prev) => ({ ...prev, email: e }));
  };

  /**
   * Handles the change of the password input
   * @param e the event object
   * @returns void
   */
  const handlePassword = (e: string) => {
    setUser((prev) => ({ ...prev, password: e }));
  };

  /**
   * Handles the login process
   * @param event the event object
   * @returns void
   */
  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      authService
        .login({ ...user, origin: "WEB" })
        .then(() => {
          if (authService.getUserTypeFromToken() === "USER") {
            toast.error("Usuario no autorizado");
            setError("Usuario no autorizado");
            setTimeout(() => {
              setError("");
            }, 3000);
          } else {
            notificationService.showNotifications();
            navigate("/home");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error al loguear");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <img src={logoUrl} alt="Osirix Logo" className={styles.logo} />
          <p className={styles.quote}></p>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Inicio de Sesión</h1>
            <form onSubmit={handleAuth} className={styles.form}>
              <InputField
                id="email"
                label="Correo electrónico"
                type="email"
                value={user.email}
                onChange={(e) => handleEmail(e.target.value)}
                required
              />
              <InputField
                id="password"
                label="Contraseña"
                type="password"
                value={user.password}
                onChange={(e) => handlePassword(e.target.value)}
                required
              />
              <a href="#" className={styles.forgotPassword}>
                ¿Has olvidado la contraseña?
              </a>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.loginButton}>
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
