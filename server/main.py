from fastapi import FastAPI,Body,Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import json

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def index():
    return {'status': "200: successfully connected"}


@app.get('/clubs', status_code=200)
def get_clubs():
    f = open ('./file/data.json')
    data = json.load(f)
    f.close()

    return data

class clubMember(BaseModel):
    name:str
    age:int  

class clubsWrapper(BaseModel):
    club_members: List[clubMember] = []
    club_name:str
    club_address:str

class clubModel(BaseModel):
    clubs:List[clubsWrapper] = []

@app.post("/clubs")
async def post_clubs(request: Request):

    response =  await request.json()
    print(response)
    with open('./file/data.json', 'w', encoding='utf-8') as f:
        json.dump(response, f, ensure_ascii=False, indent=4)
    f.close()
 
    return  {'status': 200, 'message' :'successfully updated'}
