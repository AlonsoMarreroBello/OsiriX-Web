import style from "./PublisherPortalPage.module.css";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import InputField from "../../components/InputField/InputField";

const PublisherPortalPage = () => {
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
              <div className={style.inputGroup}>
                <InputField label="Correo" id="publisherEmail" />
                <InputField label="Nombre del publisher" id="publisherName" />
              </div>
              <div className={style.inputGroup}>
                <InputField label="Contraseña" id="password" />
                <InputField label="Confirmar contraseña" id="confirmPassword" />
              </div>
              <div className={style.inputGroup}>
                <InputField label="NIF" id="nif" />
                <InputField label="Direccion" id="address" />
              </div>
              <button className={style.button}>Solicitar unirse</button>
              <p>
                Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PublisherPortalPage;
