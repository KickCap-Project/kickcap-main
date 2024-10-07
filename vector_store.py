from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from typing import LiteralString
import os


# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
API_ENDPOINT = os.getenv("OPENAI_API_KEY")
chunkSize = 100
chunkOverlap = 50

# 벡터 스토어와 임베딩 객체 초기화
vectorstore = None
hf = HuggingFaceEmbeddings(model_name='jhgan/ko-sroberta-multitask')

# 서버 배포 시 절대 경로를 사용하여 벡터 스토어 저장 및 로드
# VECTORSTORE_PATH = os.getenv("VECTORSTORE_PATH")
VECTORSTORE_PATH = "./"

def initialize_webVectorstore():
    global vectorstore  # 전역 변수 선언
    loader = WebBaseLoader(
        web_paths=(
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=1&cciNo=1&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=1&cciNo=1&cnpClsNo=1&menuType=onhunqna&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=1&cciNo=2&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=1&cciNo=2&cnpClsNo=1&menuType=onhunqna&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=1&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=1&cnpClsNo=1&menuType=onhunqna&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=2&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=2&cnpClsNo=1&menuType=onhunqna&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=3&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=3&cnpClsNo=2&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=3&cnpClsNo=2&menuType=onhunqna&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=4&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=2&cciNo=4&cnpClsNo=1&menuType=onhunqna&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=3&cciNo=1&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=3&cciNo=2&cnpClsNo=1&search_put=",
            "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1506&ccfNo=3&cciNo=2&cnpClsNo=1&menuType=onhunqna&search_put="
        ),
    )
    docs = loader.load()

    # 로드된 문서를 확인
    if not docs:
        raise ValueError("문서를 로드할 수 없습니다.")

    # 문서 분할
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunkSize, chunk_overlap=chunkOverlap)
    splits = text_splitter.split_documents(docs)

    # 스플릿된 문서 확인
    if not splits:
        raise ValueError("문서 분할이 실패했습니다.")

    # FAISS 인덱스 생성
    vectorstore = FAISS.from_documents(splits, embedding=hf)
    # FAISS 인덱스를 저장
    vectorstore.save_local(VECTORSTORE_PATH)


def initialize_txtVectorstore(txt_files):
    global vectorstore  # 전역 변수 선언
    all_text = ""
    for txt_file in txt_files:
        with open(txt_file, 'r', encoding='utf-8') as file:
            all_text += file.read() + "\n"

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunkSize, chunk_overlap=chunkOverlap)
    documents = [Document(page_content=sentence) for sentence in all_text.split(". ") if sentence.strip()]

    if not documents:
        raise ValueError("문서를 처리할 수 없습니다. 추출된 텍스트가 없습니다.")

    splits = text_splitter.split_documents(documents)

    if not splits:
        raise ValueError("문서 분할 실패. 빈 텍스트입니다.")

    embeddings = hf.embed_documents([doc.page_content for doc in splits])

    if not embeddings or not embeddings[0]:
        raise ValueError("임베딩 생성 실패. 빈 임베딩 리스트입니다.")

    vectorstore = FAISS.from_documents(splits, embedding=hf)

    if vectorstore is None:
        raise ValueError("VectorStore가 올바르게 초기화되지 않았습니다.")

    # 벡터스토어 로컬에 저장
    vectorstore.save_local(VECTORSTORE_PATH)


def load_vectorstore(path: str):
    global vectorstore  # 전역 변수 선언
    # 로컬에서 벡터스토어 로드
    vectorstore = FAISS.load_local(path, embeddings=hf, allow_dangerous_deserialization=True)


# LangChain VectorStore를 통해 유사 문장 검색 함수
def search_with_vectorstore(query: str) -> LiteralString:
    if vectorstore is None:
        raise ValueError("Vectorstore has not been initialized. Please initialize the vectorstore first.")

    docs = vectorstore.similarity_search(query, k=5)
    return "\n\n".join(doc.page_content for doc in docs)