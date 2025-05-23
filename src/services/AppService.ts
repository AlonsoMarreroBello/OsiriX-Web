import axios from "axios";
import authService from "./AuthService";
import { ApplicationData } from "../interfaces/AplicationData.interface";

/**
 * Retireves all the apps from the API
 * @returns An array of ApplicationData objects or null if the response from the API does not have the expected structure.
 * @error If the response from the API does not contain a `data` property, a warning will be logged and `null` will be returned.
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * Changes the visibility of an app by sending a PATCH request to the API endpoint with the app ID and authorization token.
 * @param {number} id - The unique identifier of the app you want to change the visibility of.
 * @returns The information of the app with the updated visibility or null if the response from the API does not have the expected structure.
 * @error If the response from the API does not contain a `data` property, a warning will be logged and `null` will be returned.
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * Changes the downloadable status of an app by sending a PATCH request to the API endpoint with the app ID and authorization token.
 * @param {number} id - The unique identifier of the app you want to change the downloadable status of.
 * @returns The information of the app with the updated downloadable status or null if the response from the API does not have the expected structure.
 * @error If the response from the API does not contain a `data` property, a warning will be logged and `null` will be returned.
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * Changes the publication status of an app by sending a PATCH request to the API endpoint with the app ID and authorization token.
 * @param {number} id - The unique identifier of the app you want to change the publication status of.
 * @returns The information of the app with the updated publication status or null if the response from the API does not have the expected structure.
 * @error If the response from the API does not contain a `data` property, a warning will be logged and `null` will be returned.
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * Retireves all the apps ralted to a publisher from the API
 * @returns An array of ApplicationData objects or null if the response from the API does not have the expected structure.
 * @error If the response from the API does not contain a `data` property, a warning will be logged and `null` will be returned.
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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
