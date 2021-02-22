var serviceURL = 'localhost:8080';
var socket = io.connect(serviceURL);
var sesionIniciada = true;
/* inicializa a true */

function obtenerDatosRegistro(){
    var nick = document.getElementById("nick").value;
    var password = document.getElementById("pass").value;

    socket.emit('registro',{nick:nick, password:password});
    socket.on('valido',function(data){
        var usuarioValido=data.usuarioValido;
        var passwordValida=data.passwordValida;
        if(usuarioValido === false){
            alert("El nombre de usuario ya está en uso, elige otro");
        }else{
            if(passwordValida === false){
                alert("La contraseña no es válida, elige otra");
            }else{
                document.location.href = "/index.html";
            }
        }
    });
}

function mostrarContraseña() {
    var x = document.getElementById("pass");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
} 

function iniciarSesion(){
    var nick = document.getElementById("nickEmail").value;
    var password = document.getElementById("pass").value;

    socket.emit('inicioSesion',{nick:nick, password:password});
    socket.on('inicioCorrecto', function(data){
        var usuarioValido=data.usuarioValido;
        var passwordValida=data.passwordValida;
        if(usuarioValido === false){
            alert("El nombre de usuario no existe, registrese");
            sesionIniciada = false;
        }else{
            if(passwordValida === false){
                alert("La contraseña no es correcta, pruebe otra vez");
            }else{
                document.location.href = "/index.html";
            }
            sesionIniciada = false;
        }
    });
}

function crearProyecto(){
    console.log(sesionIniciada);

    if(sesionIniciada){
        console.log("si ha iniciado sesion");
        var nombre = document.getElementById("nombre").value;
        var descripcion = document.getElementById("descripcion").value;

        socket.emit('crearProyecto',{nombre:nombre, descripcion:descripcion});
        socket.on('proyectoValido',function(data){
            var valido=data.valido;
            console.log(valido);
            if(valido){
                alert("Proyecto creado correctamente");
            }else{
                alert("El nombre de proyecto ya está en uso, elige otro");
            }
        });
    }
    else{
        alert("No ha iniciado sesion, inicie antes de crear un proyecto")
    }
}

function paginaIniciarSesion(){
    document.location.href = "/inicioSesion.html";
}

function cambiarModoProyecto(){
    document.location.href = "/modoProyecto.html";
}

socket.on('actualizarProyectos',function (datos){
    var listElement = document.getElementById('list');
    var listItem = document.createElement('li');
    listItem.innerHTML = "Nombre: "+datos.nombre+" Descripcion: "+datos.descripcion;
    listElement.appendChild(listItem);
});
function paginaRegistro(){
    document.location.href = "/registro.html";
}
