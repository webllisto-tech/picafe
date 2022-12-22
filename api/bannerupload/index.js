import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const bannerPost = async (data, token) => {
  try {
    const res = await axios.post(`${apiUrl}/slider/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const bannerGet = async () => {
  try {
    const res = await axios.get(`${apiUrl}/slider/`);

    return res;
  } catch (error) {
    return error;
  }
};

export const bannerDelete = async (id, token) => {
  try {
    const res = await axios.delete(`${apiUrl}/slider/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};
