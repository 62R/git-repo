'use strict'

const express = require('express');
const fs = require('fs');
const app = express();
const cart = require('./cartRouter');


app.use(express.json());
app.use('/', express.static('public'));
app.use('/api/userCart', cart);


app.get('/api/products', (req, res) => {
    fs.readFile('server/db/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            res.send(data);
        }
    });
});


app.listen(4000);