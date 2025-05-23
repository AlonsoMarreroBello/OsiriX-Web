import axios from "axios";
import { DeveloperData, DeveloperRequestDto } from "../interfaces/Developer.interface";
import authService from "./AuthService";
import { toast } from "react-toastify";

/**
 * Fetches all developers from the API
 * @returns an Array of `DeveloperData` objects or `null` if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getAllDevelopers = async (): Promise<DeveloperData[] | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/developers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data.sort((a: DeveloperData, b: DeveloperData) => a.id! - b.id!);
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener todos los desarrolladores:", err);
    throw err;
  }
};

/**
 * Creates a new developer in the API
 * @param {DeveloperRequestDto} developerData - The data to be sent in the request body.
 *
 * @returns the data of the created developer or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const createDeveloper = async (developerData: DeveloperRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/developers", developerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      toast.success("Desarrollador creado correctamente.");
      return response.data.data as DeveloperData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo crear el desarrollador. Inténtalo de nuevo.");
    console.error("Error al crear desarrollador:", err);
    throw err;
  }
};

/**
 * Deletes a developer from the API
 * @param id the id of the developer to be deleted
 * @returns the data of the deleted developer or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const deleteDeveloper = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.delete("http://localhost:8080/api/v1/developers/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      toast.success("Desarrollador eliminado correctamente.");
      return response.data.data as DeveloperData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo eliminar el desarrollador. Inténtalo de nuevo.");
    console.error("Error al eliminar desarrollador:", err);
    throw err;
  }
};

/**
 * Updates a developer in the API
 * @param id the id of the developer to be updated
 * @param developerData  the data to be sent in the request body
 * @returns the data of the updated developer or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const updateDeveloper = async (
  id: number,
  developerData: DeveloperRequestDto
): Promise<DeveloperData | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.put(
      `http://localhost:8080/api/v1/developers/${id}`,
      developerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      toast.success("Desarrollador actualizado correctamente.");
      return response.data.data as DeveloperData;
    } else {
      console.warn(
        "La respuesta de la API (update) no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    toast.error("No se pudo actualizar el desarrollador. Inténtalo de nuevo.");
    console.error(`Error al actualizar desarrollador con ID ${id}:`, err);
    throw err;
  }
};

/**
 * Gets a developer from the API
 * @param id the id of the developer to be fetched
 * @returns the data of the developer or null if the response from the API
 * does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getDeveloperById = async (id: number): Promise<DeveloperData | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get(`http://localhost:8080/api/v1/developers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as DeveloperData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error(`Error al obtener desarrollador con ID ${id}:`, err);
    throw err;
  }
};

const developerService = {
  getAllDevelopers,
  createDeveloper,
  deleteDeveloper,
  updateDeveloper,
  getDeveloperById,
};

export default developerService;
