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
app.use(express.json());

// --- Transporters por dominio ---
const transporterServices = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply@servicesjmk.com",
    pass: process.env.MAIL_PASS, 
  },
  tls: { rejectUnauthorized: false },
});

const transporterRobotics = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "noreply@servicesjmk.com",
    pass: process.env.MAIL_PASS 
  },
  tls: { rejectUnauthorized: false },
});

// --- NUEVA FUNCIÓN: Validar Turnstile ---
async function verifyTurnstileToken(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY; //
  
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);

  try {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const response = await fetch(url, {
      body: formData,
      method: 'POST',
    });
    const data = await response.json();
    return data.success; // Retorna true si es humano, false si es bot o falla
  } catch (error) {
    console.error("Error al conectar con Cloudflare:", error);
    return false;
  }
}

// --- Ruta Services JMK ---
app.post("/enviar-correo-services", async (req, res) => {
  // Ahora también recibimos el "token" que enviará el frontend
  const { full_name, email, message, token } = req.body;

  if (!full_name || !email || !message || !token) {
    return res.status(400).send({ error: "Faltan campos obligatorios o el token de seguridad." });
  }

  // Validamos el token antes de hacer cualquier otra cosa
  const isHuman = await verifyTurnstileToken(token);
  if (!isHuman) {
    return res.status(403).send({ error: "Verificación de seguridad fallida. Por favor, intenta de nuevo." });
  }

  const mailOptions = {
    from: `"Services JMK" <noreply@servicesjmk.com>`,
    to: ["juribe@servicesjmk.com", "kmendez@servicesjmk.com", "aeuribe@servicesjmk.com"],
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
    });
  }
});

// --- Ruta JMK Robotics ---
app.post("/enviar-correo-robotics", async (req, res) => {
  const { full_name, email, message, token } = req.body;

  if (!full_name || !email || !message || !token) {
    return res.status(400).send({ error: "Faltan campos obligatorios o el token de seguridad." });
  }

  // Validamos el token
  const isHuman = await verifyTurnstileToken(token);
  if (!isHuman) {
    return res.status(403).send({ error: "Verificación de seguridad fallida. Por favor, intenta de nuevo." });
  }

  const mailOptions = {
    from: `"JMK Robotics" <noreply@servicesjmk.com>`,
    to: [ "juribe@servicesjmk.com", "kmendez@servicesjmk.com","aeuribe@servicesjmk.com"],
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
    });
  }
});

// --- Servidor ---
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});