import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const galleryCategoryPost = async (data, token) => {
  const formdata = new FormData();
  formdata.append("name", data);

  try {
    const res = await axios.post(`${apiUrl}/gallery-category/`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const galleryCategoryGet = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/gallery-category/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const galleryCategoryDelete = async (id, token) => {
  const res = await axios.delete(`${apiUrl}/gallery-category/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
