function abrirPanel(){
    document.getElementById("sidepanel").classList.add("active");
    document.getElementById("overlay").classList.add("active");
}

function fecharPanel(){
    document.getElementById("sidepanel").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
}