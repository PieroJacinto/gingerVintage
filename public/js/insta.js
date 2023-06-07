const feed = document.querySelector(".contenedor-galery");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

next.addEventListener("click", moveGalery);
prev.addEventListener("click",moveGalery);

function moveGalery(e){
    if (e.target.id == "next" || e.target.parentElement.id == "next") {
        feed.scrollLeft += feed.offsetWidth;
    } else {
        feed.scrollLeft -= feed.offsetWidth
    }
}