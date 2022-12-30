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

const Testimonials = () => {
  const [isShowTestimonialModal, setIsShowTestimonialModal] = useState(false);
  const [testimonialData, setTestimonialData] = useState({ rating: 0 });

  const [testimonialGetData, setTestimonialGetData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const isLoad = useSelector((state) => state.loader.isLoad);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleRating = (index) => {
    setTestimonialData({ ...testimonialData, rating: index + 1 });
  };

  const handleInput = (e) => {
    setTestimonialData({ ...testimonialData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setTestimonialData({
      ...testimonialData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(false);
      dispatch(setIsLoad(true));
      const data = new FormData();
      data.append("name", testimonialData?.name);
      data.append("designation", testimonialData?.designation);
      data.append("description", testimonialData?.description);
      data.append("title", testimonialData?.title);
      data.append("rating", testimonialData?.rating);
      data.append("image", testimonialData?.image);

      const res = await testimonialPost(data, token);
      if (res) {
        setIsShowTestimonialModal(false);
        setTestimonialData({});
        document.getElementById("image").value = "";
        dispatch(setIsLoad(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      dispatch(setIsLoad(true));
      const res = await testimonialDelete(id, token);
      console.log(res);

      if (res) {
        setIsShow(false);
        dispatch(setIsLoad(false));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      dispatch(setIsLoad(true));
      const res = await testimonialGetSingleUpdate(
        testimonialData.id,
        testimonialData,
        token
      );
      if (res) {
        dispatch(setIsLoad(false));
        setIsLoading(false);
        setIsShow(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSingleItem = async (id) => {
    setIsLoading(true);
    const res = await testimonialGetSingle(id, token);
    setTestimonialData(res);
    setIsLoading(false);
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
              onClick={() => setIsShowTestimonialModal((prev) => !prev)}
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
        onSubmit={handleSubmit}
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
                value={testimonialData?.name}
                required={true}
                onChange={handleInput}
              />
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Designation" htmlFor="designation" />
              <TextInput
                id="designation"
                type="text"
                name="designation"
                value={testimonialData?.designation}
                placeholder="Software Engineer"
                required={false}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="mb-2 block">
            <Label value="Tilte" htmlFor="title" />
            <TextInput
              id="title"
              type="text"
              name="title"
              value={testimonialData?.title}
              placeholder="Your Title.."
              required={true}
              onChange={handleInput}
            />
          </div>

          <div className="mb-2 block">
            <Label value="Description" htmlFor="description" />
            <Textarea
              id="description"
              rows={3}
              name="description"
              value={testimonialData?.description}
              placeholder="Your Description"
              required={true}
              onChange={handleInput}
            />
          </div>

          <div className="mb-2 block">
            <Label htmlFor="image" value="Upload Image" />
            <FileInput id="image" name="image" onChange={handleFile} />
          </div>

          <div className="mb-2 block">
            <Label htmlFor="rating" value="Your Rating" />
            <Rating>
              {[1, 2, 3, 4, 5].map((_, index) => {
                if (index + 1 <= testimonialData?.rating) {
                  return (
                    <div
                      onMouseEnter={() => handleRating(index)}
                      key={new Date().getTime() + index}
                    >
                      <Rating.Star filled={true} />
                    </div>
                  );
                } else {
                  return (
                    <div
                      onMouseEnter={() => handleRating(index)}
                      key={new Date().getTime() + index}
                    >
                      <Rating.Star filled={false} />
                    </div>
                  );
                }
              })}
            </Rating>
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
                  <ul className="list-[square] mx-4 px-5">
                    <li>{item.title}</li>
                    <li>{item.name}</li>
                    <li>{item.rating}</li>
                    <li>{item.designation}</li>
                    <li>{item.description.slice(0, 10)}...</li>
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
          onSubmit={handleUpdate}
          itemDelete={handleDelete}
          deleteId={activeItemId}
          heading="Testimonial"
        >
          <div>
            <div className="flex justify-between items-center gap-2">
              <div className="mb-2 block flex-1">
                <Label value="Name" htmlFor="updatename" />
                <TextInput
                  id="updatename"
                  type="text"
                  name="name"
                  placeholder="Jhon Doe"
                  value={testimonialData?.name}
                  onCanPlay={handleInput}
                  required={true}
                />
              </div>

              <div className="mb-2 block flex-1">
                <Label value="Designation" htmlFor="updatedesignation" />
                <TextInput
                  id="updatedesignation"
                  type="text"
                  name="designation"
                  value={testimonialData?.designation}
                  placeholder="Software Engineer"
                  required={false}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="mb-2 block">
              <Label value="Tilte" htmlFor="updatetitle" />
              <TextInput
                id="updatetitle"
                type="text"
                name="title"
                value={testimonialData?.title}
                placeholder="Your Title.."
                required={true}
                onChange={handleInput}
              />
            </div>

            <div className="mb-2 block">
              <Label value="Description" htmlFor="updatedescription" />
              <Textarea
                id="updatedescription"
                rows={3}
                name="description"
                value={testimonialData?.description}
                placeholder="Your Description"
                required={true}
                onChange={handleInput}
              />
            </div>

            <div className="mb-2 block">
              <Label htmlFor="updateimage" value="Upload Image" />
              <FileInput id="updateimage" name="image" onChange={handleFile} />
            </div>

            <div className="mb-2 block">
              <Label htmlFor="rating" value="Your Rating" />
              <Rating>
                {[1, 2, 3, 4, 5].map((_, index) => {
                  if (index + 1 <= testimonialData?.rating) {
                    return (
                      <div
                        onMouseEnter={() => handleRating(index)}
                        key={new Date().getTime() + index + 1}
                      >
                        <Rating.Star filled={true} />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        onMouseEnter={() => handleRating(index)}
                        key={new Date().getTime() + index + 1}
                      >
                        <Rating.Star filled={false} />
                      </div>
                    );
                  }
                })}
              </Rating>
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default Testimonials;
