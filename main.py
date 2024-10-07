import os
import glob
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

from vector_store import initialize_txtVectorstore, search_with_vectorstore, initialize_webVectorstore, load_vectorstore
from rag_chain import get_rag_chain_response
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
API_ENDPOINT = os.getenv("OPENAI_API_KEY")
# 서버 배포 시 절대 경로를 사용하여 벡터 스토어 저장 및 로드
VECTORSTORE_PATH = "./"

# 요청 데이터 모델 정의 (질문을 받기 위한 모델)
class Query(BaseModel):
    question: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Lifespan starting...")

    # 로컬에 저장된 벡터스토어 로드 시도
    try:
        load_vectorstore(VECTORSTORE_PATH)
        print("VectorStore loaded from local storage.")
    except Exception as e:
        print(f"No local VectorStore found. Initializing new VectorStore. Error: {e}")

        # txt 파일 목록 불러오기
        txt_files = glob.glob("lawPdf/*.txt")
        print(f"Found {len(txt_files)} text files.")

        # txt에서 텍스트를 벡터화 및 로컬에 저장
        initialize_txtVectorstore(txt_files)
        print("VectorStore initialized and saved locally.")

        initialize_webVectorstore()
        print("Web vectorstore initialized.")

    yield
    print("Lifespan ended.")

# FastAPI에 Lifespan 핸들러 등록
app = FastAPI(lifespan=lifespan)

# "/ask" 경로에 POST 요청이 들어오면 실행되는 함수
@app.post("/ask")
async def ask_question(query: Query):
    # LangChain VectorStore를 통해 질문에 대한 유사 문장 검색
    related_texts = search_with_vectorstore(query.question)

    # OpenAI API 비동기 호출로 답변 생성
    answer = await get_rag_chain_response(related_texts, query.question)
    return {"answer": answer}

# FastAPI 서버 실행 (개발 환경에서 uvicorn으로 실행)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)