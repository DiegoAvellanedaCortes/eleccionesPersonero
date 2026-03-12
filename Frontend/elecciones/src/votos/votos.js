import { Card } from 'antd';
import "./votos.css";
import rafa from "../img/candidatos/rafa.webp";
import sofia from "../img/candidatos/sofia.webp";
import nikol from "../img/candidatos/nikol.webp";
import sara from "../img/candidatos/sara.webp";
import samuel from "../img/candidatos/samuel.webp";
import zahira from "../img/candidatos/zahira.webp";
import liceo from "../img/escudo_liceo.webp";
import { BannerNombre } from '../nombre/bannerNombre';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';


const { Meta } = Card;

const datos_candidatos = [
    {
        "foto": rafa,
        "nombre": "RAFAEL ALEJANDRO MÉNDEZ GÓMEZ",
        "numero": "1",
        "titulo": "#1",
        "activo": false
    },
    {
        "foto": sofia,
        "nombre": "KAROLAIN SOFÍA PUENTES GONZÁLEZ",
        "numero": "2",
        "titulo": "#2",
        "activo": false
    },
    {
        "foto": nikol,
        "nombre": "TANNIA NIKOL RODRÍGUEZ QUINTERO",
        "numero": "3",
        "titulo": "#3",
        "activo": false
    },
    {
        "foto": sara,
        "nombre": "SARA LIZETH QUINTERO CARRILLO",
        "numero": "4",
        "titulo": "#4",
        "activo": false
    },
    {
        "foto": samuel,
        "nombre": "SAMUEL JULIÁN ARÉVALO BARRIGA",
        "numero": "5",
        "titulo": "#5",
        "activo": false
    },
    {
        "foto": zahira,
        "nombre": "ZAHIRA NIKOL MONCADA BERMUDEZ",
        "numero": "6",
        "titulo": "#6",
        "activo": false
    },
    {
        "foto": liceo,
        "nombre": "Voto en blanco",
        "numero": "7",
        "titulo": "#7",
        "activo": false
    },
];

const BASE_URL = "http://127.0.0.1:8000";


function Votos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmarVotoModal, setconfirmarVotoModal] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModalVoto = () => {
        setconfirmarVotoModal(true);
    };

    const handleOkVoto = () => {
        const fetchData = async (documento) => {
            try {
              const estudiante = await fetch(BASE_URL + "/estudiantes/" + documento);
              const datos = await estudiante.json();
            } catch (error) {
              console.log(error)
            }
          }
        setconfirmarVotoModal(false);
    };

    const handleCancelVoto = () => {
        setconfirmarVotoModal(false);
    };

    console.log(showModal);
    console.log(showModalVoto);

    const [eleccion, setEleccion] = useState("0");
    useEffect(() => {
        // 1. Bloqueo al intentar retroceder
        const handlePopState = (event) => {
            // Al detectar que le dio atrás, borramos todo
            sessionStorage.clear();
            window.location.href = "/"; // Forzamos recarga al inicio
        };

        window.addEventListener('popstate', handlePopState);

        // 2. Limpieza al desmontar el componente (cuando cambia de ruta)
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div className='titulo_entrada'>
                    <p>Elecciones personero</p>
                    <p>estudiantil <strong className='numero'>2026</strong></p>
                    <BannerNombre />
                </div>
                <div className="candidatos">
                    {
                        datos_candidatos.map((candidato) => {
                            return <Card
                                key={candidato.numero}
                                className={candidato.numero === eleccion ? "card activo" : "card"}
                                hoverable
                                cover={
                                    <img
                                        draggable={false}
                                        alt={candidato.nombre}
                                        src={candidato.foto}
                                    />
                                }
                                onClick={
                                    () => {
                                        setEleccion(candidato.numero);
                                    }
                                }
                            >
                                <Meta title={candidato.titulo} description={candidato.nombre} />
                            </Card>
                        })
                    }
                </div>
                <Modal
                    title="Error"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>Debes seleccionar una opción</p>
                </Modal>
                <Modal
                    title="Votación"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={confirmarVotoModal}
                    onOk={handleOkVoto}
                    onCancel={handleCancelVoto}
                >
                    <p>Estas segur@ de votar por:</p>
                    {datos_candidatos.map(candidato => {
                        if (candidato.numero === eleccion) {
                            return (
                                <div key={candidato.numero}>
                                    <img src={candidato.foto} className='foto_modal' alt={candidato.numero} />
                                    <p>{candidato.nombre}</p>
                                </div>
                            );
                        }
                    })
                    }
                </Modal>
                <button className='btnVotar'
                    onClick={
                        () => {
                            if (eleccion === "0") {
                                setIsModalOpen(true);
                            } else {
                                console.log(eleccion);
                                setconfirmarVotoModal(true);
                            }
                        }
                    }>
                    <p>Votar</p>
                </button>
            </header>
        </div>
    )
}

export { Votos }