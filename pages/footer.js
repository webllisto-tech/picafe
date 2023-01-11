import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { TextInput } from "flowbite-react";
import Editor from "../components/Editor";
import { footerGet, footerPost } from "../api/footer";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Footer = () => {
  const token = useSelector((state) => state.auth.token);
  const {
    values,
    handleSubmit,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      address: "",
      opening_hours: "",
      contact: {},
      facebook: "",
      instagram: "",
    },

    validationSchema: Yup.object({
      address: Yup.mixed().required("Required Field!"),
      opening_hours: Yup.mixed().required("Required Field!"),
      contact: Yup.object().shape({
        phone1: Yup.string().required("This field is required").max(12),
        phone2: Yup.string().required("This field is required").max(12),
        email: Yup.string().required("This field is required").email(),
      }),
      facebook: Yup.string()
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url!"
        )
        .required("Required Field"),
      instagram: Yup.string()
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9_#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url!"
        )
        .required("Required Field"),
    }),

    onSubmit: async (values) => {
      const res = await footerPost(token, values);
      if (res?.status === 201) {
        toast.success("Updated Successfully!");
      }
    },
  });

  useEffect(() => {
    (async () => {
      const res = await footerGet(token);
      setValues({ ...res.data, contact: JSON.parse(res.data.contact) });
    })();
  }, [token]);

  return (
    <div className="px-4">
      <div className="mb-2 address">
        <h1 className="text-2xl">Your Address</h1>
        <Editor
          html={values.address}
          onChange={(_, editor) => setFieldValue("address", editor.getData())}
        />
        <span className="text-red-600 text-sm font-semibold">
          {errors ? errors.address : ""}
        </span>
      </div>

      <div className="mb-2 opening_hours">
        <h1 className="text-2xl">Your Opening Hours</h1>
        <Editor
          html={values.opening_hours}
          onChange={(_, editor) =>
            setFieldValue("opening_hours", editor.getData())
          }
        />
        <span className="text-red-600 text-sm font-semibold">
          {errors ? errors.opening_hours : ""}
        </span>
      </div>

      <div className="mb-2 contact">
        <h1 className="text-2xl">Your Contact</h1>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4">
            <h2 className="text-base">Phone 1</h2>
            {console.log(errors, values)}
            <TextInput
              value={values.contact?.phone1}
              name="contact.phone1"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mobile Number"
              type="number"
            />
            <span className="text-red-600 text-sm font-semibold">
              {errors ? errors.contact?.phone1 : ""}
            </span>
          </div>
          <div className="col-span-4">
            <h2 className="text-base">Phone 2</h2>
            <TextInput
              value={values.contact?.phone2}
              name="contact.phone2"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mobile Number"
              type="number"
            />
            <span className="text-red-600 text-sm font-semibold">
              {errors ? errors.contact?.phone2 : ""}
            </span>
          </div>
          <div className="col-span-4">
            <h2 className="text-base">Email </h2>
            <TextInput
              value={values.contact?.email}
              onChange={handleChange}
              onBlur={handleBlur}
              name="contact.email"
              placeholder="Email"
              type="email"
            />
            <span className="text-red-600 text-sm font-semibold">
              {errors ? errors.contact?.email : ""}
            </span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl">Your Social Url</h1>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <h2 className="text-base">Facebook</h2>
          <TextInput
            value={values.facebook}
            onChange={handleChange}
            onBlur={handleBlur}
            name="facebook"
            placeholder="Facebook Url"
            type="url"
          />
          <span className="text-red-600 text-sm font-semibold">
            {errors ? errors.facebook : ""}
          </span>
        </div>
        <div className="col-span-4">
          <h2 className="text-base">Instagram</h2>
          <TextInput
            value={values.instagram}
            onChange={handleChange}
            onBlur={handleBlur}
            name="instagram"
            placeholder="Instagram Url"
            type="url"
          />
          <span className="text-red-600 text-sm font-semibold">
            {errors ? errors.instagram : ""}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-red-500 py-1 px-2 text-white rounded-md my-4 hover:bg-red-600"
      >
        Submit
      </button>
    </div>
  );
};

export default Footer;
