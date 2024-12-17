import sqlite3 from 'sqlite3';
import fs from 'fs';
import bcrypt from 'bcrypt';

sqlite3.verbose();

//supprimer la db existante
fs.unlink('./DataBase/database.sqlite', (err) => {
    if (err) {
        console.error('Erreur lors de la suppression de la base de données :', err.message);
    } else {
        console.log('Base de données SQLite3 supprimée avec succès.');
    }
});

// Nom du fichier de configuration SQL
const configFilePath = 'databasesInit.txt';

// Créer ou ouvrir la base de données SQLite3
const db = new sqlite3.Database('./DataBase/database.sqlite', (err) => {
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
            hashAndStorePasswords();
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

function hashAndStorePasswords() {
    db.all('SELECT MotDePasse, Email FROM Users', (err, rows) => { //recupère les mots de passe dans la base de données et les mets dans rows pour qu'on puisse faire des opérations dessus
        if (err) {
            console.log("Erreur lors de la récupération des mots de passe : ", err.message);
        } else {
            console.log("Récupération des mots de passe réussie.");
        }

        rows.forEach((row) => {
            const hashedPassword = bcrypt.hashSync(row.MotDePasse, 10);

            db.run('UPDATE Users SET MotDePasse = ? WHERE Email = ?', [hashedPassword, row.Email], (err) => {
                if (err) {
                    console.log("Erreur lors de la récupération des mots de passe : ", err.message);
                }
            });
        });
    });
}
