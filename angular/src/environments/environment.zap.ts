export const environment = {
  apiUrl: process.env["BASE_URL"] ? process.env["BASE_URL"] + "/api" : "https://localhost:3000/api",
  production: true,
};