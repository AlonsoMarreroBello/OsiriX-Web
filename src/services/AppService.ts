import axios from "axios";
import authService from "./AuthService";
import { ApplicationData } from "../interfaces/AplicationData.interface";

const getAllApps = async () => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/apps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as ApplicationData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las aplicaciones:", err);
    throw err;
  }
};

const toggleAppVisibility = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.patch(
      `http://localhost:8080/api/v1/apps/${id}/toggle-visibility`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as ApplicationData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al cambiar la visibilidad de la aplicación:", err);
    throw err;
  }
};

const toggleAppDownloadable = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.patch(
      `http://localhost:8080/api/v1/apps/${id}/toggle-downloadable`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as ApplicationData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al cambiar la visibilidad de la aplicación:", err);
    throw err;
  }
};

const togglePublicateApp = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.patch(
      `http://localhost:8080/api/v1/apps/${id}/toggle-publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as ApplicationData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al cambiar la visibilidad de la aplicación:", err);
    throw err;
  }
};

const getAllAppsByPublisher = async () => {
  try {
    const token = authService.getToken();
    const userId = authService.getUserIdFromToken();
    const response = await axios.get("http://localhost:8080/api/v1/apps/by-publisher/" + userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as ApplicationData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todas las aplicaciones:", err);
    throw err;
  }
};

const appService = {
  getAllApps,
  toggleAppDownloadable,
  toggleAppVisibility,
  togglePublicateApp,
  getAllAppsByPublisher,
};

export default appService;
