import axios from "axios";

export const login = async (data) => {
  const apiUrl = process.env.NEXT_PUBLIC_APIURL;
  try {
    const res = await axios.post(`${apiUrl}/login/`, data);

    return res;
  } catch (error) {
    return error;
  }
};
