import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const login = async (data) => {
  try {
    const res = await axios.post(`${apiUrl}/login/`, data);

    return res;
  } catch (error) {
    return error;
  }
};
