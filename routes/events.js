/*
    Rutas de eventos / Events
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();
router.use( validarJWT );


// Obtener eventos
router.get(
    '/',
    [
        
    ],
    getEventos
);

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos,
    ],
    crearEvento
);

// Actualizar evento
router.put(
    '/:id', 
    [
        
    ],
    actualizarEvento
);

// Eliminar evento
router.delete(
    '/:id', 
    [
        
    ],
    eliminarEvento
);

module.exports = router;