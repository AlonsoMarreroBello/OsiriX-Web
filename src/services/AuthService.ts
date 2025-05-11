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

export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  userId: number;
}

const API_PORT = "http://localhost:8080/api/v1";

const login = async (credentials: AuthLoginRequestDto) => {
  try {
    const response = await axios.post(`${API_PORT}/auth/login`, credentials);
    localStorage.setItem("token", response.data.data.token);
    console.log("token", response);
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
    console.log(tokenData);
    return tokenData.sub;
  }
};

const getUserIdFromToken = () => {
  const token = getToken();
  if (token) {
    const tokenData: DecodedToken = jwtDecode(token);
    console.log(tokenData, "service userId");
    return tokenData.userId;
  }
};

const authService = {
  login,
  getToken,
  clearToken,
  getUsernameFromToken,
  getUserIdFromToken,
};
export default authService;
