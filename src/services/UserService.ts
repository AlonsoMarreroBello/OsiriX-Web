import axios from "axios";
import authService, { Role } from "./AuthService";
import { BaseDataRow } from "../interfaces/CustomTable.interface";
import {
  publisherRequestDto,
  staffRequestDto,
  UserRequestDto,
} from "../interfaces/UserData.interface";
import { toast } from "react-toastify";

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

/**
 * This function retrieves all normal users from an API using an authorization token and returns their
 * data if the response structure is as expected.
 *
 * @returns The function `getAllNormalUsers` is returning a Promise that resolves to an array of
 * `UserData` objects or `null`.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * This function retrieves all staff data from an API using a token for authorization and returns it as
 * an array of UserData objects, handling errors appropriately.
 * @returns The `getAllStaffs` function is returning a Promise that resolves to an array of `UserData`
 * objects or `null`.
 *
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * The function `getAllPublishers` asynchronously fetches publishers data from an API endpoint with
 * authorization token handling.
 * @returns The function `getAllPublishers` is returning a Promise that resolves to an array of
 * `UserData` objects or `null`.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * The function `getStaffRoles` asynchronously fetches staff roles from an API using a token for
 * authorization and handles potential errors.
 * @returns The `getStaffRoles` function is returning a Promise that resolves to an array of `Role`
 * objects or `null`.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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

/**
 * The function `createUser` sends a POST request to register a new user with the provided user data
 * and authorization token, handling the response data accordingly.
 * @param {UserRequestDto} userData - The user data to be sent in the request body.
 *
 * @returns If the response from the API contains a `data` property and within that property there is a
 * `data` property as well, then the function will return the `data` property as `UserData`. If the
 * response does not have the expected structure, a warning will be logged and `null` will be returned.
 * If an error occurs during the process, it will be caught and throwed to the caller.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const createUser = async (userData: UserRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/auth/register", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      toast.success("Usuario creado correctamente.");
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

/**
 * The function `createStaff` is an asynchronous function that sends a POST request to create a new
 * staff member using provided user data and authentication token.
 *
 * @param {staffRequestDto} userData - The user data to be sent in the request body.
 *
 * @returns The `createStaff` function is returning the `UserData` object from the response data if it
 * exists. If the response data does not have the expected structure (`response.data.data`), a warning
 * message is logged and `null` is returned. If an error occurs during the process, the error is logged
 * and rethrown.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const createStaff = async (userData: staffRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/staff", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      toast.success("Usuario creado correctamente.");
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

/**
 * The function `createPublisher` sends a POST request to create a publisher with user data, handling
 * authentication and error cases.
 *
 * @param {publisherRequestDto} userData - The user data to be sent in the request body.
 *
 * @returns The `createPublisher` function is returning the user data (`UserData`) from the response if
 * it exists in the expected structure (`response.data.data`).
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const createPublisher = async (userData: publisherRequestDto) => {
  try {
    const token = authService.getToken();
    const response = await axios.post("http://localhost:8080/api/v1/publishers", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      toast.success("Usuario creado correctamente.");
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

/**
 * The function `updateUser` sends a PUT request to update user data with authorization token and
 * returns the updated user data if successful.
 *
 * @param {number} id - The `id` parameter in the `updateUser` function is the unique identifier of the
 * user you want to update.
 *
 * @param {UserRequestDto} userData - Contains the data needed to update a user in the system. This data
 * could include fields such as name, email, or any other user-related information that needs
 * to be updated. If there is no password given, the user will keep the same password.
 *
 * @returns The updateUser function is returning the updated user data as UserData if the response from
 * the API contains the expected structure (response.data.data). If the response does not have the
 * expected structure, it will log a warning message and return null. If there is an error during the
 * update process, it will log an error message and rethrow the error.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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
      toast.success("Usuario actualizado correctamente.");
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

/**
 * This TypeScript function updates staff information by sending a PUT request to a specified API
 * endpoint with the user's data and authorization token.
 *
 * @param {number} id - The unique identifier of the staff member that you want to update.
 *
 * @param {staffRequestDto} userData - Contains the data needed to update a staff member in the
 * system. This data could include information such as the staff member's name, email, role, or any
 * other relevant details that need to be updated. If there is no password given, the user will keep
 * the same password.
 *
 * @returns The `updateStaff` function is returning the updated user data as `UserData` if the response
 * from the API contains `data` property. If the response does not have the expected structure, it will
 * log a warning message and return `null`. If there is an error during the update process, it will log
 * an error message and rethrow the error.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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
      toast.success("Usuario actualizado correctamente.");
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

/**
 * The function `updatePublisher` sends a PUT request to update a publisher's data with authentication
 * token and returns the updated data.
 *
 * @param {number} id - The unique identifier of the publisher that you want to update.
 *
 * @param {publisherRequestDto} userData - The data that needs to be updated for a publisher entity.
 * It could include fields such as name, email, address, or any other relevant
 * information associated with a publisher. If there is no password given, the user will keep the same password.
 *
 * @returns The `updatePublisher` function is returning the updated user data (`response.data.data`) as
 * `UserData` if the response from the API contains the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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
      toast.success("Usuario actualizado correctamente.");
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

/**
 * This TypeScript function toggles the enabled status of a user by sending a PATCH request to the API
 * endpoint with the user ID and authorization token.
 *
 * @param {number} id - The `id` parameter is the unique identifier of the user whose enabled status
 * you want to toggle.
 *
 * @returns The function `toggleUserEnabled` is returning either the `UserData` object from the
 * response data if it exists, or `null` if the response data does not have the expected structure.
 *
 * @error If the response from the API does not contain a `data` property, a warning will be logged
 * and `null` will be returned.
 *
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
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
