import axios from "axios";

const baseURL = "http://localhost:8000/api";

const instance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    head: "application/json",
  },
});

export default instance;
