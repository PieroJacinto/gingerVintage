// Primero capturamos los elementos del DOM
const restarInput = document.querySelector("#btn-restar");
const sumarInput = document.querySelector("#btn-sumar")
const msgContador = document.querySelector("#contador")

//INICIALIZAMOS EL CONTADOR EN 0
let contador = 1;

//ESCUCHAMOS LOS INPUTS Y LE APLICAMOS LAS FUNCIONES CORRESPONDIENTES
restarInput.addEventListener("click", restarUno);
sumarInput.addEventListener("click", sumarUno);

//CREAMOS LAS FUNCIONES SUMAR Y RESTAR
function sumarUno() {
    contador = contador + 1;
    msgContador.value = contador;
}
function restarUno() {
    //CREAMOS CONDICION PARA QUE EL CONTADOR NO SEA UN NUMERO NEGATIVO
    if (contador > 1) {
        contador = contador -1;
        msgContador.value = contador;        
    } else {
        msgContador.value = 1;
    }
}


