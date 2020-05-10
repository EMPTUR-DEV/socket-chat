var params = new URLSearchParams(window.location.search);


// referencias de jQuery

var usuario = params.get('nombre');
var sala = params.get('sala');

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');


// Funciones para renderizar usuarios

function renderUsers(personas) {


    var html = '';

    html += '<li> <a data-id="' + params.get('sala') + '" href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a> </li>'


    for (var i = 0; i < personas.length; i++) {
        html += '<li><a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ' + personas[i].nombre + ' <small class="text-success">online</small></span></a></li>'
    }

    divUsuarios.html(html)

}

function getAM(fecha) {
    if (fecha.getUTCHours() - 3 < 12) {
        return 'AM'
    } else {
        return 'PM'
    }
}



function renderMensaje(mensaje) {

    var adminClass = 'info';

    var html = ''
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes() + ':' + getAM(fecha);
    console.log('Mensaje', mensaje.nombre, usuario.nombre);
    if (mensaje.nombre === usuario.nombre) {
        html += '<li class="reverse animated fadeIn">'
        html += '<div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div></div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>'

    } else {

        html += '<li class= "animated fadeIn">';
        if (mensaje.nombre === 'Administrador') {
            adminClass = 'danger'
        } else {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatBox.append(html);

}

// Listener

divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    //Enviar información
    socket.emit('crearMensaje', {
        nombre: usuario,
        mensaje: txtMensaje.val(),
        sala: sala

    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderMensaje(mensaje);
        scrollBottom();
    });

});



function scrollBottom() {

    // selectors

    var newMessage = divChatBox.children('li:last-child');

    // heights

    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}