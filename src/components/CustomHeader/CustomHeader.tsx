import "./CustomHeader.css";
import logo from "../../assets/OsiriX-Logo.png";
import { Link, useNavigate } from "react-router-dom";

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="container-header">
        <img src={logo} alt={`Osirix Logo`} />
        <span>
          <h1 onClick={() => navigate("/")}>OsiriX</h1>
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
    </>
  );
};

export default CustomHeader;
