import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const testimonialPost = async (data, token) => {
  try {
    const res = await axios.post(`${apiUrl}/review/`, data, {
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

export const testimonialGet = async () => {
  try {
    const res = await axios.get(`${apiUrl}/review/`);
    return res;
  } catch (error) {
    return error;
  }
};

export const testimonialDelete = async (id, token) => {
  try {
    const res = await axios.delete(`${apiUrl}/review/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};
