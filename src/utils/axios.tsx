import OriginalAxios from "axios";
const isLocal = window.location.hostname === "localhost";

export const axios = OriginalAxios.create({

   baseURL: isLocal ? "http://localhost:5617" : "http://192.168.133.69:5617",

  withCredentials: true,
});
