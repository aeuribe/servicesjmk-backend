const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Habilitar CORS para el frontend específico
const corsOptions = {
    origin: "http://www.servicesjmk.com",  // Cambia esto por la URL de tu frontend
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
app.post("/enviar-correo", (req, res) => {
  const { first_name, last_name, email, message } = req.body;

  const mailOptions = {
    from: "noreply@servicesjmk.com",
    to: "aeua2000@gmail.com",
    subject: `Nuevo mensaje de ${first_name} ${last_name}`,
    text: `Nombre: ${first_name} ${last_name}\nEmail: ${email}\nMensaje: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // Si ocurre un error, se devuelve tanto el mensaje de error como la información del error
      return res.status(500).send({
        error: "Error al enviar el correo",
        details: error // Detalles completos del error
      });
    }
    // Si el correo se envió correctamente, se devuelve el mensaje de éxito junto con la información de la respuesta
    res.status(200).send({
      message: "Correo enviado exitosamente",
      info: info // Información sobre el envío del correo
    });
  });
  
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
