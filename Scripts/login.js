import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import express from 'express';

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./DataBase/database.sqlite', (err) => {   /**/
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM Users WHERE Email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Internal server error');
        } else if (!row) {
            res.status(401).send('Invalid email or password');
        } else {
            const passwordMatch = bcrypt.compareSync(password, row.MotDePasse);
            if (passwordMatch) {
                res.send('Access granted');
            } else {
                res.status(401).send('Invalid email or password');
            }
        }
    });
});

app.listen(3001, () => {
    console.log('Server is listening on port 3001');
});