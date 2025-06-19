import express from "express";
import router from "./router";
import db from "./config/db";
import institucionRouter from "./routes/instituciones";
import carreraRouter from "./routes/carreras";
import sedeRouter from "./routes/sedes";
import sedeCarreraRouter from "./routes/sedeCarrera";

// Conexión con la base de datos
async function connectDB() {
  try {
    await db.authenticate();
    db.sync({ alter: true });
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.log("Error al conectar a la base de datos", error);
  }
}
connectDB();

const server = express();

server.use(express.json());
server.use("/api", router);
server.use("/api/instituciones", institucionRouter);
server.use("/api/carreras", carreraRouter);
server.use("/api/sede", sedeRouter);
server.use("/api/sede-carrera", sedeCarreraRouter);

export default server;
