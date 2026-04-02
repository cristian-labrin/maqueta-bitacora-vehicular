$(function(){
    $("#btnInicioSesion").on("click",function(){
        directUrl('index.html');
    });
});

function directUrl(url) {
    window.location.href = url;
}