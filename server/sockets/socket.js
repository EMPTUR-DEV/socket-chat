const { io } = require('../server');
const { Usuarios } = require('../classes/usuario')

const { crearMensaje } = require('../utils/utiles.js')

const usuarios = new Usuarios();

io.on('connection', (client) => {



    client.on('chatEnter', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        client.join(usuario.sala)

        usuarios.addPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} ha entrado a la sala ${usuario.sala}.`));
        client.broadcast.to(usuario.sala).emit('crearMensaje', usuarios.getPersonasPorSala(usuario.sala));

        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('crearMensaje', (data) => {


        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.deletePersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `Persona ${personaBorrada.nombre} abandonó la sala`))
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    //Mensajes privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))

    })





});