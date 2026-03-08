from Backend.conexion import Base
from sqlalchemy import Column, Integer, String, Boolean

class Estudiantes(Base):
    __tablename__="estudiantes"

    id_estudiante=Column(Integer, primary_key=True)
    nombre=Column(String)
    documento=Column(String)
    curso=Column(String)
    voto=Column(Boolean)

