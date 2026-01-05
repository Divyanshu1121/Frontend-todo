import React from 'react';

const LoadingSpinner = ({ size = 'medium', centered = false }) => {
    const sizeClass = size === 'large' ? 'large' : '';

    if (centered) {
        return (
            <div className="loading-container">
                <div className={`loading-spinner ${sizeClass}`}></div>
            </div>
        );
    }

    return <div className={`loading-spinner ${sizeClass}`}></div>;
};

export default LoadingSpinner;



const port = 2021;
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();