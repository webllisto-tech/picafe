import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const galleryPost = async (data, token) => {
  try {
    const res = await axios.post(`${apiUrl}/gallery/`, data, {
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

export const galleryGet = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/gallery/${id}/`);

    return res;
  } catch (error) {
    return error;
  }
};

export const galleryDelete = async (id, token) => {
  try {
    const res = await axios.delete(`${apiUrl}/gallery/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};
