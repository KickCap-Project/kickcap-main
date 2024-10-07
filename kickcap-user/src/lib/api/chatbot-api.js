import axios from "axios";

export const sendMessage = async (input) => {
  const url = process.env.REACT_APP_IMG_SERVER_BASE_URL + '/chatbot/ask';

  try {
    const response = await axios.post(url, { question: input });

    return response.data;
  } catch (err) {
    console.error(`메시지 송신 중 오류 발생: ${err}`);
  }
};
