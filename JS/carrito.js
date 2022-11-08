window.addEventListener("load", iniciar);

function iniciar() {
    document.getElementById("usuario").innerHTML = localStorage.getItem("usuarioActual");
    fetchDatos();

}
//LEER JSON
async function fetchDatos() {
    try {
        let respuesta = await fetch("../Json/Productos.json");
        let datos = await respuesta.json();
        Productos(datos);
    } catch (error) {
        console.log(error);
    }
}
var listaProductos = localStorage.getItem("listaProductos").split(",");
//POR CADA PRODUCTO GUARDADO: QUITA REPETIDOS, CUENTA CUÁNTOS REPETIDOS HAY
function Productos(datos) {
    var numRepetidos = 0;
    var i = 0;
    listaProductos.sort(); //ORDENA ARRAY
    const sinRepetidos = [...new Set(listaProductos)] //QUITA LOS REPETIDOS

    sinRepetidos.forEach(e => {
        while (listaProductos[i] == e) {
            i++;
            numRepetidos++;
        }
        obtenerDatos(datos, e, numRepetidos);
        numRepetidos = 0;
    });

}
var total = 0;
var sumaNumRepetidos = 0;
//CREA LA TABLA CON LOS VALORES DE LA COMPRA
function obtenerDatos(datos, e, numRepetidos) {

    datos.forEach(element => {
        if (element.id == e) {
            var valorTotalProducto = (numRepetidos * parseInt(element.precio));
            total = valorTotalProducto + total;
            sumaNumRepetidos = sumaNumRepetidos + numRepetidos;
            let tr = document.createElement('tr');
            let id = document.createElement('td');
            id.innerHTML = element.id;
            let nombre = document.createElement('td');
            nombre.innerHTML = element.nombre;
            let cantidad = document.createElement('td');
            cantidad.innerHTML = numRepetidos;
            let botones = document.createElement('td');
            botones.innerHTML = `<button class="btn btn-primary fa fa-plus"></button>
                                <button class="btn btn-danger fa fa-minus"></button>`;
            let totalProducto = document.createElement('td');
            totalProducto.innerHTML = valorTotalProducto + "€";

            tr.appendChild(id);
            tr.appendChild(nombre);
            tr.appendChild(cantidad);
            tr.appendChild(botones);
            tr.appendChild(totalProducto);

            document.getElementById("lista").appendChild(tr);

        }
    });
    document.getElementById("total").innerHTML = total + "€";
    document.getElementById("cantidad").innerHTML = sumaNumRepetidos;
}

//VACIA CARRITO
function vaciarCarrito() {

    localStorage.clear();
    document.getElementById("lista").innerHTML = "";
    document.getElementById("total").innerHTML = "0€";
    document.getElementById("cantidad").innerHTML = "0";
    document.getElementById('audio2').play();

}
//AUDIO
function compra() {
    document.getElementById('audio').play();
}