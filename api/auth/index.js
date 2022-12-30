import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { removeToken } from "../../redux/features/AuthSlice";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const login = async (data) => {
  try {
    const res = await axios.post(`${apiUrl}/login/`, data);

    return res;
  } catch (error) {
    return error;
  }
};

// export const useIsLogin = (token) => {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   return async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/login/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res;
//     } catch (error) {
//       dispatch(removeToken());
//       router.push("/login");
//     }
//   };
// };
