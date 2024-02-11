export const environment = {
  apiUrl: process.env["BASE_URL"] ? process.env["BASE_URL"] + "/api" : "http://localhost:3000/api",
  production: false,
};