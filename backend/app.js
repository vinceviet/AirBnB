const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = express();
const routes = require('./routes');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(csurf({ cookie: { secure: isProduction, sameSite: isProduction && "Lax", httpOnly: true } }));

app.use(routes);

// Error Handlers
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

// Process sequelize errors
const { ValidationError } = require('sequelize');
app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        // title: err.title || 'Server Error',
        message: err.message,
        statusCode: err.status || 500,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'API is running' })
});

module.exports = app;


// Build/deploy to roll sequelize files and re-execute
// npm install && npm run build && npm run sequelize --prefix backend db:seed:undo:all && npm run sequelize --prefix backend db:migrate:undo:all && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all

// Build/deploy after updating DB
// npm install && npm run build && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all
