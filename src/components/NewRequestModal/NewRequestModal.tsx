import styles from "./NewRequestModal.module.css";
import InputField from "../InputField/InputField";
import { useEffect, useState } from "react";
import { RequestType } from "../../enum/RequestType.enum";
import { CategoryData } from "../../interfaces/Category.interface";
import { FullRequestData } from "../../interfaces/RequestData.interface";
import { UserType } from "../../interfaces/UserData.interface";
import developerService from "../../services/DeveloperService";
import categoryService from "../../services/CategoryService";
import { DeveloperData } from "../../interfaces/Developer.interface";
import requestService from "../../services/RequestService";
import authService from "../../services/AuthService";

const NewRequestModal = ({
  requestToManage,
  isEditing,
  handleClose,
  requestType,
}: {
  requestToManage: FullRequestData;
  isEditing: boolean;
  handleClose: () => void;
  requestType?: RequestType;
}) => {
  const cleanRequest: FullRequestData = {
    id: null,
    user: {
      id: 0,
      username: "",
      email: "",
      userType: UserType.user,
      isEnabled: true,
      accountNotLocked: true,
      lastLogin: "",
      registerDate: "",
    },
    appTitle: "",
    appDescription: "",
    publishApp: false,
    downloadableNow: false,
    appZipFile: new File([], ""),
    appIconFile: new File([], ""),
    appImageFile: new File([], ""),
    selectedCategories: [],
    selectedDeveloperId: 0,
    requestType: RequestType.AppUpload,
  };

  const [actualRequest, setActualRequest] = useState<FullRequestData>(cleanRequest);
  const [mockCategories, setMockCategories] = useState<CategoryData[]>([]);
  const [mockDevelopers, setMockDevelopers] = useState<DeveloperData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authService.getUserTypeFromToken() === "STAFF") {
      setIsAdmin(true);
    }

    const fetchCategories = async () => {
      try {
        const tmp_categories = await categoryService.getAllCategories();
        const data = tmp_categories!.map((category) => ({
          id: category.categoryId,
          name: category.categoryName,
          categoryType: category.categoryType,
        }));
        setMockCategories(data || []);
      } catch (err) {
        console.error("Error al obtener todas las categorías:", err);
        setMockCategories([]);
      }
    };

    const fetchDevelopers = async () => {
      try {
        const tmp_developers = await developerService.getAllDevelopers();

        if (!tmp_developers || tmp_developers.length === 0) {
          setMockDevelopers([]);
          return;
        }

        const data: DeveloperData[] = tmp_developers
          .map((apiDev): DeveloperData | null => {
            const numericId = Number(apiDev.id);

            if (apiDev.id === null || apiDev.id === undefined || isNaN(numericId)) {
              console.warn(
                `Desarrollador con nombre "${apiDev.name}" tiene un ID inválido o nulo: ${apiDev.id}. Se omitirá.`
              );
              return null;
            }

            return {
              id: numericId,
              name: apiDev.name,
            };
          })
          .filter((developer): developer is DeveloperData => developer !== null);

        setMockDevelopers(data);
      } catch (err) {
        console.error("Error al obtener todos los desarrolladores:", err);
        setMockDevelopers([]);
      }
    };

    fetchCategories();
    fetchDevelopers();

    if (requestToManage.id) {
      setActualRequest(requestToManage);
    }
  }, [requestToManage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = (target as HTMLInputElement).name || target.id;

    if (!name) {
      console.warn("Input element is missing a 'name' or 'id' attribute.", target);
      return;
    }

    if (name === "status") {
      setActualRequest((prev) => ({ ...prev, requestStatus: target.value }));
      return;
    }

    if (name === "selectedCategories" && target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(target.selectedOptions).map((option) => option.value);

      const mappedRolesOrUndefined = selectedOptions.map((optionName) =>
        mockCategories.find((c) => c.name === optionName)
      );

      const selectedRoles = mappedRolesOrUndefined.filter((role) => role !== undefined);
      setActualRequest((prev) => ({
        ...prev,
        selectedCategories: selectedRoles,
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

    if (requestType === RequestType.AppUpload) {
      if (!isEditing) {
        requestService.handlePublicationRequest({
          id: actualRequest.id,
          user: actualRequest.user,
          developer: actualRequest.developer,
          app: {
            appId: 0,
            name: actualRequest.appTitle!,
            description: actualRequest.appDescription!,
            isDownloadable: actualRequest.downloadableNow!,
            isVisible: actualRequest.publishApp!,
            categories: actualRequest.selectedCategories!,
            developer: {
              developerId: actualRequest.selectedDeveloperId!,
              name: "",
            },
          },
          requestTitle: actualRequest.appTitle!,
          requestBody: actualRequest.appDescription!,
          requestType: actualRequest.requestType,
          appTitle: actualRequest.app?.name,
          appDescription: actualRequest.app?.description,
          publishApp: actualRequest.publishApp,
          downloadableNow: actualRequest.downloadableNow,
          appZipFile: actualRequest.appZipFile,
          appIconFile: actualRequest.appIconFile,
          appImageFile: actualRequest.appImageFile,
          selectedCategories: actualRequest.selectedCategories,
          selectedDeveloperId: actualRequest.selectedDeveloperId,
          requestId: actualRequest.id,
          appId: actualRequest.app?.appId,
        });
      }
    } else {
      if (!isEditing) {
        requestService.createRequest(actualRequest);
      } else {
        requestService.updateRequest(actualRequest);
      }
    }

    handleClose();
  };

  const renderStandardForm = () => (
    <>
      <InputField
        id="requestTitle"
        label="Título de la Solicitud"
        placeholder="Ej: Problemas con la subida de mis aplicaciones"
        value={actualRequest.requestTitle}
        onChange={handleInputChange}
        required
        disabled={isAdmin}
      />
      <InputField
        id="requestBody"
        as="textarea"
        label="Cuerpo de la Solicitud"
        placeholder="Describe tu problema o solicitud"
        value={actualRequest.requestBody}
        onChange={handleInputChange}
        rows={4}
        required
        disabled={isAdmin}
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
        disabled={isAdmin}
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
        disabled={isAdmin}
      />

      <div className={styles.formGroup}>
        <label htmlFor="selectedCategories" className={styles.label}>
          Categorías (Mantén Ctrl/Cmd para seleccionar varias)
        </label>
        <select
          id="selectedCategories"
          name="selectedCategories"
          multiple
          value={actualRequest.selectedCategories?.map((category) => category.name)}
          onChange={handleInputChange}
          className={styles.selectMultiple}
          required
          disabled={isAdmin}
        >
          {mockCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {actualRequest.selectedCategories && actualRequest.selectedCategories.length > 0 && (
          <p className={styles.feedbackText}>
            Seleccionadas:{" "}
            {actualRequest.selectedCategories
              .map((cat) => mockCategories.find((c) => c.id === cat.id)?.name || "")
              .join(", ")}
            .
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
          disabled={isAdmin}
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
            disabled={isAdmin}
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
            disabled={isAdmin}
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
            disabled={isAdmin}
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
            disabled={isAdmin}
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
            disabled={isAdmin}
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
          {isAdmin && (
            <>
              <div>
                <select
                  id="status"
                  name="status"
                  value={actualRequest.requestStatus}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value={"PENDANT"}>Pendiente</option>
                  <option value={"ACCEPTED"}>Aceptar</option>
                  <option value={"REVOKED"}>Rechazar</option>
                </select>
              </div>
              <div>
                <InputField
                  id="adminComments"
                  label="Comentarios"
                  as="textarea"
                  placeholder="Escriba aquí sus rollos de administrador ..."
                  value={actualRequest.adminComments}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </>
          )}
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
