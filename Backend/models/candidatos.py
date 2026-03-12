from Backend.conexion import Base
from sqlalchemy import Column, Integer

class Candidatos(Base):
    __tablename__="candidatos"
    id_candidato=Column(Integer, primary_key=True)
    id_estudiante=Column(Integer)