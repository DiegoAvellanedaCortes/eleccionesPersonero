from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from Backend.conexion import engine, Base, SessionLocal
from Backend.models.estudiantes import Estudiantes as EstudiantesModel

app = FastAPI()
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

@app.get("/estudiantes")
def consultar_estudiantes():
    db=SessionLocal()
    result=db.query(EstudiantesModel).all()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


