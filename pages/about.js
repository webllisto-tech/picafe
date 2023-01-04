import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aboutGet, aboutPost } from "../api/about";
import Editor from "../components/Editor";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

const About = () => {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAboutPost = async (data) => {
    try {
      const res = await aboutPost({ about_us: data }, token);
      if (res.status === 201) {
        toast.success("Successfully Updatated!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formikAbout = useFormik({
    initialValues: {
      aboutus: "",
    },

    validationSchema: Yup.object({
      aboutus: Yup.string()
        .min(35, "Enter Atleast 35 character!")
        .required("Please this Field!"),
    }),

    onSubmit: (values) => {
      handleAboutPost(values.aboutus);
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await aboutGet(token);

        if (res.data) {
          formikAbout.setFieldValue("aboutus", res.data.about_us);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="about_wrp px-4">
      <h2 className="text-2xl font-bold mb-11">About Us</h2>
      <Editor
        key={"Hello"}
        html={formikAbout.values.aboutus}
        onChange={(_, editor) => {
          formikAbout.setFieldValue("aboutus", editor.getData());
        }}
      />
      <button
        type="submit"
        className="ml-auto block bg-red-400 hover:bg-red-500 px-2 py-1 rounded-md mt-3 text-white "
        onClick={formikAbout.handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default About;
