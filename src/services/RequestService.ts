import axios from "axios";
import authService from "./AuthService";
import { Application, FullRequestData } from "../interfaces/RequestData.interface";
import developerService from "./DeveloperService";
import { toast } from "react-toastify";

const getAllRequests = async () => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/request", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as FullRequestData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las solicitudes:", err);
    throw err;
  }
};

const getAllPublicationRequests = async () => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const response = await axios.get(
      "http://localhost:8080/api/v1/requests/publication/by-staff/" + Number(userId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as FullRequestData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las solicitudes:", err);
    throw err;
  }
};

const getRequestsByUser = async () => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const response = await axios.get(
      "http://localhost:8080/api/v1/request/by-user/" + Number(userId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as FullRequestData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las solicitudes:", err);
    throw err;
  }
};

const getPublicationRequestsByUser = async () => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const response = await axios.get(
      "http://localhost:8080/api/v1/requests/publication/by-user/" + Number(userId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as FullRequestData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las solicitudes:", err);
    throw err;
  }
};

const createRequest = async (request: FullRequestData) => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const response = await axios.post(
      "http://localhost:8080/api/v1/request",
      {
        userId: Number(userId),
        requestTitle: request.requestTitle,
        requestBody: request.requestBody,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Solicitud creada correctamente.");
      return response.data.data as FullRequestData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo crear la solicitud. Inténtalo de nuevo.");
    console.error("Error al crear una solicitud:", err);
    throw err;
  }
};

const updateRequest = async (request: FullRequestData) => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const response = await axios.patch(
      "http://localhost:8080/api/v1/request/" + request.id,
      {
        userId: Number(userId),
        requestTitle: request.requestTitle,
        requestBody: request.requestBody,
        status: request.requestStatus,
        adminComments: request.adminComments ? request.adminComments : "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Solicitud actualizada correctamente.");
      return response.data.data as FullRequestData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (error) {
    toast.error("No se pudo actualizar la solicitud. Inténtalo de nuevo.");
    console.error("Error al obtener las solicitudes:", error);
    return null;
  }
};

const createApp = async (app: Application) => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();

    const categories = app.categories.map((category) => {
      return {
        categoryName: category.name,
        type: category.categoryType,
      };
    });

    const response = await axios.post(
      "http://localhost:8080/api/v1/apps",
      {
        publisherId: userId,
        developerId: app.developer.developerId,
        name: app.name,
        version: "1.0.0",
        description: app.description,
        isPublished: false,
        isDownloadable: app.isDownloadable,
        isVisible: app.isVisible,
        categories: categories,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Información de la aplicación enviada correctamente.");
      return response.data.data;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo enviar la información de la aplicación. Inténtalo de nuevo.");
    console.error("Error al crear una aplicación:", err);
    throw err;
  }
};

const createPublicationRequest = async (
  appId: number,
  developerId: number,
  request: FullRequestData
) => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const developer = await developerService.getDeveloperById(developerId);
    const response = await axios.post(
      "http://localhost:8080/api/v1/requests/publication",
      {
        userId: Number(userId),
        requestTitle: request.requestTitle,
        requestBody: request.requestBody,
        developerName: developer?.name,
        appId: appId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Solicitud de publicación creada correctamente.");
      return response.data.data as FullRequestData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo crear la solicitud de publicación. Inténtalo de nuevo.");
    console.error("Error al crear una solicitud de publicación:", err);
    throw err;
  }
};

const batchUploadFiles = async (appId: number, icon: File, images: File[], zip: File) => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();

    const formData = new FormData();
    formData.append("userId", String(userId));
    if (icon) {
      formData.append("iconFile", icon, "icon.jpg");
    } else {
      console.warn("El archivo de icono (icon) es null o undefined. No se adjuntará 'iconFile'.");
    }

    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("imageFiles", file, "image.jpg");
        console.log(`Se adjuntaron ${images.length} archivos como 'imageFiles' a FormData.`);
      });
      console.log(`Se adjuntaron ${images.length} archivos como 'imageFiles' a FormData.`);
    } else {
      console.warn(
        "El array 'image' está vacío, es null o undefined. No se adjuntará 'imageFiles'."
      );
    }
    if (zip) {
      formData.append("zipFile", zip, "data.zip");
      console.log(`Se adjuntaron ${images.length} archivos como 'imageFiles' a FormData.`);
    } else {
      console.warn("El archivo zip (zip) es null o undefined. No se adjuntará 'zipFile'.");
    }
    toast.info("Subiendo archivos, por favor, no cierre o salga de la página.");

    const response = await axios.post(
      "http://localhost:8080/api/v1/batch-upload/" + appId,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);

    if (response.data) {
      toast.success("Archivos subidos correctamente.");
      return response.data;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudieron subir los archivos. Inténtalo de nuevo.");
    console.error("Error al subir archivos en lote:", err);
    throw err;
  }
};

const handlePublicationRequest = async (request: FullRequestData) => {
  try {
    if (request.app) {
      const app = request.app;
      const createdApp = await createApp(app);

      if (createdApp) {
        const publicationRequest = await createPublicationRequest(
          createdApp.appId,
          request.app?.developer.developerId,
          request
        );

        if (publicationRequest) {
          const batchUpload = await batchUploadFiles(
            createdApp.appId,
            request.appIconFile!,
            [request.appImageFile!],
            request.appZipFile!
          );

          if (batchUpload) {
            console.log("Publicación de la solicitud de app subida exitosamente");
          }
        }
      }
    }
  } catch (err) {
    console.error("Error al procesar la solicitud de publicación:", err);
    throw err;
  }
};

const requestService = {
  getAllRequests,
  getAllPublicationRequests,
  getRequestsByUser,
  getPublicationRequestsByUser,
  createRequest,
  updateRequest,
  handlePublicationRequest,
};

export default requestService;
