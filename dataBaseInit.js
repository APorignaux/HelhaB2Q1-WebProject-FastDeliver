import sqlite3 from 'sqlite3';
sqlite3.verbose();
import fs from 'fs';

// Nom du fichier de configuration SQL
const configFilePath = 'dataBaseInitCP.txt';

// Créer ou ouvrir la base de données SQLite3
const db = new sqlite3.Database('./DataBase/database.db', (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
    } else {
        console.log('Base de données SQLite3 ouverte avec succès.');
    }
});

// Lire le fichier de configuration SQL
fs.readFile(configFilePath, 'utf-8', (err, sql) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier de configuration :', err.message);
        db.close();
        return;
    }

    // Exécuter les instructions SQL
    db.exec(sql, (err) => {
        if (err) {
            console.error('Erreur lors de l\'exécution des commandes SQL :', err.message);
        } else {
            console.log('Commandes SQL exécutées avec succès.');
        }

        // Fermer la base de données
        db.close((err) => {
            if (err) {
                console.error('Erreur lors de la fermeture de la base de données :', err.message);
            } else {
                console.log('Base de données SQLite3 fermée.');
            }
        });
    });
});
