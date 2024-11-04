require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const db = require("./database");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Rota para enviar e-mail e salvar dados no banco
app.post("/send-email", (req, res) => {
    const { name, email } = req.body;

    // Insere os dados no banco de dados
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(error) {
        if (error) {
            console.error("Erro ao salvar os dados no banco de dados:", error);
            return res.status(500).json({ message: "Erro ao salvar os dados." });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Obrigado por se inscrever no Localize!",
            text: `Olá ${name}, obrigado pelo seu interesse no Localize! Avisaremos assim que a plataforma estiver disponível.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erro ao enviar e-mail:", error);
                return res.status(500).json({ message: "Erro ao enviar o e-mail." });
            } else {
                console.log("E-mail enviado com sucesso:", info.response);
                res.status(200).json({ message: "E-mail enviado e dados salvos com sucesso!" });
            }
        });
    });
});

// Rota protegida para a página de administração
app.get("/admin", (req, res) => {
    const password = req.query.password;

    if (password === process.env.ADMIN_PASSWORD) {
        res.sendFile(path.join(__dirname, "public", "admin.html"));
    } else {
        res.status(401).send("Acesso não autorizado");
    }
});

// Rota para obter o número de interessados (usada na página de administração)
app.get("/get-interested-users", (req, res) => {
    db.get("SELECT COUNT(*) AS count FROM users", (error, row) => {
        if (error) {
            console.error("Erro ao consultar o banco de dados:", error);
            return res.status(500).json({ message: "Erro ao consultar o banco de dados." });
        }
        res.json({ interestedUsers: row.count });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
