window.addEventListener("load", iniciar);

function iniciar() {
   agregarBurbujas();
}
function agregarBurbujas(){
    var cont=document.createElement("div");
    var burbuja;
    cont.classList="burbujas";
    for (let i = 0; i < 7; i++) {
        burbuja=document.createElement("div");
        burbuja.classList="burbuja";
        cont.appendChild(burbuja);
    }
    document.body.appendChild(cont);
 }