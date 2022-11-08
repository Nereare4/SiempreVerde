// VARIABLES
let usuario;
var busqueda = false;
var filtraCategoria = false;
var esInterior = true;
let isRegistrarseAbierto = false;
let crearBurbujas = true;

window.addEventListener("load", iniciar);

function iniciar() {
   obtenerListaUsuarios();
   escribirNombreUsuarioActual();
   cargar();
   notificacion();
   checkCookie();
   document.getElementById("usuario").addEventListener("click", apareceDesaparece);
   document.getElementById("inicio").addEventListener("click", acceder);
   document.getElementById("registro").addEventListener("click", cambiar);
   document.getElementById("cerrar").addEventListener("click", cerrarVentanaLogin);
   document.getElementById("cerrarSesion").addEventListener("click", cerrarSesion);
   document.getElementById("buscar").addEventListener("click", buscarProducto);
   document.getElementById("microfono").addEventListener("click", ejecutarSpeechAPI);
   document.getElementById("interior").addEventListener("click", interior);
   document.getElementById("exterior").addEventListener("click", exterior);
   document.getElementById("logo").addEventListener("click", reiniciar);
   document.getElementById("barraProducto").addEventListener("input", buscarProducto)
}

// OBTENER LISTA DE USUARIOS
function obtenerListaUsuarios() {
   usuario = [
      ["admin", "admin"],
      ["Paco", "paco"],
      ["Susana", "profe"]
   ];
   if (localStorage.getItem("nuevousuario") != null) {
      let usuariosNuevos = localStorage.getItem("nuevousuario").split("/");
      usuariosNuevos.forEach(element => {
         usuario.push(element.split(","));
      });
   }
}

//AÑADE Y QUITA D-NONE PARA QUE APAREZCA Y DESAPAREZCA EL LOGIN
function apareceDesaparece() {
   var login = document.getElementById("login");
   var fondologin = document.getElementById("fondologin");
   if (login.className == "d-none") {
      login.classList.remove("d-none");
   } else {
      login.classList.add("d-none");
   }
   if (fondologin.className == "d-none") {
      fondologin.classList.remove("d-none");
   } else {
      fondologin.classList.add("d-none");
   }

}

// LEER JSON
async function cargar() {
   try {
      let respuesta = await fetch("Json/Productos.json");
      let datos = await respuesta.json();
      recorrerJson(datos);
   } catch (error) {
      console.log(error);
   }
}

//RECORRER JSON
function recorrerJson(datos) {
   var producto = document.getElementById("barraProducto").value;
   document.getElementById("productos").innerHTML = ``;
   var encontrado = false;
   for (let i = 0; i < datos.length; i++) {
      if (busqueda) {
         if (producto.toUpperCase() == datos[i].nombre.toUpperCase()) {
            encontrado = true;
            crearCards(i, datos);
         }
      } else if (filtraCategoria) {
         if (datos[i].interior == true && esInterior) {
            crearCards(i, datos);
         } else if (datos[i].interior == false && !esInterior) {
            crearCards(i, datos);
         }
      } else {
         crearCards(i, datos);
      }
   }
   if (busqueda && !encontrado) {
      var noEncontrado = "";
      noEncontrado += `<div class="p-3 mb-2 w-100 bg-danger text-white d-flex justify-content-center h3">
      <p>Producto no encontrado</p>
      </div>`
      document.getElementById("productos").innerHTML += noEncontrado;

   }
   return busqueda;
}

//BUSCAR PRODUCTO
function buscarProducto() {
   busqueda = true;
   cargar();
   document.getElementById("carrusel").classList.add("d-none");
   return busqueda;
}

//FILTRAR PLANTAS INTERIOR
function interior() {
   document.getElementById("carrusel").classList.add("d-none");
   filtraCategoria = true;
   esInterior = true;
   cargar();
}

//FILTRAR PLANTAS EXTERIOR
function exterior() {
   document.getElementById("carrusel").classList.add("d-none");
   filtraCategoria = true;
   esInterior = false;
   cargar();
}

//REINICIA LA PÁGINA
function reiniciar() {
   document.getElementById("carrusel").classList.remove("d-none");
   busqueda = false;
   filtraCategoria = false;
   cargar();
}

//CREACIÓN AUTOMÁTICA CARDS
function crearCards(i, datos) {
   var card = "";
   card += `
      <div class="card m-2" style="width: 16rem;">
         <img class="card-img-top w-100 h-100" src="${datos[i].imagen}" alt="Card image cap">
         <div class="card-body">
            <h5 class="card-title">${datos[i].nombre}</h5>
            <p class="card-text">${datos[i].precio}€</p>
            <button id="botonAnyadirProducto" onclick="anyadirProducto(${datos[i].id})" class="btn btn-primary fa fa-plus"></button>
         </div>
      </div>`
   document.getElementById("productos").innerHTML += card;
}

//CAMBIAR BOTON
function acceder() {
   if (isRegistrarseAbierto) {
      registro();
   } else {
      iniciarSesion();
   }
}

//INICIAR SESION
function iniciarSesion() {
   isRegistrarseAbierto = false;
   var user = document.getElementById("floatingInput").value;
   var cont = document.getElementById("floatingPassword").value;
   for (let i = 0; i < usuario.length; i++) {
      if (user == usuario[i][0] && cont == usuario[i][1]) {
         localStorage.setItem("usuarioActual", user);
         escribirNombreUsuarioActual();
         document.getElementById("login").classList.add("d-none");
         document.getElementById("fondologin").classList.add("d-none");

      } else {
         document.getElementById("error").innerHTML = "Usuario o Contraseña erróneo";
      }
   }
}

