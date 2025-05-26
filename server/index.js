const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {initCouch} = require('./config/db');
const recipeRoutes = require('./routes/recipes');

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.options('*', cors());
app.use(express.json());

// initialize CouchDB and attach db handles to req
initCouch()
    .then(dbs => {
        app.locals.usersDb = dbs.usersDb;
        app.locals.recipesDb = dbs.recipesDb;

        // routes
        app.use('/api/recipes', recipeRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to connect to CouchDB:', err);
        process.exit(1);
    });