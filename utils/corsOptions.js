export const corsOptions = {
  origin: "*", //allows request from any website
  // origin: ["https://commercify-client.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
