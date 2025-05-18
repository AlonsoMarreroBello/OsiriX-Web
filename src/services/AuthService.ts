import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
  name: string;
  description: string;
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

const login = async (credentials: AuthLoginRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/login`, credentials);
    if (response.data.data.token.userType !== "USER") {
      localStorage.setItem("token", response.data.data.token);
    } else {
      clearToken();
    }
  } catch (error) {
    console.error(error);
  }
};

const getToken = () => localStorage.getItem("token");

const clearToken = () => localStorage.removeItem("token");

const getUsernameFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    return tokenData.sub;
  }
};

const getUserIdFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    return tokenData.userId;
  }
};

const getUserTypeFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    return tokenData.userType;
  }
};

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
