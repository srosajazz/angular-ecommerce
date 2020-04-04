const express = require('express');
const router = express.Router();

//return all order
router.get('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Return GET from Orders',
    });
});


//insert order
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "POST in the Routes Orders",
    });
});


//return data of one order
router.get('/:id_order', (req, res, next) => {
    const id = req.params.id_order
    res.status(200).send({
        messagem: 'id special...',
        id_order: id,
    })
});


//Delete
router.delete('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Return DELETE from Order',
    });
});

module.exports = router;
