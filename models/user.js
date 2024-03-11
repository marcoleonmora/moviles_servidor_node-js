const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.findById = (id, result) => {
    const sql = `SELECT 
        U.id, 
        U.email, 
        U.name, 
        U.lastname,
        U.phone,
        U.image,
        U.password,
        JSON_ARRAYAGG(
            JSON_OBJECT(
            'id', CONVERT(R.id, CHAR),
            'name', R.name,
            'image', R.image,
            'route', R.route
            )
        ) AS roles
        FROM users AS U
        INNER JOIN user_has_roles AS UHR 
            ON UHR.id_user = U.id
        INNER JOIN roles AS R 
            ON UHR.id_rol = r.id
        WHERE
            U.id =  ?
        GROUP BY U.id`;

    db.query(sql,
        [id], (err, user) => {
            if (err) {
                console.log('Error al consultar: ', err);
                result(err, null);
            }
            else {
                console.log('Usuario consultado: ', user[0]);
                result(null, user[0]);
            }
        }
    );
}

User.findByEmail = (email, result) => {
    const sql = `SELECT 
        U.id, 
        U.email, 
        U.name, 
        U.lastname,
        U.phone,
        U.image,
        U.password,
        JSON_ARRAYAGG(
            JSON_OBJECT(
            'id', CONVERT(R.id, CHAR),
            'name', R.name,
            'image', R.image,
            'route', R.route
            )
        ) AS roles
        FROM users AS U
        INNER JOIN user_has_roles AS UHR 
            ON UHR.id_user = U.id
        INNER JOIN roles AS R 
            ON UHR.id_rol = r.id
        WHERE
            email =  ?
        GROUP BY U.id`;

    db.query(
        sql,
        [email],
        (err, user) => {
            if (err) {
                console.log('Error al consultar: ', err);
                result(err, null);
            }
            else {
                console.log('Usuario consultado: ', user[0]);
                result(null, user[0]);

            }
        }
    );
}


User.create = async (user, result) => {
    const hash = await bcrypt.hash(user.password, 10);
    const sql =
        `INSERT INTO users (
        email, 
        name, 
        lastname,
        phone,
        image, 
        password,
        created_at,
        updated_at
        ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date()
        ], (err, res) => {
            if (err) {
                console.log('Error al crear el usuario: ', err);
                result(err, null);
            }
            else {
                console.log('Usuario creado: ', { id: res.insertId, ...user });
                result(null, { id: res.insertId, ...user });

            }
        }
    );
}

User.update = async (user, result) => {

    const sql = `UPDATE users 
    SET
        name = ?, 
        lastname = ?,
        phone = ?,
        image = ?, 
        updated_at = ?
    WHERE id = ?`;

    db.query(sql,
        [
            user.name,
            user.lastname,
            user.phone,
            user.image,
            new Date(),
            user.id
        ], (err, res) => {
            if (err) {
                console.log('Error al actulizar el usuario: ', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado: ', user.id);
                result(null, user.id);

            }
        }
    );
}

User.updateWithoutImage = async (user, result) => {

    const sql = `UPDATE users 
    SET
        name = ?, 
        lastname = ?,
        phone = ?,
        updated_at = ?
    WHERE id = ?`;

    db.query(sql,
        [
            user.name,
            user.lastname,
            user.phone,
            new Date(),
            user.id
        ], (err, res) => {
            if (err) {
                console.log('Error al actulizar el usuario: ', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado: ', user.id);
                result(null, user.id);

            }
        }
    );
}

module.exports = User;