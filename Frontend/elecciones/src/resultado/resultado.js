import { Table } from "antd";
import { useEffect, useState } from "react";
import "../resultado/resultado.css"

function Resultado() {
    const [datosAPI, setDatosApi] = useState([]);
    const BASE_URL = "http://127.0.0.1:8000";
    useEffect(() => {
        const fetchResultados = async () => {
            try {
                const votosResultado = await fetch(`${BASE_URL}/votos`);
                const datos = await votosResultado.json();

                // 3. Guardamos los datos en el estado
                setDatosApi(datos);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchResultados();
    }, []);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre_candidato',
        },
        {
            title: 'Número de tarjeton',
            dataIndex: 'id_candidato',
        },
        {
            title: 'Votos Totales',
            dataIndex: 'total_votos_candidato',
        },
    ];
    return (
        <div className="contenedorTabla">
            <Table className="tabla" dataSource={datosAPI} columns={columns} />;
        </div>
    );
}

export { Resultado }