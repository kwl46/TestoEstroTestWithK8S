
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

Instrumentator().instrument(app).expose(app)  # Add prometheus

# CORS 설정
origins = [
    "http://localhost:3000",  # React 앱의 주소, 
    "http://kiwon-solo-bucket.s3-website.ap-northeast-2.amazonaws.com" # aws s3 frontend 도메인
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델 정의
class Answers(BaseModel):
    T: int
    E: int
    gender: str

# 결과 데이터 정의 (image 필드 추가)
RESULTS_DB = {
    "테토남": {"name": "테토남", "description": "당신은 테스토스테론이 넘치는 테토남입니다.", "image": "tetoman.png"},
    "테토녀": {"name": "테토녀", "description": "테토력 가득의 테토녀입니다.", "image": "tetowoman.png"},
    "에겐남": {"name": "에겐남", "description": "에겐력 가득의 에겐남 입니다.", "image": "egenman.png"},
    "에겐녀": {"name": "에겐녀", "description": "당신은 에스트로겐이 넘치는 에겐녀입니다. ", "image": "egenwoman.png"},
}

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/result")
async def get_result(answers: Answers):
    if answers.T > answers.E:
        base_type = "테토"
    elif answers.E > answers.T:
        base_type = "에겐"
    else:
        base_type = random.choice(["테토", "에겐"])

    if answers.gender == "man":
        gender_suffix = "남"
    else:
        gender_suffix = "녀"

    result_key = base_type + gender_suffix
    return RESULTS_DB[result_key]
