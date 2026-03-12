from jwt import decode, encode
import os
from dotenv import load_dotenv #pip install python-dotenv 

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# Accede a las variables
key_token = os.getenv("KEY_TOKEN")
algoritmo=os.getenv("ALGORITHM")

def crearToken(data):
    token:str=encode(payload=data,key=key_token, algorithm=algoritmo)
    return token

def validarToken(token):
    data=decode(token,key=key_token,algorithms=algoritmo)
    return data
