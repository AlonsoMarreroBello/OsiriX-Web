import style from "./PublisherPortalPage.module.css";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import InputField from "../../components/InputField/InputField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import userService from "../../services/UserService";

const PublisherPortalPage = () => {
  const navigate = useNavigate();

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nif: "",
    address: "",
  };

  const [state, setState] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e.target.value);

    setState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(state);

    userService
      .requestPublsherAccess({
        username: state.username,
        email: state.email,
        password: state.password,
        nif: state.nif,
        publisherName: state.username,
        address: state.address,
        assignedAdminId: undefined,
      })
      .then(() => {
        setState(initialState);
      });
  };

  return (
    <>
      <div className={style.CustomHeader}>
        <CustomHeader />
      </div>
      <div className={style.container}>
        <main className={style.main}>
          <h1>¿Quieres publicar tus aplicaciones de forma rapida y segura?</h1>
          <div className={style.wrapper}>
            <div className={style.formHeader}>
              <h2>Solicitar unirse como publicador</h2>
            </div>
            <div className={style.form}>
              <form onSubmit={handleSubmit}>
                <div className={style.inputGroup}>
                  <InputField
                    value={state.email}
                    label="Email"
                    id="email"
                    onChange={handleChange}
                  />
                  <InputField
                    value={state.username}
                    label="Nombre del publisher"
                    id="username"
                    onChange={handleChange}
                  />
                </div>
                <div className={style.inputGroup}>
                  <InputField
                    value={state.password}
                    label="Contraseña"
                    id="password"
                    type="password"
                    onChange={handleChange}
                  />
                  <InputField
                    value={state.confirmPassword}
                    label="Confirmar contraseña"
                    id="confirmPassword"
                    type="password"
                    onChange={handleChange}
                  />
                </div>
                <div className={style.inputGroup}>
                  <InputField value={state.nif} label="NIF" id="nif" onChange={handleChange} />
                  <InputField
                    value={state.address}
                    label="Direccion"
                    id="address"
                    onChange={handleChange}
                  />
                </div>
                <button className={style.button} type="submit">
                  Solicitar unirse
                </button>
                <p>
                  Ya tienes cuenta? <a onClick={() => navigate("/login")}>Iniciar sesión</a>
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PublisherPortalPage;
