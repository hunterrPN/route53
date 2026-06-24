import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const persistedState = localStorage.getItem("route53-auth-store");
      if (persistedState) {
        try {
          const parsed = JSON.parse(persistedState);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error parsing auth token", error);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
