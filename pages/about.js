import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aboutGet, aboutPost } from "../api/about";
import Editor from "../components/Editor";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { removeToken } from "../redux/features/AuthSlice";

const About = () => {
  const [aboutus, setAboutus] = useState("");
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleAboutPost = async () => {
    try {
      const res = await aboutPost({ about_us: aboutus }, token);
      if (res.status === 201) {
        toast.success("Successfully Updatated!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await aboutGet(token);

        if (res.data) {
          setAboutus(res.data.about_us);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [token, dispatch, router]);

  return (
    <div className="about_wrp px-4">
      <h2 className="text-2xl font-bold mb-11">About Us</h2>
      <Editor html={aboutus} setHtml={setAboutus} />
      <button
        className="ml-auto block bg-red-400 hover:bg-red-500 px-2 py-1 rounded-md mt-3 text-white "
        onClick={handleAboutPost}
      >
        Submit
      </button>
    </div>
  );
};

export default About;
