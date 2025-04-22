import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://connectsphere.uu.sy/api",
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json'
  }
});
