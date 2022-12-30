import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const contactGet = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/contact/`, {
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
