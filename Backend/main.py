from ast import Try

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import try_cast
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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

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
    resultado=db.query(VotosModel).all()
    return JSONResponse(status_code=200, content=jsonable_encoder(resultado))

@app.post("/votar/{id_estudiante}/{id_candidato}")
def registrarVoto(id_estudiante, id_candidato):
    try:
        db=SessionLocal()
        nuevo_voto=VotosModel(id_estudiante=id_estudiante, id_candidato=id_candidato)
        db.add(nuevo_voto)
        db.commit()
        return db.refresh(nuevo_voto) 
    except Exception as error:
        return error