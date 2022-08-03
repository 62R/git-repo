const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    fs.readFile('server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            res.send(data);
        }
    });
});

router.post('/', (req, res) => {
    fs.readFile('server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            const newCart = JSON.parse(data);
            newCart.list.push(req.body);
            newCart.totalQuantity++;
            newCart.totalPrice += req.body.price;
            fs.writeFile('server/db/userCart.json', JSON.stringify(newCart), (err) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                } else {
                    res.send(JSON.stringify({ result: 1 }))
                }
            });
        }
    });
});

router.put('/:id/:action', (req, res) => {
    fs.readFile('server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            const newCart = JSON.parse(data);
            let find = newCart.list.find(el => el.id_product == req.params.id);
            if (req.params.action == 'increase') {
                find.quantity++;
                newCart.totalQuantity++;
                newCart.totalPrice += find.price;
            }
            if (req.params.action == 'reduce') {
                find.quantity--;
                newCart.totalQuantity--;
                newCart.totalPrice -= find.price;
            }

            fs.writeFile('server/db/userCart.json', JSON.stringify(newCart), (err) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                } else {
                    res.send(JSON.stringify({ result: 1 }))
                }
            });
        }
    });
});

router.delete('/:id', (req, res) => {
    fs.readFile('server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            const newCart = JSON.parse(data);
            if (req.params.id === 'all') {
                newCart.list = [];
                newCart.totalQuantity = 0;
                newCart.totalPrice = 0;
            } else {
                let find = newCart.list.find(el => el.id_product == req.params.id);
                newCart.list.splice(newCart.list.indexOf(find), 1);
                newCart.totalQuantity -= find.quantity;
                newCart.totalPrice -= find.price * find.quantity;

            }
            fs.writeFile('server/db/userCart.json', JSON.stringify(newCart), (err) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                } else {
                    res.send(JSON.stringify({ result: 1 }))
                }
            });
        }
    });
})

module.exports = router;