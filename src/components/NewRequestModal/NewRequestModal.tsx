/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "./NewRequestModal.module.css";
import InputField from "../InputField/InputField";
import { useState } from "react";
import authService from "../../services/AuthService";
import { RequestType } from "../../enum/RequestType.enum";

interface RequestData {
  id: number | null;
  user: number | undefined;
  requestDate?: string;
  requestStatus?: string;
  adminComments?: string;
  requestTitle?: string;
  requestBody?: string;
}

interface FullRequestData extends RequestData {
  id: number | null;
  user: number | undefined;
  requestDate?: string;
  requestStatus?: string;
  adminComments?: string;
  appTitle: string;
  appDescription: string;
  publishApp: boolean;
  downloadableNow: boolean;
  appZipFile: File;
  appIconFile: File;
  appImageFile: File;
  selectedCategories: string[];
  selectedDeveloperId: number;
}

const NewRequestModal = ({
  requestToManage,
  isEditing,
  handleClose,
  requestType,
}: {
  requestToManage: RequestData;
  isEditing: boolean;
  handleClose: () => void;
  requestType?: RequestType;
}) => {
  const cleanRequest: FullRequestData = {
    id: null,
    user: authService.getUserIdFromToken(),
    appTitle: "",
    appDescription: "",
    publishApp: false,
    downloadableNow: false,
    appZipFile: new File([], ""),
    appIconFile: new File([], ""),
    appImageFile: new File([], ""),
    selectedCategories: [],
    selectedDeveloperId: 0,
  };

  const MOCK_CATEGORIES = [
    { id: 1, name: "FPS", type: "game" },
    { id: 2, name: "TPS", type: "game" },
    { id: 3, name: "RPG", type: "game" },
    { id: 4, name: "Emulacion", type: "app" },
  ];

  const MOCK_DEVELOPERS = [
    { id: 1, name: "Alonso" },
    { id: 2, name: "Juan" },
    { id: 3, name: "Maria" },
  ];

  const [actualRequest, setActualRequest] = useState<FullRequestData>(cleanRequest);
  const [mockCategories, setMockCategories] = useState(MOCK_CATEGORIES);
  const [mockDevelopers, setMockDevelopers] = useState(MOCK_DEVELOPERS);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = (target as HTMLInputElement).name || target.id;

    if (!name) {
      console.warn("Input element is missing a 'name' or 'id' attribute.", target);
      return;
    }

    if (name === "selectedCategories" && target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(target.selectedOptions).map((option) => option.value);
      setActualRequest((prev) => ({
        ...prev,
        selectedCategories: selectedOptions,
      }));
      return;
    }

    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;

    setActualRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(e.target.value);
    console.log(actualRequest);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    const inputId = e.target.id;

    if (file) {
      let isValid = false;
      let expectedType = "";

      if (inputId === "appIconFile" || inputId === "appImageFile") {
        isValid = file.name.toLowerCase().endsWith(".jpg");
        expectedType = "JPG";
      } else if (inputId === "appZipFile") {
        isValid = file.name.toLowerCase().endsWith(".zip");
        expectedType = "ZIP";
      }

      if (isValid) {
        setActualRequest((prev) => ({ ...prev, [inputId]: file }));
      } else {
        alert(`Por favor, selecciona un archivo ${expectedType} válido.`);
        e.target.value = "";
        setActualRequest((prev) => ({ ...prev, [inputId]: null }));
      }
    } else {
      setActualRequest((prev) => ({ ...prev, [inputId]: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("requestToManage", JSON.stringify(actualRequest));
    console.log("Enviando solicitud", actualRequest);
  };

  const renderStandardForm = () => (
    <>
      <InputField
        id="requestTitle" // Clave para el estado
        label="Título de la Solicitud"
        placeholder="Ej: Problemas con la subida de mis aplicaciones"
        value={actualRequest.requestTitle}
        onChange={handleInputChange}
        required
      />
      <InputField
        id="requestBody" // Clave para el estado
        as="textarea"
        label="Cuerpo de la Solicitud"
        placeholder="Describe tu problema o solicitud"
        value={actualRequest.requestBody}
        onChange={handleInputChange}
        rows={4}
        required
      />
    </>
  );

  const renderAppUploadForm = () => (
    <>
      <InputField
        id="appTitle"
        label="Título de la Aplicación"
        placeholder="Ej: Mi Increíble App"
        value={actualRequest.appTitle}
        onChange={handleInputChange}
        required
      />
      <InputField
        id="appDescription"
        as="textarea"
        label="Descripción de la Aplicación"
        placeholder="Describe las funcionalidades de tu app..."
        value={actualRequest.appDescription}
        onChange={handleInputChange}
        rows={4}
        required
      />

      <div className={styles.formGroup}>
        <label htmlFor="selectedCategories" className={styles.label}>
          Categorías (Mantén Ctrl/Cmd para seleccionar varias)
        </label>
        <select
          id="selectedCategories"
          name="selectedCategories"
          multiple
          value={actualRequest.selectedCategories}
          onChange={handleInputChange}
          className={styles.selectMultiple}
          required
        >
          {mockCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {actualRequest.selectedCategories && actualRequest.selectedCategories.length > 0 && (
          <p className={styles.feedbackText}>
            Seleccionadas:{" "}
            {actualRequest.selectedCategories
              .map(
                (catId) =>
                  mockCategories.find((c) => c.id === Number.parseInt(catId))?.name || catId
              )
              .join(", ")}
          </p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="selectedDeveloperId" className={styles.label}>
          Desarrollador
        </label>
        <select
          id="selectedDeveloperId"
          name="selectedDeveloperId"
          value={actualRequest.selectedDeveloperId}
          onChange={handleInputChange}
          className={styles.select}
          required
        >
          <option value="" disabled>
            Selecciona un desarrollador...
          </option>
          {mockDevelopers.map((developer) => (
            <option key={developer.id} value={developer.id}>
              {developer.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.checkboxGroup}>
        <label htmlFor="publishApp" className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id="publishApp"
            name="publishApp"
            checked={actualRequest.publishApp}
            onChange={handleInputChange}
          />
          ¿Publicar la aplicación al ser aprobada?
        </label>
      </div>

      <div className={styles.checkboxGroup}>
        <label htmlFor="downloadableNow" className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id="downloadableNow"
            name="downloadableNow"
            checked={actualRequest.downloadableNow}
            onChange={handleInputChange}
          />
          ¿Permitir descarga inmediata tras publicación?
        </label>
      </div>

      <div className={styles.fileGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="appIconFile" className={styles.label}>
            Icono de la Aplicación (.jpg)
          </label>
          <input
            type="file"
            id="appIconFile"
            name="appIconFile_input"
            accept=".jpg"
            required={!isEditing}
            onChange={handleFileChange}
            className={styles.fileInputDirect}
          />
          {actualRequest.appIconFile && (
            <p className={styles.fileName}>Seleccionado: {actualRequest.appIconFile.name}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="appImageFile" className={styles.label}>
            Imagen Principal de la Aplicación (.jpg)
          </label>
          <input
            type="file"
            id="appImageFile"
            name="appImageFile_input"
            accept=".jpg"
            required={!isEditing}
            onChange={handleFileChange}
            className={styles.fileInputDirect}
          />
          {actualRequest.appImageFile && (
            <p className={styles.fileName}>Seleccionado: {actualRequest.appImageFile.name}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="appZipFile" className={styles.label}>
            Archivo de la Aplicación (.zip)
          </label>
          <input
            type="file"
            id="appZipFile"
            name="appZipFile_input"
            accept=".zip"
            required={!isEditing}
            onChange={handleFileChange}
            className={styles.fileInputDirect}
          />
          {actualRequest.appZipFile && (
            <p className={styles.fileName}>Seleccionado: {actualRequest.appZipFile.name}</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalWrapper}>
        <h1>
          {isEditing ? "Actualizar Solicitud" : "Nueva Solicitud"}
          {requestType === RequestType.AppUpload && " de Aplicación"}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {requestType === RequestType.Standard && renderStandardForm()}
          {requestType === RequestType.AppUpload && renderAppUploadForm()}
          <div>
            <button className={styles.sendButton} type="submit">
              Enviar
            </button>
            <button className={styles.closeButton} onClick={handleClose}>
              X
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
