import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("API_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If we're sending FormData, do NOT force JSON content-type.
    // Let Axios set multipart boundary automatically.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("API_TOKEN");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
