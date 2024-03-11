const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage'); //Agregado para FireBase

module.exports = {
    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar el usuario',
                    error: err
                });
            }

            if (!myUser) { //Cliente sin autorización para realizar  la petición
                return res.status(401).json({
                    success: false,
                    message: 'El email no existe en la base de datos'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    email: myUser.email,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    image: myUser.image,
                    phone: myUser.phone,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles)
                }
                return res.status(201).json({
                    success: true,
                    message: 'Usuario autenticado ',
                    data: data
                });

            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña o correo incorrecto'
                });
            }

        });
    },

    register(req, res) {
        const user = req.body;
        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear el usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Usuario creado: ',
                data: data //Id del nuevo usuario
            });
        });
    },

    //Agregado para FireBase
    async registerWithImage(req, res) {
        const user = JSON.parse(req.body.user);
        const files = req.files;
        if(files.length > 0){
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path); 
            
            if(url != undefined && url != null){
                user.image = url;
            }
        }

        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear el usuario',
                    error: err
                });
            }

            user.id = `${data.id}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            //Crea registro en la tabla user_has_roles:
            Rol.create(user.id, 3, (err, data) => {     //3: Rol de cliente
                console.log('usuario creado: ', user.id, ' rol creado: ', data);
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Error al asignar el rol al usuario',
                        error: err
                    });
                }
            });

            return res.status(201).json({
                success: true,
                message: 'Usuario creado ',
                data: user
            });
        });
    },


    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user);
        const files = req.files;
        if(files.length > 0){
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path); 
            
            if(url != undefined && url != null){
                user.image = url;
            }
        }

        User.update(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Usuario actualizado ',
                data: user
            });
        });
    },

    async updateWithoutImage(req, res) {
        const user = req.body;
        const files = req.files;

        User.updateWithoutImage(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Usuario actualizado ',
                data: user
            });
        });
    },

}
