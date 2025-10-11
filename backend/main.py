
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
    "테토남": {"name": "테토남", "description": "강한 주도력과 명철한 분석력으로 팀을 이끄는 전략가. 당신은 냉철한 판단력으로 최적의 길을 찾아내고, 목표를 향해 거침없이 나아가는 타고난 리더입니다.", "image": "tetoman.png"},
    "테토녀": {"name": "테토녀", "description": "부드러운 카리스마와 흔들림 없는 결단력을 겸비한 리더. 당신은 복잡한 상황 속에서도 핵심을 꿰뚫어 보고, 주변의 신뢰를 바탕으로 모두를 같은 목표로 이끄는 힘이 있습니다.", "image": "tetowoman.png"},
    "에겐남": {"name": "에겐남", "description": "따뜻한 공감 능력으로 주변 사람들에게 든든한 버팀목이 되어주는 중재자. 당신은 다른 사람의 이야기에 진심으로 귀 기울이며, 갈등 상황에서 조화를 찾아내는 뛰어난 능력을 가졌습니다.", "image": "egenman.png"},
    "에겐녀": {"name": "에겐녀", "description": "뛰어난 친화력과 긍정적인 에너지로 주변을 밝게 만드는 분위기 메이커. 당신은 사람들과의 관계를 소중히 여기며, 세심한 배려로 모두를 따뜻하게 챙기는 사랑스러운 사람입니다.", "image": "egenwoman.png"},
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
