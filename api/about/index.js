import axios from "axios";

export const aboutPost = async (data, token) => {
  const apiUrl = process.env.NEXT_PUBLIC_APIURL;
  try {
    const res = await axios.post(`${apiUrl}/about/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return new Error(error);
  }
};

export const aboutGet = async (token) => {
  const apiUrl = process.env.NEXT_PUBLIC_APIURL;
  try {
    const res = await axios.get(`${apiUrl}/about/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error.response;
  }
};
