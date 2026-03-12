import "../nombre/bannerNombre.css";

function BannerNombre(){
    const nombre=sessionStorage.getItem("nombre");
    return (
        <div className="banner_div_nombre">
            <h5 className="banner_nombre">{nombre}</h5>
            <a href="/">Salir</a>
        </div>
    );
}

export {BannerNombre}