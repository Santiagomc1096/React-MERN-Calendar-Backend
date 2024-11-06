const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {

    try {
        const eventos = await Evento.find()
                                .populate('user', 'name');

        res.status(200).json({
            ok: true,
            eventos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.',
        });
    }

};

const crearEvento = async( req, res = response ) => {

    const { uid } = req;

    const evento = new Evento( req.body );

    try {

        evento.user = uid;

        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok: true,
            msg: 'Crear evento',
            evento: eventoGuardado,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.',
        });
    }

};

const actualizarEvento = async( req, res = response ) => {

    const { uid } = req;

    const eventoID = req.params.id;

    try {

        const evento = await Evento.findById(eventoID);

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe con ese ID',
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento',
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid,
        };

        // asi como queda este, devuelve el elemento el cual se edito, como para comparar
        // const eventoActualizado = await Evento.findByIdAndUpdate( eventoID, nuevoEvento );  

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoID, nuevoEvento, { new: true });


        return res.status(200).json({
            ok: true,
            evento: eventoActualizado,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }

};

const eliminarEvento = async( req, res = response ) => {

    const { uid } = req;

    const eventoID = req.params.id;

    try {
        const evento = await Evento.findById(eventoID);

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe con ese ID',
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento',
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoID );


        return res.status(200).json({
            ok: true,
            msg: 'Eliminar evento',
            evento: eventoEliminado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }

};


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
};