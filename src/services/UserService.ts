import axios from "axios";
import authService, { Role } from "./AuthService";
import { BaseDataRow } from "../interfaces/CustomTable.interface";

interface UserData extends BaseDataRow {
  id: number;
  username: string;
  email: string;
  userType: UserType;
  isEnabled: boolean;
  accountNotLocked: boolean;
  registerDate: string;
  lastLogin: string;
  publisherName?: string;
  nif?: string;
  address?: string;
  assignedStaff?: string;
  roles?: Role[];
}

enum UserType {
  "user",
  "publisher",
  "staff",
}

const getAllNormalUsers = async (): Promise<UserData[] | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/users/normal", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as UserData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    throw err;
  }
};

const getAllStaffs = async (): Promise<UserData[] | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/staff", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as UserData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    throw err;
  }
};

const getAllPublishers = async (): Promise<UserData[] | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/publishers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as UserData[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    throw err;
  }
};

const userService = {
  getAllNormalUsers,
  getAllStaffs,
  getAllPublishers,
};

export default userService;
