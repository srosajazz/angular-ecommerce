const express = require('express');
const router = express.Router();

const mysql = require('../mysql').pool;

//return all products
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM products;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantity: result.length,
                    products: result.map(prod => {
                        return {
                            id_product: prod.id_product,
                            name: prod.name,
                            price: prod.price,
                            request: {
                                type: 'GET',
                                description: '',
                                url: 'http://localhost:3000/products/' + prod.id_product
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    });
});


//insert products
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).send({
        mensagem: 'Insert product',
        productCreated: product
    })
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO products (name,price) VALUES (?,?)',
            [req.body.name, req.body.price],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_product: result.insertId
                });
            }
        )
    });
});

//return data of one product
router.get('/:id_product', (req, res, next) => {
    const id = req.params.id_product

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'Você passou um ID'
        });
    }
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM products WHERE id_product = ?;',
            [req.params.id_product],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: result })
            }
        )
    });
});

router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto alterado'
    })
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE products
                    SET name        = ?,
                        price       = ?
                  WHERE id_product  = ?`,
            [
                req.body.name,
                req.body.price,
                req.body.id_product
            ],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'product alterado com sucesso'
                });
            }
        )
    });
});

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'product excluído'
    })
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM products WHERE id_product = ?`, [req.body.id_product],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Produto removido com sucesso'
                });
            }
        )
    });
});
module.exports = router;
