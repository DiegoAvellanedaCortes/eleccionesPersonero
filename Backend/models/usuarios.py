from Backend.conexion import Base
from sqlalchemy import Column, Integer, String

class Usuarios(Base):
    __tablename__="usuarios"
    id_usuario=Column(Integer, primary_key=True)
    nombre=Column(String)
    contrasenia=Column(String)