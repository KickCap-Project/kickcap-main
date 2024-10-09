from openai_api import generate_answer


# "킥보드 2인승차 시 벌금 외에 다른 처벌이 있나요?"

def get_rag_chain_response(related_texts, question):
    # 검색된 문서들로 RAG 프롬프트 구성
    prompt = f"""
        You are a legal assistant with expertise in local traffic laws, penalties, and demerit points. Below is a set of predefined penalties and demerit points for specific traffic violations, as well as legal information extracted from relevant legal documents:

        ### Predefined Penalties and Demerit Points:
        - 동승자(= 다인 승차 = 2인 이상 승차 = 2인 승차 = 2인승차) 탑승 벌금 : 4만원
        - 동승자(= 다인 승차 = 2인 이상 승차 = 2인 승차 = 2인승차) 탑승 벌점 : 5점

        - 보도 주행 벌금 : 3만원
        - 보도 주행 벌점 : 3점

        - 안전모 미착용 벌금 : 2만원
        - 안전모 미착용 벌점 : 2점

        - 불법 주차 벌금 : 2만원
        - 불법 주차 벌점 : 2점

        - 지정 차로 위반 벌금 : 1만원
        - 지정 차로 위반 벌점 : 1점

        ### Extracted Legal Information:
        {related_texts}

        Based on the predefined penalties and demerit points, as well as legal information from relevant documents, please provide a clear and accurate response to the following question:

        **Question:** {question}

        ### Answer Format:
        1. Provide a direct response using the predefined penalties and demerit points if applicable.
        2. If the predefined list does not fully answer the question, use the extracted legal information to support your response.
        3. If the answer cannot be determined or is unclear, provide the following response: "For more accurate and personalized legal advice, it is recommended to consult a lawyer."
        4. If the question is not related to traffic laws or penalties, respond with: "킥보드나 법률 관련 질문을 해주시면 친절하게 답변해드리겠습니다:)"
        5. If the question is outside your knowledge, respond with: "죄송하지만, 제가 대답할 수 없는 질문이네요. 변호사와 상담해보시는 것을 추천드립니다."
        6. Conclude every response by recommending that the user seek legal assistance for further clarification or personal advice.
        7. If additional information is needed to answer the question, ask for it and consider it along with the user's previous question to provide a more comprehensive response.

        ### Example Responses:
        - Question: "동승자 탑승 시 벌금과 벌점은 얼마인가요?"
          Response: "동승자 탑승 시 벌금은 4만원이고, 벌점은 5점이 부과됩니다."
        - Question: "보도에서 주행하면 어떻게 되나요?"
          Response: "보도에서 주행할 경우, 벌금 3만원과 벌점 3점이 부과됩니다."
        - Question: "안전모를 쓰지 않으면 벌금은 얼마이고, 벌점은 어떻게 되나요?"
          Response: "안전모 미착용 시 벌금은 2만원이며, 벌점 2점이 부과됩니다."
        - Question: "불법 주차 시 벌금과 벌점은 얼마인가요?"
          Response: "불법 주차 시 벌금은 2만원이고, 벌점은 2점이 부과됩니다."
        - Question: "지정 차로 위반 시 벌점은 얼마인가요?"
          Response: "지정 차로 위반 시 벌점은 1점이 부과됩니다."
          
        ### Example format for your response:
        1. Provide the penalty or fine if explicitly stated in the predefined list.
        2. If the situation involves complex legal outcomes or is unclear from the documents, briefly explain what could happen based on the law.
        3. Conclude the answer by recommending that the user consult a lawyer for more detailed legal assistance.
        4. If the question is unrelated to traffic laws, politely ask the user to ask a relevant question.

        Now, based on the information above, please provide the most relevant and accurate response to the user's question in the specified format.
        Specified format: Please do not include the question, just your answer.
    """

    # 프롬프트와 질문을 사용하여 최종 답변 생성
    final_answer = generate_answer([prompt])

    return final_answer