import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const categoryPost = async (data, token) => {
  const formdata = new FormData();
  formdata.append("name", data);

  try {
    const res = await axios.post(`${apiUrl}/category/`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const categoryGet = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/category/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const categoryDelete = async (token) => {
  try {
    const res = await axios.delete(`${apiUrl}/category/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};
