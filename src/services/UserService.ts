import axios from "axios";
import authService, { Role } from "./AuthService";
import { BaseDataRow } from "../interfaces/CustomTable.interface";
import {
  publisherRequestDto,
  staffRequestDto,
  UserRequestDto,
} from "../interfaces/UserData.interface";

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

const getStaffRoles = async (): Promise<Role[] | null> => {
  try {
    const token = authService.getToken();
    const response = await axios.get("http://localhost:8080/api/v1/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as Role[];
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return [];
    }
  } catch (err) {
    console.error("Error al obtener los roles:", err);
    throw err;
  }
};

const createUser = async (userData: UserRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/auth/register", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al crear usuario:", err);
    throw err;
  }
};

const createStaff = async (userData: staffRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/staff", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al crear usuario:", err);
    throw err;
  }
};

const createPublisher = async (userData: publisherRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/publishers", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al crear usuario:", err);
    throw err;
  }
};

const updateUser = async (id: number, userData: UserRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.put(
      "http://localhost:8080/api/v1/users/" + id,
      { id, ...userData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    throw err;
  }
};

const updateStaff = async (id: number, userData: staffRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.put(
      "http://localhost:8080/api/v1/staff/" + id,
      { id, ...userData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    throw err;
  }
};

const updatePublisher = async (id: number, userData: publisherRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.put(
      "http://localhost:8080/api/v1/publishers/" + id,
      { id, ...userData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    throw err;
  }
};

const togleUserEnabled = async (id: number) => {
  try {
    const token = authService.getToken();
    const response = await axios.patch(
      "http://localhost:8080/api/v1/users/" + id + "/toggle-enable",
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data as UserData;
    } else {
      console.warn(
        "La respuesta de la API no tiene la estructura esperada (response.data.data).",
        response.data
      );
      return null;
    }
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    throw err;
  }
};

const userService = {
  getAllNormalUsers,
  getAllStaffs,
  getAllPublishers,
  getStaffRoles,
  createUser,
  createStaff,
  createPublisher,
  updateUser,
  updateStaff,
  updatePublisher,
  togleUserEnabled,
};

export default userService;
