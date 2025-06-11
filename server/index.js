const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initCouch } = require('./config/db');

dotenv.config();
const app = express();

const allowedOrigins = [
    'http://localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
}));

app.use(express.json());

initCouch()
    .then(dbs => {
        app.locals.usersDb   = dbs.usersDb;
        app.locals.recipesDb = dbs.recipesDb;

        app.use('/api/recipes', require('./routes/recipes'));

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to CouchDB:', err);
        process.exit(1);
    });
