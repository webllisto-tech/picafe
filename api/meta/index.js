import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const metaPost = async (data, token) => {
  try {
    const res = await axios.post(`${apiUrl}/meta/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const metaUpdate = async (data, id, token) => {
  try {
    const res = await axios.put(`${apiUrl}/meta/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const metaGet = async () => {
  try {
    const res = await axios.get(`${apiUrl}/meta/`);
    return res;
  } catch (error) {
    return error;
  }
};

export const metaGetSingle = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/meta/${id}/`);
    return res;
  } catch (error) {
    return error;
  }
};

export const metaDelete = async (id, token) => {
  try {
    const res = await axios.delete(`${apiUrl}/meta/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};
