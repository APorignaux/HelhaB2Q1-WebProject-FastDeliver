import expressModule from 'express';
import sqlite3 from "sqlite3";
import bodyParser from 'body-parser';
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const port = 3010;
const app = expressModule();

app.use(express.json());
app.use(expressModule.static('Source'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//----------------------------Connexion To Database--------------------------------

let db = new sqlite3.Database('./DataBase/database.sqlite', sqlite3.OPEN_READWRITE, (err) => { //va lier la base de donnée au server
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

//----------------------------Livraison--------------------------------

app.get('/Livraisons', authenticateToken, (req, res) => {
    db.all('SELECT * FROM Livraisons', (err, rows) => {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else {
        res.json({ results: rows });
        }
    });
});

app.get('/Livraisons/:trackNum', authenticateToken, (req, res) => {
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

app.delete('/Livraisons/:id', authenticateToken, (req, res) => {
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

app.post('/Livraisons', authenticateToken, (req, res) => {
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

app.patch('/Livraisons/:id', authenticateToken, (req, res) => {
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

//----------------------------Client--------------------------------

app.post('/Client', authenticateToken, (req, res) => {
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

app.get('/Client', authenticateToken, (req, res) => {
    db.all('SELECT * FROM Client', (err, rows) => {
        if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
        } else {
        res.json({ results: rows });
        }
    });
});

app.get('/Client/:email', authenticateToken, (req, res) => {
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

app.patch('/Client/:email', authenticateToken, (req, res) => {
    const clientEmail = req.params.email;
    db.run('UPDATE Client SET Nom = ?, Telephone = ?, Addresse = ? WHERE Email = ?', [req.body.Nom, req.body.Telephone, req.body.Addresse, clientEmail], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Client not found' });
        } else {
            res.json({ message: 'Client updated successfully' });
        }
    });
});

//----------------------------Livreur--------------------------------

app.post('/Livreur', authenticateToken, (req, res) => {
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

app.get('/Livreur/:email', authenticateToken, (req, res) => {
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

//----------------------------Authentication--------------------------------

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT Email,MotDePasse,Role FROM Users WHERE Email = ?', [email], async (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Internal server error');
        } else if (!row) { /*pas d'utilisateur avec cet email*/
            res.status(401).send('Invalid email or password');
        } else {
            const passwordMatch = await bcrypt.compare(password, row.MotDePasse);
            if (passwordMatch) {
                //JWT creation
                const token = jwt.sign({ login: row.Email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" }); //JWT_ACCESS_SECRET is a secret key to create JWT
                const refreshToken = signRefreshToken(row.Email);
                if (row.Role === 'Administrateur') {
                    // Authentication successful
                    res.json({ message: 'Access granted', redirect: '/admin.html' , access_token: token, refresh_Token : refreshToken, email: email });
                } else if(row.Role === 'Livreur') {
                    res.json({ message: 'Access granted', redirect: '/driver-next.html?user=' + email, access_token: token, refresh_Token : refreshToken, email: email });
                } else {
                    res.status(403).send('Access denied');
                }
            } else {
                res.status(401).send('Invalid email or password');
            }
        }
    });
});

app.post('/refresh', (req, res) => {

});

function authenticateToken(req, res, next) { //this function is middleware
    const tokenHeader = req.headers['authorization'];
    //verify that tokenHeader exist if true store token else store undefined
    const token = tokenHeader.split(' ')[1]; //split the tokenHeader and store the second part
    if (token == null) return res.sendStatus(401);//401 mean no token

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: 'Invalid or expired token' });
        if (!user) return res.status(403).json({ error: 'Unauthorized access' });

        if (user.login === req.headers.email) {
            req.user = user;
            next();
        }
    });
}

function signRefreshToken(email) {
    return jwt.sign({ email: email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

//----------------------------SuiviLivraison--------------------------------

app.get('/SuiviLivraison/:trackNum', (req, res) => {
    const trackingNumber = req.params.trackNum;
    db.all('SELECT * FROM SuiviLivraison WHERE NumSuivis = ?', [trackingNumber], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ results: rows });
        }
    });
});

app.patch('/SuiviLivraison/:trackNum', (req, res) => {
    const trackingNumber = req.params.trackNum;
    db.run('UPDATE SuiviLivraison SET Date = ?, Heure = ?, Status = ? WHERE NumSuivis= ?;', [req.body.Date, req.body.Heure, req.body.Status, trackingNumber], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Tracking updated successfully' });
        }
    });

});

app.listen(port, () => {
  console.log('Server is running on port 3010');
});
