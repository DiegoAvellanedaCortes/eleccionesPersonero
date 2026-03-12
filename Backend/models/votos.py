from Backend.conexion import Base
from sqlalchemy import Column, Integer

class Votos(Base):
    __tablename__="votos"
    id_voto=Column(Integer, primary_key=True)
    id_candidato=Column(Integer)
    id_estudiante=Column(Integer)