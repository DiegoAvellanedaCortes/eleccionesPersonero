import { useState } from 'react';
import { Alert } from 'antd';
import liceo from "./img/escudo_liceo.webp";
import './App.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://127.0.0.1:8000";

function App() {
  const navigate = useNavigate();
  const fetchData = async (documento) => {
    try {
      const estudiante = await fetch(BASE_URL + "/estudiantes/" + documento);
      const datos = await estudiante.json();
      if (!estudiante.ok) {
        setWarningUsuario(true);
        console.log(datos.message);
      } else {
        try {
          const createToken = await fetch(BASE_URL + "/createToken/" + documento);
          const data = await createToken.json();
          if (!data.ok) {
            // Al recibir el token del backend, se agrega a sessionStorage
            sessionStorage.setItem("token", data.access_token);
            sessionStorage.setItem("nombre", datos.nombre);
            sessionStorage.setItem("id_estudiante", datos.id_estudiante);
            navigate("/votar", { replace: true });
          }

        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const [documento, setDocumento] = useState("");
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);
  const [warningUsuario, setWarningUsuario] = useState(false);

  window.onbeforeunload = function () {
    sessionStorage.clear();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='titulo_entrada'>
          <p>Elecciones personero</p>
          <p>estudiantil <strong className='numero'>2026</strong></p>
        </div>
        <div className='ingreso'>
          <p>Ingresa tu número de identificación</p>
          <input type='text' placeholder='123456789' value={documento}
            onChange={
              (event) => {
                setDocumento(event.target.value);
              }
            }
          />
        </div>
        <button className='btn_ingreso'
          onClick={
            () => {
              if (documento === "") {
                setWarning(true);
                setError(false);
                setWarningUsuario(false);
              } else {
                if (/^\d+$/.test(documento)) {
                  setWarning(false);
                  setError(false);
                  setWarningUsuario(false);
                  fetchData(documento);
                } else {
                  setWarning(false)
                  setError(true)
                  setWarningUsuario(false);
                }
              }
            }
          }
        >
          <p>Ingresar</p>
        </button>
        <img className='escudo_fondo' src={liceo} alt='Escudo Liceo' />
        {
          error && (
            <Alert className='iconError' type="error" title="Ingresaste letras" banner />
          )
        }
        {
          warning && (
            <Alert className='iconError' type="warning" title="Debes ingresar un número" banner />
          )
        }
        {
          warningUsuario && (
            <Alert className='iconError' type="warning" title="Usuario no encontrado" banner />
          )
        }
      </header>
    </div>
  );
}

export default App;
