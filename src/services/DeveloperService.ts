import axios from "axios";
import { DeveloperData, DeveloperRequestDto } from "../interfaces/Developer.interface";
import authService from "./AuthService";
import { toast } from "react-toastify";

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
