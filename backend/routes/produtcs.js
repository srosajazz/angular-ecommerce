const express = require('express');
const router = express.Router();

//return all products
router.get('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Return GET from Products',
    });
});


//insert products
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "POST in the Routes",
    });
});


//return data of one product
router.get('/:id_product', (req, res, next) => {
    const id = req.params.id_product

    if (id === 'special') {
        res.status(200).send({
            messagem: 'id special...',
            id: id,
        });
    } else {
        res.status(200).send({
            message: 'You pass a id....'
        });
    };
});

router.patch('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Return PATCH from Products',
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).send({
        messagem: 'Return DELETE from Products',
    });
})

module.exports = router;
