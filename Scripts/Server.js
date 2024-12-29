import expressModule from 'express';
import sqlite3 from "sqlite3";
import bodyParser from 'body-parser';
import express from "express";
import bcrypt from "bcrypt";

const port = 3010;
const app = expressModule();

app.use(express.json());
app.use(expressModule.static('Source'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let db = new sqlite3.Database('./DataBase/database.sqlite', sqlite3.OPEN_READWRITE, (err) => { //va lier la base de donnée au server
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

app.get('/Livreur/:email', (req, res) => {
    const driverEmail = req.params.email;
    db.get('SELECT Nom FROM Users WHERE Email = ?', [driverEmail], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ result: row });
        }
    });
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

app.get('/Livraisons/:trackNum', (req, res) => {
    const trackNum = req.params.trackNum;
    db.get('SELECT * FROM Livraisons WHERE NumSuivis = ?', [trackNum], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ result: row });
        }
    });
});

app.post('/Client', (req, res) => {
    const { Nom, Email, Telephone, Addresse } = req.body;
    db.run('INSERT INTO Client VALUES (?,?,?,?)', [Nom, Email, Telephone, Addresse], function (err) {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else {
        res.json({ message: 'Client added successfully' });
        }
    });
});

app.post('/Livreur', (req, res) => {
    const { Nom, Email, Telephone, Addresse } = req.body;
    db.run('INSERT INTO Users VALUES (?,?,?,?)', [Nom, Email, Telephone, Addresse], function (err) {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else {
        res.json({ message: 'Driver added successfully' });
        }
    });
});

app.get('/Client', (req, res) => {
    db.all('SELECT * FROM Client', (err, rows) => {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else {
        res.json({ results: rows });
        }
    });
});

app.get('/Client/:email', (req, res) => {
    const clientEmail = req.params.email;
    db.get('SELECT * FROM Client WHERE Email = ?', [clientEmail],(err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ result: row });
        }
    });
});

app.delete('/Livraisons/:id', (req, res) => {
    const deliveryId = req.params.id;
    db.run('DELETE FROM Livraisons WHERE NumSuivis = ?', [deliveryId], function (err) {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else if (this.changes === 0) {
        res.status(404).json({ error: 'Delivery not found' });
        } else {
        res.json({ message: 'Delivery deleted successfully' });
        }
    });
});

app.post('/Livraisons', (req, res) => {
    const { NumSuivis, Date, ClientEmail, Addresse, Poids, Status, Livreur, Instructions } = req.body;
    db.run('INSERT INTO Livraisons (NumSuivis, Date, ClientEmail, Addresse, Poids, Status, Livreur, Instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [NumSuivis, Date, ClientEmail, Addresse, Poids, Status, Livreur, Instructions], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json({ message: 'Delivery added successfully' });
            }
        });
});

app.patch('/Livraisons/:id', (req, res) => {
   const deliveryId = req.params.id;
   db.run('UPDATE Livraisons SET Status = ? WHERE NumSuivis = ?', [req.body.Status, deliveryId], function (err) {
         if (err) {
         console.error(err.message);
         res.status(500).json({ error: 'Internal server error' });
         } else if (this.changes === 0) {
         res.status(404).json({ error: 'Delivery not found' });
         } else {
         res.json({ message: 'Delivery updated successfully' });
         }
   });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT Email,MotDePasse,Role FROM Users WHERE Email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Internal server error');
        } else if (!row) { /*pas d'utilisateur avec cet email*/
            res.status(401).send('Invalid email or password');
        } else {
            const passwordMatch = bcrypt.compareSync(password, row.MotDePasse);
            if (passwordMatch) {
                if (row.Role === 'Administrateur') {
                    // Authentication successful
                    res.json({ message: 'Access granted', redirect: '/admin.html' });
                } else if(row.Role === 'Livreur') {
                    res.json({ message: 'Access granted', redirect: '/driver-next.html?user=' + email });
                } else {
                    res.status(403).send('Access denied');
                }
            } else {
                res.status(401).send('Invalid email or password');
            }
        }
    });
});

app.listen(port, () => {
  console.log('Server is running on port 3010');
});
