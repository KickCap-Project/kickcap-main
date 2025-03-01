import os
from openai import AsyncOpenAI

# OpenAI API 키 설정 (YOUR_OPENAI_API_KEY 부분을 실제 키로 대체)
# gpt-4o-mini
# "킥보드 2인승차 시 벌금이 얼마인가요?"
# 문장 리스트를 받아 ChatGPT API를 사용하여 최종 답변을 생성하는 함수
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
API_ENDPOINT = os.getenv("OPENAI_API_KEY")
# OpenAI API 클라이언트 초기화 (비동기 방식)
client = AsyncOpenAI(
    # This is the default and can be omitted
    api_key=API_ENDPOINT,
)

# 비동기 함수로 generate_answer 정의
async def generate_answer(answers):
    # "answers"는 이미 문장 리스트이므로 이를 하나의 prompt로 결합하여 전달
    prompt = " ".join(answers)

    # OpenAI Chat API 비동기 호출
    response = await client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="gpt-4o-mini",
    )

    # GPT가 생성한 응답 반환
    return response.choices[0].message.content