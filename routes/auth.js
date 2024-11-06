/*
    Rutas de usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearUsuario, loginUsuario, revalidadToken } = require('../controllers/auth');
const router = express.Router();


router.post(
    '/new',
    [ // Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos,
    ],
    crearUsuario
);

router.post(
    '/',
    [ // Middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos,
    ],
    loginUsuario
);

router.get(
    '/renew',
    validarJWT,
    revalidadToken
);


module.exports = router;