//CAMBIAR NOMBRES
function cambiar() {
   isRegistrarseAbierto = !isRegistrarseAbierto;
   if (isRegistrarseAbierto) {
      document.getElementById("titulo").innerHTML = "Registrarse";
      document.getElementById("inicio").innerHTML = "Registrarse";
      document.getElementById("registro").innerHTML = "Iniciar Sesión";
      document.getElementById("pregunta").innerHTML = "¿Ya tienes cuenta?";
   } else {
      document.getElementById("titulo").innerHTML = "Iniciar Sesión";
      document.getElementById("inicio").innerHTML = "Iniciar Sesión";
      document.getElementById("registro").innerHTML = "Registrarse";
      document.getElementById("pregunta").innerHTML = "¿No tienes cuenta?";
   }
}

//AÑADIR USUARIO
function registro() {
   var validacion = /(^[A-Z][a-z]+)\s?([A-Z][a-z]+)?/gm;
   var user = document.getElementById("floatingInput").value;
   var cont = document.getElementById("floatingPassword").value;
   var existe = false;
   let nuevo;
   if (validacion.test(user)==true) {
      if (localStorage.getItem("nuevousuario") == null) {
         nuevo = [user, cont] + "/";
      } else {
         nuevo = localStorage.getItem("nuevousuario") + [user, cont] + "/";
      }
      for (let i = 0; i < usuario.length; i++) {
         if (usuario[i][0].indexOf(user) < 0) {
            usuario.push(nuevo);
            existe = false;
            localStorage.setItem("nuevousuario", nuevo);
            localStorage.setItem("usuarioActual", user);
            obtenerListaUsuarios();
            escribirNombreUsuarioActual();
            break;
         } else {
            alert("Usuario ya existe");
            existe = true;
            break;
         }

      }
   } else {
      alert("El usuario no puede tener números");
   }

   document.getElementById("login").classList.add("d-none");
   document.getElementById("fondologin").classList.add("d-none");
   return existe;
}

//CERRAR SESIÓN 
function cerrarSesion() {
   localStorage.removeItem("usuarioActual");
   escribirNombreUsuarioActual();
}

//CERRAR VENTANA LOGIN
function cerrarVentanaLogin() {
   document.getElementById("login").classList.add("d-none");
   document.getElementById("fondologin").classList.add("d-none");
}

//ESCRIBIR NOMBRE DEL USUARIO
function escribirNombreUsuarioActual() {
   if (localStorage.getItem("usuarioActual") != null) {
      document.getElementById("usuario").innerHTML = localStorage.getItem("usuarioActual");
   } else {
      document.getElementById("usuario").innerHTML = "";

   }
}

//BOTÓN SPEECH
function ejecutarSpeechAPI() {
   var barraProducto = document.getElementById("barraProducto");
   //crear el objeto Speech Recognition
   const SpeechRecognition = window.webkitSpeechRecognition;
   const recognition = new SpeechRecognition();

   // comienza el reconocimiento
   recognition.start();

   // Detecta cuando empieza a hablar(start) y muestra Escuchando...
   recognition.onstart = function () {
      barraProducto.value = "Escuchando...";
   };
   // Detecta cuando deja de hablar (speechend) y para el reconocimiento(stop())  
   recognition.onspeechend = function () {
      recognition.stop();
   };

   //Se ejecuta cuando obtiene los resultados del reconocimiento
   recognition.onresult = function (e) {
      var transcript = e.results[0][0].transcript;
      barraProducto.value = transcript;
   };
}

// AÑADE PRODUCTO AL CARRITO
function anyadirProducto(id) {
   if (localStorage.getItem("usuarioActual") != null) {
      if (localStorage.getItem("listaProductos") == null) {
         localStorage.setItem("listaProductos", id);
      } else {
         localStorage.setItem("listaProductos", localStorage.getItem("listaProductos") + "," + id);
      }
   } else {
      apareceDesaparece();
      iniciarSesion();
      Notification.requestPermission()
         .then(resultado => {
            console.log('El resultado es ', resultado)
         })

      var texto = "Para añadir un producto al carrito debe registrarse";

      if (Notification.permission == 'granted') {
         const notificacion = new Notification('¡ATENCIÓN!', {
            body: texto,
         });
      }
   }

}

// NOTIFICACIONES
function notificacion() {
   Notification.requestPermission()
      .then(resultado => {
         console.log('El resultado es ', resultado)
      })

   var texto = "Como se acerca la primavera...\nLe hacemos un 30%n de descuento en las plantas de interior y un 10% en las de exterior";

   if (Notification.permission == 'granted') {
      const notificacion = new Notification('¡OFERTA!', {
         body: texto,
      });
   }
}

// CREA LA COOKIE
function setCookie(cname,cvalue,exdays) {
   const d = new Date();
   d.setTime(d.getTime() + (exdays*24*60*60*1000));
   let expires = "expires=" + d.toUTCString();
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// COGE LA COOKIE
function getCookie(cname) {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(';');
   for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}

//COMPRUEBA LA COOKIE
function checkCookie() {
   let user = getCookie("username");
   if (user) {
      document.getElementById("cookie").style.display = "none";
   } else {
      user = localStorage.getItem("usuarioActual");
      if (user && user != undefined) {
         setCookie("username", user);
      }
      document.getElementById("cookie").style.display = "block";

   }
}