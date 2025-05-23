import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export interface AuthLoginRequestDto {
  email: string;
  password: string;
  origin: string;
}

export interface AuthLoginResponseDto {
  token: string;
  tokenType: string;
}

export interface Role {
  id: number;
  roleName: string;
  roleDescription: string;
}

export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  userId: number;
  userType: string;
  roles: Role[];
}

const API_PORT = "http://localhost:8080/api/v1";

/**
 * Method for loging in the user
 * @param credentials - The object containing the user's email and password
 * @returns The response from the API containing the token and the user's information
 * @error If the response from the API does not contain a `data` property, a warning will be logged and `null` will be returned.
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const login = async (credentials: AuthLoginRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/login`, credentials);
    if (response.data.data.token.userType !== "USER") {
      localStorage.setItem("token", response.data.data.token);
      toast.success("Sesión iniciada");
    } else {
      clearToken();
      toast.error("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error(error);
    toast.error("Usuario o contraseña incorrectos");
  }
};

/**
 * Gets the token from local storage
 * @returns the token from local storage
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getToken = () => localStorage.getItem("token");

/**
 * Cleans the toke from local storage
 */
const clearToken = () => localStorage.removeItem("token");

/**
 * Gets the username from the token
 * @returns a string representing the username
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getUsernameFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    return tokenData.sub;
  }
};

/**
 * Gets the user id from the token
 * @returns the user id or null if the token is not valid
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getUserIdFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    return tokenData.userId;
  }
};

/**
 * Gets the user type from the token
 * @returns the user type or null if the token is not valid
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getUserTypeFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    return tokenData.userType;
  }
};

/**
 * Gets the user roles from the token
 * @returns an array of roles or an empty array if the token is not valid
 * @date 22/05/2025
 * @author Alonso Marrero Bello
 */
const getUserRolesFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    if (tokenData.roles == null || tokenData.roles === undefined) {
      return [];
    }
    return tokenData.roles;
  }
};

const authService = {
  login,
  getToken,
  clearToken,
  getUsernameFromToken,
  getUserIdFromToken,
  getUserTypeFromToken,
  getUserRolesFromToken,
};
export default authService;
