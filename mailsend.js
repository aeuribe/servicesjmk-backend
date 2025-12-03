const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 8080;

// --- Configuración de CORS ---
const corsOptions = {
  origin: [
    "https://www.servicesjmk.com",
    "https://www.jmkrobotics.com",
    "http://localhost:3000"
  ],
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// --- Transporters por dominio ---
const transporterServices = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply@servicesjmk.com",
    pass: process.env.MAIL_PASS, // variable de entorno
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true,
});

const transporterRobotics = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply@servicesjmk.com",
    pass: process.env.MAIL_PASS // variable de entorno
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true,
});

// --- Ruta Services JMK ---
app.post("/enviar-correo-services", async (req, res) => {
  const { full_name, email, message } = req.body;

  if (!full_name || !email || !message) {
    return res.status(400).send({ error: "Faltan campos obligatorios." });
  }

  const mailOptions = {
    from: `"Services JMK" <noreply@servicesjmk.com>`,
    to: ["juribe@servicesjmk.com", "kmendez@servicesjmk.com", "aeuribe@servicesjmk.com"],
    // to: "aeua2000@gmail.com",
    subject: `Solicitud de información de ${full_name} - Services JMK`,
    text: `Nombre: ${full_name}\nEmail: ${email}\nMensaje: ${message}`,
    replyTo: email,
  };

  try {
    await transporterServices.sendMail(mailOptions);
    res.status(200).send({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo (Services):", error);
    res.status(500).send({
      error: "Hubo un problema al enviar el correo (Services).",
      details: error.message,
    });
  }
});

// --- Ruta JMK Robotics ---
app.post("/enviar-correo-robotics", async (req, res) => {
  const { full_name, email, message } = req.body;

  if (!full_name || !email || !message) {
    return res.status(400).send({ error: "Faltan campos obligatorios." });
  }

  const mailOptions = {
    from: `"JMK Robotics" <noreply@servicesjmk.com>`,
    to: [ "juribe@servicesjmk.com", "kmendez@servicesjmk.com","aeuribe@servicesjmk.com"],
    // to: "aeua2000@gmail.com",
    subject: `Solicitud de información de ${full_name} - JMK Robotics`,
    text: `Nombre: ${full_name}\nEmail: ${email}\nMensaje: ${message}`,
    replyTo: email,
  };

  try {
    await transporterRobotics.sendMail(mailOptions);
    res.status(200).send({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo (Robotics):", error);
    res.status(500).send({
      error: "Hubo un problema al enviar el correo (Robotics).",
      details: error.message,
    });
  }
});

// --- Servidor ---
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
