import { imgLocalAxios } from '../../util/axios-setting';

// violationType: 1, 2, 3, 4, 5
export const uploadImg = async (imgFile, violationType) => {
  try {
    const formData = new FormData();
    formData.append('image', imgFile);

    const response = await imgLocalAxios.post(`/image/upload/type${violationType}`, formData);

    return response.data;
  } catch (err) {
    alert('이미지 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
