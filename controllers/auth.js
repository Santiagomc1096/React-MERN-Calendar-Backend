const { response } = require('express'); // para obtener toda la ayuda del intellisense
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {
    
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo',
            })
        }
        
        usuario = new Usuario( req.body );

        // Encriptar contrase;a
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
};

const loginUsuario = async( req, res = response ) => {
    
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese correo',
            })
        }

        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
            msg: 'Contraseña incorrecta.',
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
};

const revalidadToken = async( req, res = response ) => {

    const { uid, name } = req;

    // Generar el JWT
    const token = await generarJWT( uid, name );
    
    res.json({
        ok: true,
        uid,
        name,
        token,
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidadToken,
};


    // Se instalo express-validator para eliminar la comprobacion en cada
    // una de las funciones.
    // if( name.length < 5 ){
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe de ser de al menos 5 letras', 
    //     });
    // }