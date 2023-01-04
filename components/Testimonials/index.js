import React, { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import Card from "../Card";
import ModalComponent from "../Modal";
import {
  TextInput,
  Label,
  FileInput,
  Textarea,
  Rating,
  Spinner,
} from "flowbite-react";

import {
  testimonialDelete,
  testimonialGet,
  testimonialGetSingle,
  testimonialGetSingleUpdate,
  testimonialPost,
} from "../../api/testimonialupload";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoad } from "../../redux/features/LoaderSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const Testimonials = () => {
  const [isShowTestimonialModal, setIsShowTestimonialModal] = useState(false);
  const [isUpdateDataLoad, setIsUpdateDataLoad] = useState(false);
  const [testimonialGetData, setTestimonialGetData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const isLoad = useSelector((state) => state.loader.isLoad);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await testimonialPost(data, token);
      if (res.status === 201) {
        setIsShowTestimonialModal(false);
        dispatch(setIsLoad(!isLoad));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const res = await testimonialDelete(id, token);
      console.log(res);

      if (res) {
        setIsShow(false);
        dispatch(setIsLoad(!isLoad));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      const res = await testimonialGetSingleUpdate(data.id, data, token);
      if (res) {
        dispatch(setIsLoad(!isLoad));
        setIsLoading(false);
        setIsShow(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formikTestimonial = useFormik({
    initialValues: {
      name: "",
      designation: "",
      description: "",
      title: "",
      rating: 0,
      image: "",
    },
    validationSchema: Yup.object({
      name: Yup.string("Enter atleast 3 character!").required(
        "please fill this required field!"
      ),
      description: Yup.string("Enter atleast 30 character!").required(
        "please fill this required field!"
      ),
      title: Yup.string("Enter atleast 3 character!").required(
        "please fill this required field!"
      ),
      rating: Yup.number().required("please fill this required field!"),
      image: Yup.mixed()
        .required("please fill this required field!")
        .test(
          "fileSize",
          "File Too Large! Max File Size 50MB",
          (file) => file?.size <= 50 * 1000 * 1000
        ),
    }),

    onSubmit: (values, action) => {
      handleSubmit(values);
      action.resetForm();
    },
  });

  const formikTestimonialUpdate = useFormik({
    initialValues: {
      name: "",
      designation: "",
      description: "",
      title: "",
      rating: 0,
      image: "",
    },
    validationSchema: Yup.object({
      name: Yup.string("Enter atleast 3 character!").required(
        "please fill this required field!"
      ),
      description: Yup.string("Enter atleast 30 character!").required(
        "please fill this required field!"
      ),
      title: Yup.string("Enter atleast 3 character!").required(
        "please fill this required field!"
      ),
      rating: Yup.number().required("please fill this required field!"),
      image: Yup.mixed()
        .required("please fill this required field!")
        .test(
          "fileSize",
          "File Too Large! Max File Size 50MB",
          (file) => file?.size <= 50 * 1000 * 1000
        ),
    }),

    onSubmit: (values, action) => {
      handleUpdate(values);
      action.resetForm();
    },
  });

  const handleGetSingleItem = async (id) => {
    setIsUpdateDataLoad(true);
    const res = await testimonialGetSingle(id, token);
    formikTestimonialUpdate.setValues(res);
    setIsUpdateDataLoad(false);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await testimonialGet();
      setTestimonialGetData(res.data);
      setIsLoading(false);
    })();
  }, [isLoad]);

  if (isLoading) {
    return (
      <>
        <div className="banner_uploads_wrp">
          <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
            <h2 className="text-xl font-[700]">Your Testimonials</h2>

            <button
              // onClick={() => setIsShowTestimonialModal((prev) => !prev)}
              className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
            >
              <CgAdd className="shrink-0 w-6 h-6" /> Add New
            </button>
          </div>
        </div>

        <div className="banner_uploads_container px-4 sm:px-6 lg:px-8 text-center">
          <Spinner color="failure" />
        </div>
      </>
    );
  }

  return (
    <div className="banner_uploads_wrp">
      <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
        <h2 className="text-xl font-[700]">Your Testimonials</h2>

        <button
          onClick={() => setIsShowTestimonialModal((prev) => !prev)}
          className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
        >
          <CgAdd className="shrink-0 w-6 h-6" /> Add New
        </button>
      </div>

      {/* Upload Testimonials Modal */}
      <ModalComponent
        popup={false}
        isShow={isShowTestimonialModal}
        onClose={setIsShowTestimonialModal}
        onSubmit={formikTestimonial.handleSubmit}
        heading="Upload Testimonials"
      >
        <div>
          <div className="flex justify-between items-center gap-2">
            <div className="mb-2 block flex-1">
              <Label value="Name" htmlFor="name" />
              <TextInput
                id="name"
                type="text"
                name="name"
                placeholder="Jhon Doe"
                value={formikTestimonial.values.name}
                required={true}
                onChange={formikTestimonial.handleChange}
                onBlur={formikTestimonial.handleBlur}
              />
              <span className="text-red-600 text-sm">
                {formikTestimonial.errors ? formikTestimonial.errors.name : ""}
              </span>
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Designation" htmlFor="designation" />
              <TextInput
                id="designation"
                type="text"
                name="designation"
                value={formikTestimonial.values.designation}
                placeholder="Software Engineer"
                required={false}
                onChange={formikTestimonial.handleChange}
                onBlur={formikTestimonial.handleBlur}
              />
              <span className="text-transparent pointer-events-none select-none text-sm">
                {formikTestimonial.errors ? formikTestimonial.errors.name : ""}
              </span>
            </div>
          </div>
          <div className="mb-2 block">
            <Label value="Tilte" htmlFor="title" />
            <TextInput
              id="title"
              type="text"
              name="title"
              value={formikTestimonial.values.title}
              placeholder="Your Title.."
              required={true}
              onChange={formikTestimonial.handleChange}
              onBlur={formikTestimonial.handleBlur}
            />
            <span className="text-red-600 text-sm">
              {formikTestimonial.errors ? formikTestimonial.errors.title : ""}
            </span>
          </div>

          <div className="mb-2 block">
            <Label value="Description" htmlFor="description" />
            <Textarea
              id="description"
              rows={3}
              name="description"
              value={formikTestimonial.values.description}
              placeholder="Your Description"
              required={true}
              onChange={formikTestimonial.handleChange}
              onBlur={formikTestimonial.handleBlur}
            />
            <span className="text-red-600 text-sm">
              {formikTestimonial.errors
                ? formikTestimonial.errors.description
                : ""}
            </span>
          </div>

          <div className="mb-2 block">
            <Label htmlFor="image" value="Upload Image" />
            <FileInput
              id="image"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={(e) =>
                formikTestimonial.setFieldValue("image", e.target.files[0])
              }
            />
            <span className="text-red-600 text-sm">
              {formikTestimonial.errors ? formikTestimonial.errors.image : ""}
            </span>
          </div>

          <div className="mb-2 block">
            <Label htmlFor="rating" value="Your Rating" />
            <Rating size={"md"}>
              {[1, 2, 3, 4, 5].map((_, index) => {
                if (index + 1 <= formikTestimonial.values.rating) {
                  return (
                    <div
                      onMouseEnter={() =>
                        formikTestimonial.setFieldValue("rating", index + 1)
                      }
                      key={new Date().getTime() + index}
                    >
                      <Rating.Star filled={true} />
                    </div>
                  );
                } else {
                  return (
                    <div
                      onMouseEnter={() =>
                        formikTestimonial.setFieldValue("rating", index + 1)
                      }
                      key={new Date().getTime() + index}
                    >
                      <Rating.Star filled={false} />
                    </div>
                  );
                }
              })}
            </Rating>
            <span className="text-red-600 text-sm">
              {formikTestimonial.errors ? formikTestimonial.errors.rating : ""}
            </span>
          </div>
        </div>
      </ModalComponent>

      <div className="banner_uploads_container px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8">
        {testimonialGetData?.length > 0 ? (
          testimonialGetData.map((item, index) => {
            return (
              <>
                <Card
                  key={new Date().getTime() + index}
                  edit={true}
                  item={item}
                  setIsPopup={setIsPopup}
                  setIsShow={setIsShow}
                  setActiveItemId={setActiveItemId}
                  handleGetSingleItem={handleGetSingleItem}
                  className="md:col-span-3 sm:col-span-6 col-span-12"
                >
                  <ul className="px-2">
                    <li className="text-ellipsis overflow-hidden whitespace-nowrap">
                      {item.title}
                    </li>
                    <li className="w-[45%]">
                      <Rating>
                        {[1, 2, 3, 4, 5].map((_, index) => {
                          if (index + 1 <= item.rating) {
                            return (
                              <div key={new Date().getTime() + index + 1}>
                                <Rating.Star filled={true} />
                              </div>
                            );
                          } else {
                            return (
                              <div key={new Date().getTime() + index + 1}>
                                <Rating.Star filled={false} />
                              </div>
                            );
                          }
                        })}
                      </Rating>
                    </li>
                    <li className="font-bold text-right leading-3">
                      -{item.name}
                    </li>
                    <li className="text-right text-sm text-gray-400">
                      {item.designation}
                    </li>
                  </ul>
                </Card>
              </>
            );
          })
        ) : (
          <div className="col-span-12 text-center">
            Upload Your Testimonials
          </div>
        )}

        <ModalComponent
          popup={isPopup}
          isShow={isShow}
          onClose={setIsShow}
          onSubmit={formikTestimonialUpdate.handleSubmit}
          itemDelete={handleDelete}
          deleteId={activeItemId}
          heading="Testimonial"
        >
          {!isUpdateDataLoad ? (
            <div>
              <div className="flex justify-between items-center gap-2">
                <div className="mb-2 block flex-1">
                  <Label value="Name" htmlFor="updatename" />
                  <TextInput
                    id="updatename"
                    type="text"
                    name="name"
                    placeholder="Jhon Doe"
                    value={formikTestimonialUpdate.values.name}
                    onChange={formikTestimonialUpdate.handleChange}
                    onBlur={formikTestimonialUpdate.handleBlur}
                    required={true}
                  />
                  <span className="text-red-600 text-sm">
                    {formikTestimonialUpdate.errors
                      ? formikTestimonialUpdate.errors.name
                      : ""}
                  </span>
                </div>

                <div className="mb-2 block flex-1">
                  <Label value="Designation" htmlFor="updatedesignation" />
                  <TextInput
                    id="updatedesignation"
                    type="text"
                    name="designation"
                    value={formikTestimonialUpdate.values.designation}
                    placeholder="Software Engineer"
                    required={false}
                    onChange={formikTestimonialUpdate.handleChange}
                    onBlur={formikTestimonialUpdate.handleBlur}
                  />
                  <span className="text-red-600 text-sm">
                    {formikTestimonialUpdate.errors
                      ? formikTestimonialUpdate.errors.designation
                      : ""}
                  </span>
                </div>
              </div>
              <div className="mb-2 block">
                <Label value="Tilte" htmlFor="updatetitle" />
                <TextInput
                  id="updatetitle"
                  type="text"
                  name="title"
                  value={formikTestimonialUpdate.values.title}
                  placeholder="Your Title.."
                  required={true}
                  onChange={formikTestimonialUpdate.handleChange}
                  onBlur={formikTestimonialUpdate.handleBlur}
                />
                <span className="text-red-600 text-sm">
                  {formikTestimonialUpdate.errors
                    ? formikTestimonialUpdate.errors.title
                    : ""}
                </span>
              </div>

              <div className="mb-2 block">
                <Label value="Description" htmlFor="updatedescription" />
                <Textarea
                  id="updatedescription"
                  rows={3}
                  name="description"
                  value={formikTestimonialUpdate.values.description}
                  placeholder="Your Description"
                  required={true}
                  onChange={formikTestimonialUpdate.handleChange}
                  onBlur={formikTestimonialUpdate.handleBlur}
                />
                <span className="text-red-600 text-sm">
                  {formikTestimonialUpdate.errors
                    ? formikTestimonialUpdate.errors.description
                    : ""}
                </span>
              </div>

              <div className="mb-2 block">
                <Label htmlFor="updateimage" value="Upload Image" />
                <FileInput
                  id="updateimage"
                  name="image"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) =>
                    formikTestimonialUpdate.setFieldValue(
                      "image",
                      e.target.files[0]
                    )
                  }
                />
                <span className="text-red-600 text-sm">
                  {formikTestimonialUpdate.errors
                    ? formikTestimonialUpdate.errors.image
                    : ""}
                </span>
              </div>

              <div className="mb-2 block">
                <Label htmlFor="rating" value="Your Rating" />
                <Rating>
                  {[1, 2, 3, 4, 5].map((_, index) => {
                    if (index + 1 <= formikTestimonialUpdate.values.rating) {
                      return (
                        <div
                          onMouseEnter={() =>
                            formikTestimonialUpdate.setFieldValue(
                              "rating",
                              index + 1
                            )
                          }
                          key={new Date().getTime() + index + 1}
                        >
                          <Rating.Star filled={true} />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          onMouseEnter={() =>
                            formikTestimonialUpdate.setFieldValue(
                              "rating",
                              index + 1
                            )
                          }
                          key={new Date().getTime() + index + 1}
                        >
                          <Rating.Star filled={false} />
                        </div>
                      );
                    }
                  })}
                </Rating>
                <span className="text-red-600 text-sm">
                  {formikTestimonialUpdate.errors
                    ? formikTestimonialUpdate.errors.rating
                    : ""}
                </span>
              </div>
            </div>
          ) : (
            <>Please Wait...</>
          )}
        </ModalComponent>
      </div>
    </div>
  );
};

export default Testimonials;
