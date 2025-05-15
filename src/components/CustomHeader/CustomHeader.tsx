import "./CustomHeader.css";
import logo from "../../assets/OsiriX-Logo.png";
import { Link, useNavigate } from "react-router-dom";

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="container-header">
      <div className="logo-title-container">
        <img src={logo} alt="OsiriX Logo" />
        <h1 onClick={() => navigate("/")}>OsiriX</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/publishers">Portal de publisher</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default CustomHeader;
