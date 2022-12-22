import React, { useEffect, useState } from "react";
import { AiFillLock, AiOutlineUser } from "react-icons/ai";
import { setToken } from "../redux/features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../api/auth";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState({ username: "", password: "" });
  const token = useSelector((state) => state.auth.token);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(data);
      console.log(res);
      dispatch(setToken(res.data.token?.access));
      router.push("/");
    } catch (error) {}
  };

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (token) {
    if (router.pathname === "/login") router.push("/");
    return <></>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div
        className="
        flex flex-col
        bg-white
        shadow-md
        px-4
        sm:px-6
        md:px-8
        lg:px-10
        py-8
        rounded-3xl
        w-50
        max-w-md
      "
      >
        <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
          Join us Now
        </div>
        <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
          Enter your credentials to get access account
        </div>

        <div className="mt-10">
          <form action="#">
            <div className="flex flex-col mb-5">
              <label
                htmlFor="username"
                className="mb-1 text-xs tracking-wide text-gray-600"
              >
                User Name:
              </label>
              <div className="relative">
                <div
                  className="
                  inline-flex
                  items-center
                  justify-center
                  absolute
                  left-0
                  top-0
                  h-full
                  w-10
                  text-gray-400
                "
                >
                  <AiOutlineUser className="text-red-500" />
                </div>

                <input
                  id="username"
                  type="text"
                  name="username"
                  className="
                  text-sm
                  placeholder-gray-500
                  pl-10
                  pr-4
                  rounded-2xl
                  border border-gray-400
                  w-full
                  py-2
                  focus:outline-0
                  focus:border-red-400
                  focus:shadow-none
                "
                  placeholder="Enter your Username"
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label
                htmlFor="password"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password:
              </label>
              <div className="relative">
                <div
                  className="
                  inline-flex
                  items-center
                  justify-center
                  absolute
                  left-0
                  top-0
                  h-full
                  w-10
                  text-gray-400
                  focus:border-red-400
                "
                >
                  <span>
                    <AiFillLock className="text-red-500" />
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  className="
                  text-sm
                  placeholder-gray-500
                  pl-10
                  pr-4
                  rounded-2xl
                border-gray-400
                  w-full
                  py-2
                  outline-none
                focus:border-red-400
                "
                  placeholder="Enter your password"
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="
                flex
                mt-2
                items-center
                justify-center
                focus:outline-none
                text-white text-sm
                sm:text-base
                bg-red-500
                hover:bg-red-600
                rounded-2xl
                py-2
                w-full
                transition
                duration-150
                ease-in
              "
                onClick={handleLogin}
              >
                <span className="mr-2 uppercase">Login</span>
                <span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
