import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // כי אתה עובד עם JWT cookie
});