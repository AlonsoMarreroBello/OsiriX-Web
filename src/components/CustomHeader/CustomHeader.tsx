import "./CustomHeader.css";
import logo from "../../assets/OsiriX-Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../../services/AuthService";

const CustomHeader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    /**
     * The function checks if the user is logged in or not
     * @returns void
     */
    const checkLogin = () => {
      const token_tmp = authService.getToken();
      let token;
      if (token_tmp != null && token_tmp !== "" && token_tmp !== undefined) {
        token = token_tmp;
      } else {
        setIsLoggedIn(false);
      }

      if (token != null && token !== "" && token !== undefined) {
        const decodedToken = jwtDecode(token);

        if (decodedToken != null && decodedToken != undefined) {
          if (decodedToken.exp != null && decodedToken.exp !== undefined) {
            const currentTime = new Date().getTime();
            const tokenExpirationTime = decodedToken.exp * 1000;

            if (currentTime < tokenExpirationTime) {
              setIsLoggedIn(true);
            } else {
              setIsLoggedIn(false);
            }
          }
        }
      }
    };

    checkLogin();
  }, []);

  return (
    <header className="container-header">
      <div className="logo-title-container">
        <img src={logo} alt="OsiriX Logo" />
        <h1 onClick={() => navigate("/")}>OsiriX</h1>
      </div>
      <nav>
        <ul>
          {isLoggedIn ? (
            <li>
              <Link to="/home">Home</Link>
              <Link to="/" onClick={() => authService.clearToken()}>
                Log out
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/publishers">Portal de publisher</Link>
              <Link to="/login">Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default CustomHeader;
