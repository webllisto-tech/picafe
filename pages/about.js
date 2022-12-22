import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { aboutGet, aboutPost } from "../api/about";
import Editor from "../components/Editor";
import { toast } from "react-toastify";

const About = () => {
  const [aboutus, setAboutus] = useState("");
  const token = useSelector((state) => state.auth.token);

  const handleAboutPost = async () => {
    try {
      console.log(aboutPost({ about_us: aboutus }, token));
      toast.promise(aboutPost({ about_us: aboutus }, token), {
        pending: "Wait",
        error: "something went wrong",
        success: "Updated",
      });
      // const res = await aboutPost({ about_us: aboutus }, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await aboutGet(token);
        console.log(res);
        setAboutus(res.data.about_us);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
