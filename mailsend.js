const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// Habilitar CORS para el frontend específico
const corsOptions = {
    origin: 'https://www.servicesjmk.com',  // Cambia esto por la URL de tu frontend
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  };
  
  app.use(cors(corsOptions));
  
  app.use(express.json());
  
// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());

// Configuración de transporte de Nodemailer
const transporter = nodemailer.createTransport({
  secure: true,
  service: 'smtp',
  host:'smtp.hostinger.com',
  port: 465,
  auth: {
    user:'noreply@servicesjmk.com',
    pass:'NoReply-2025'
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Ruta para recibir la solicitud y enviar el correo
app.post("/enviar-correo", async (req, res) => {
  const { first_name, last_name, email, message } = req.body;

  const mailOptions = {
    from: "noreply@servicesjmk.com",
    to: "aeua2000@gmail.com",
    subject: `Nuevo mensaje de ${first_name} ${last_name}`,
    text: `Nombre: ${first_name} ${last_name}\nEmail: ${email}\nMensaje: ${message}`,
  };

  try {
    // Responder al cliente de inmediato (sin esperar la respuesta de Nodemailer)
    res.status(200).send({
      message: "Correo enviado exitosamente",
    });

    // Enviar el correo en segundo plano (asíncrono)
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Si ocurre un error, enviamos una respuesta indicando el fallo
    console.error("Error al enviar el correo:", error);
  }

  
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`https://servicesjmk-backend-production.up.railway.app/enviar-correo`);
});
