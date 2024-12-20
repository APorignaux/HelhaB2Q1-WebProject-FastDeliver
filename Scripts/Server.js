import expressModule from 'express';
import sqlite3 from "sqlite3";
import bodyParser from 'body-parser';
import express from "express";

const port = 3010;
const app = expressModule();

app.use(express.json());
app.use(expressModule.static('Source'));
app.use(bodyParser.urlencoded({extended: true}));

let db = new sqlite3.Database('./DataBase/database.sqlite', sqlite3.OPEN_READWRITE, (err) => { //va lier la base de donnée au server
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

app.get('/Livraisons', (req, res) => {
    db.all('SELECT * FROM Livraisons', (err, rows) => {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else {
        res.json({ results: rows });
        }
    });
});

app.listen(port, () => {
  console.log('Server is running on port 3010');
});
/*
import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
import bcrypt from "bcrypt";
import { fileURLToPath } from 'url';

const port = 3000;
const app = express();

// Obtenir __dirname dans un projet ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

/// Middleware pour analyser les requêtes POST
const db = new sqlite3.Database("./fastdeliver.db");

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    console.log("Email ou mot de passe manquant");
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Fetch the user from the database
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'utilisateur:", err.message);
      return res.status(500).json({ error: `Internal server error` });
    }

    // Check if user exists
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    try {
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Authentication successful
        res.status(200).json({ message: "Login successful", user: { email: user.email, role: user.role } });
      } else {
        // Authentication failed
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Erreur lors de la comparaison des mots de passe:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running : http://localhost:${port}`);
});
*/
