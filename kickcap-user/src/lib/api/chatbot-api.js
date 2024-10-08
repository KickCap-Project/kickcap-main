import axios from "axios";

export const sendMessage = async (input) => {
  const url = process.env.REACT_APP_IMG_SERVER_BASE_URL + '/chatbot/ask';

  try {
    const response = await axios.post(url, { question: input });

    return response.data;
  } catch (err) {
    alert('메시지를 보내는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
