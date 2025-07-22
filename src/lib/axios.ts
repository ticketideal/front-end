import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Se config.headers for undefined, cria nova instância AxiosHeaders
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    // Se for instância AxiosHeaders, usa método set
    if (config.headers instanceof axios.AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      // Caso headers seja objeto simples (por algum motivo)
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }

  return config;
});

export { api };
