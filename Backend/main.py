from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import func
from Backend.conexion import engine, Base, SessionLocal
from Backend.models.estudiantes import Estudiantes as EstudiantesModel
from Backend.models.usuarios import Usuarios as UsuariosModel
from Backend.models.candidatos import Candidatos as CandidatosModel
from Backend.models.votos import Votos as VotosModel
from fastapi.middleware.cors import CORSMiddleware
from Backend.jwt_manager import crearToken

app = FastAPI()
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/estudiantes")
def consultar_estudiantes():
    db=SessionLocal()
    resultado=db.query(EstudiantesModel).all()
    return JSONResponse(status_code=200, content=jsonable_encoder(resultado))

@app.get("/estudiantes/{documento}")
def consultar_voto(documento):
    db=SessionLocal()
    consulta=db.query(EstudiantesModel).filter(EstudiantesModel.documento==documento).first()
    if not consulta:
        return JSONResponse(status_code=404, content={"message":"Estudiante no encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(consulta))
    
@app.get("/createToken/{documento}")
def crear_token(documento):
    token=crearToken({"documento":documento})
    return JSONResponse(status_code=200, content={"access_token":token, "token_type": "bearer"})
 
@app.get("/usuarios")
def consultar_usuarios():
    db=SessionLocal()
    resultado=db.query(UsuariosModel).all()
    return JSONResponse(status_code=200, content=jsonable_encoder(resultado))

@app.get("/candidatos")
def consultar_candidatos():
    db=SessionLocal()
    resultado=db.query(CandidatosModel).all()
    return JSONResponse(status_code=200, content=jsonable_encoder(resultado))

@app.get("/votos")
def consultar_votos():
    db=SessionLocal()
    resultado=db.query(VotosModel.id_candidato,EstudiantesModel.nombre.label("nombre_candidato"),func.count(VotosModel.id_estudiante).label("total_votos_candidato")).join(CandidatosModel, VotosModel.id_candidato == CandidatosModel.id_candidato).join(EstudiantesModel, CandidatosModel.id_estudiante == EstudiantesModel.id_estudiante).group_by(VotosModel.id_candidato, EstudiantesModel.nombre).order_by(func.count(VotosModel.id_estudiante).desc()).all()

    resultados_json = []

    for r in resultado:
        resultados_json.append({
            "id_candidato": r.id_candidato,
            "nombre_candidato": r.nombre_candidato,
            "total_votos_candidato": r.total_votos_candidato
        })

    return JSONResponse(
        status_code=200,
        content=resultados_json
    )

@app.post("/votar/{id_estudiante}/{id_candidato}")
def registrarVoto(id_estudiante,id_candidato):
    try:
        db=SessionLocal()
        nuevo_voto=VotosModel(id_estudiante=id_estudiante, id_candidato=id_candidato)
        db.add(nuevo_voto)
        db.commit()
        return {"status": "success", "message": "Voto registrado correctamente"}
    except Exception as e: # Esto captura cualquier otro error inesperado
        db.rollback()
        print(f"Error inesperado: {e}")
        return {"status": "error", "message": "Ocurrió un error en el servidor."}