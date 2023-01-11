import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const footerGet = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/footer/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const footerPost = async (token, data) => {
  try {
    const res = await axios.post(
      `${apiUrl}/footer/`,
      { ...data, "contact": JSON.stringify(data?.contact) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
