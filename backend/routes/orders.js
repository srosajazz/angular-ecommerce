const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantity: result.length,
                    orders: result.map(order => {
                        return {
                            id_order: order.id_order,
                            id_product: order.id_product,
                            quantity: order.quantity,
                            request: {
                                type: 'GET',
                                description: 'Retorna os detalhes de um pedido específico',
                                url: 'http://localhost:3000/orders/' + order.id_order
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products WHERE id_product = ?',
            [req.body.id_product],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                // if (result.length == 0) {
                //     return res.status(404).send({
                //         mensagem: 'Produto não encontrado'
                //     })
                // }
                conn.query(
                    'INSERT INTO orders (id_product, quantity) VALUES (?,?)',
                    [req.body.id_product, req.body.quantity],
                    (error, result, field) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                            mensagem: 'Pedido inserido com sucesso',
                            orderCreated: {
                                id_order: result.id_order,
                                id_order: req.body.id_order,
                                quantity: req.body.quantity,
                                request: {
                                    type: 'GET',
                                    description: 'Retorna todos os pedidos',
                                    url: 'http://localhost:3000/orders'
                                }
                            }
                        }
                        return res.status(201).send(response);
                    }
                )

            })
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders WHERE id_order = ?;',
            [req.params.id_order],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado order com este ID'
                    })
                }
                const response = {
                    order: {
                        id_order: result[0].id_order,
                        id_product: result[0].id_product,
                        quantity: result[0].quantity,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os orders',
                            url: 'http://localhost:3000/orders'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});

// EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluído'
    })
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM orders WHERE id_order = ?`, [req.body.id_order],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'orders removido com sucesso',
                    request: {
                        type: 'POST',
                        description: 'Insere um orders',
                        url: 'http://localhost:3000/orders',
                        body: {
                            name: 'String',
                            price: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;