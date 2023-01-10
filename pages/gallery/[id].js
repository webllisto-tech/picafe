import React, { useEffect, useState } from "react";
import ModalComponent from "../../components/Modal";
import { RiGalleryLine } from "react-icons/ri";
import {
  galleryDelete,
  galleryGet,
  galleryPost,
  getAllGallery,
  getFilterGalleryByType,
  getFilterGalleryByTypeCategory,
} from "../../api/gallery";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Video from "../../components/Video";
import { MdDelete } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import Dropdown from "../../components/Dropdown";

import {
  Label,
  TextInput,
  FileInput,
  Spinner,
  Select,
  Button,
} from "flowbite-react";
import { useRouter } from "next/router";
import {
  galleryCategoryDelete,
  galleryCategoryPost,
} from "../../api/gallercategory";
import { setIsLoad } from "../../redux/features/LoaderSlice";
import Pagination from "react-js-pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Gallery = () => {
  const [isShowGalleryUpload, setIsShowGalleryUpload] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowCreateCategoryModal, setIsShowCreateCategoryModal] =
    useState(false);
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isLoad = useSelector((state) => state.loader.isLoad);
  const [selectedItem, setSelectedItem] = useState("all");

  const router = useRouter();
  const { query } = router;
  const galleryCategoryItem = useSelector(
    (state) => state.category.galleryCategoryItem
  );

  const postInBulk = async (type, file, action) => {
    try {
      let promiseArr = [];
      for (let i = 0; i < 10; i++) {
        const res = galleryPost(
          {
            type: type.toUpperCase(),
            ...file,
            category: query.id,
            category_name: galleryCategoryItem.find(
              (item) => item.id === parseInt(query.id)
            )?.name,
          },
          token
        );
        promiseArr.push(res);
      }
      setisLoading(true);
      const res = await Promise.all(promiseArr);

      if (res[0].status === 201) {
        dispatch(setIsLoad(!isLoad));
        toast.success("Uploaded!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostGallery = async (type, data, title, action) => {
    try {
      setisLoading(true);
      const res = await galleryPost(
        {
          type: type.toUpperCase(),
          ...data,
          title: title,
          category: query.id,
          category_name: galleryCategoryItem.find(
            (item) => item.id === parseInt(query.id)
          )?.name,
        },
        token
      );
      if (res.code === "ERR_NETWORK") {
        dispatch(setIsLoad(!isLoad));
        toast.error("Network Error!");
      }

      if (res.code === "ERR_BAD_REQUEST" || res.code === "ERR_BAD_RESPONSE") {
        dispatch(setIsLoad(!isLoad));
        toast.error("Bad Request!");
      }

      if (res.status === 201) {
        setIsShowGalleryUpload(false);
        dispatch(setIsLoad(!isLoad));
        action.resetForm({});
        toast.success("Uploaded!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGalleryDelete = async (id) => {
    try {
      setisLoading(true);
      const res = await galleryDelete(id, token);
      if (res.status === 204) {
        setIsShowDeleteModal(false);
        dispatch(setIsLoad(!isLoad));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCategory = async (data) => {
    try {
      setisLoading(true);
      const res = await galleryCategoryPost(data.toLowerCase(), token);
      if (res) {
        setIsShowCreateCategoryModal(false);
        dispatch(setIsLoad(!isLoad));
        router.push(`/gallery/${res.data.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGalleryCategoryDelete = async () => {
    try {
      setisLoading(true);
      const res = await galleryCategoryDelete(deleteCategoryId, token);
      if (res.status === 204) {
        dispatch(setIsLoad(!isLoad));
        setIsShowCreateCategoryModal(false);
        if (galleryCategoryItem.length > 0) {
          router.push(`/gallery/${galleryCategoryItem[0].id}`);
        } else {
          router.push(`/gallery/create`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePagination = async (page) => {
    try {
      setisLoading(true);
      let res;
      if (query.id === "viewall") {
        res = await getAllGallery(page);
      } else {
        res = await galleryGet(query.id, page);
      }
      if (res.status === 200) {
        setData(res.data);
      }
      setisLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const formikCategory = useFormik({
    initialValues: {
      category: "",
    },
    validationSchema: Yup.object({
      category: Yup.string()
        .min(3, "Please Atleast enter 3 character!")
        .required("Please Fill Field!"),
    }),
    onSubmit: (values, action) => {
      handleCreateCategory(values.category);
      action.resetForm({ category: "" });
    },
  });

  const formikGallery = useFormik({
    initialValues: {
      type: "image",
      file: "",
      video_url: "",
      title: "",
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter some value"),
      type: Yup.string().required("Please select it!"),
      file: Yup.mixed().test(
        "fileSize",
        "File Too Large! Max File Size 50MB",
        (file) => {
          if (file && file?.image) {
            return file?.image?.size <= 50 * 1000 * 1000;
          } else {
            return true;
          }
        }
      ),

      video_url: Yup.string().test("urlCheck", "Url is not Valid!", (val) => {
        if (val) {
          return /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9-_]{11}$/.test(
            val
          );
        } else {
          return true;
        }
      }),
    }),

    onSubmit: (values, action) => {
      if (values.type === "image") {
        handlePostGallery(values.type, values.file, values.title, action);
      } else {
        handlePostGallery(values.type, { video_url: values.video_url }, action);
      }
      // postInBulk(values.type, values.file, action);
    },
  });

  useEffect(() => {
    const id = galleryCategoryItem.find(
      (item) => item.id === parseInt(query.id)
    )?.id;
    (async () => {
      if (query?.id && selectedItem === "all") {
        setisLoading(true);
        if (query.id === "viewall") {
          const res = await getAllGallery(1);
          if (res.status === 200) {
            setData(res.data);
            setDeleteCategoryId(id);
          }
        } else {
          const res = await galleryGet(query.id, 1);
          if (res.status === 200) {
            setData(res.data);
            setDeleteCategoryId(id);
          }
        }
      } else {
        if (query.id) {
          setisLoading(true);
          if (query.id === "viewall") {
            const res = await getFilterGalleryByType(selectedItem);
            console.log(res);
            if (res.status === 200) {
              setData(res.data);
              setDeleteCategoryId(id);
            }
          } else {
            const res = await getFilterGalleryByTypeCategory(
              query.id,
              selectedItem
            );
            console.log(res);
            if (res.status === 200) {
              setData(res.data);
              setDeleteCategoryId(id);
            }
          }
        }
      }
      setisLoading(false);
    })();
  }, [galleryCategoryItem, isLoad, query.id, selectedItem]);

  if (query.id === "create") {
    return (
      <div>
        <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
          <h2 className="text-xl font-[700]">Your Uploads</h2>

          <button
            onClick={() => setIsShowCreateCategoryModal((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
          >
            <BiCategory className="shrink-0 w-6 h-6" /> Add New
          </button>
          <ModalComponent
            popup={false}
            isShow={isShowCreateCategoryModal}
            onClose={setIsShowCreateCategoryModal}
            onSubmit={handleCreateCategory}
            isLoading={isLoading}
            heading="Create Category"
          >
            <div id="create_category">
              <div className="mb-2 block flex-1">
                <Label value="Category" htmlFor="name" />
                <TextInput
                  id="name"
                  type="text"
                  name="category"
                  placeholder="Breakfast"
                  value={category}
                  required={true}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </ModalComponent>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
        <h2 className="text-xl font-[700]">Gallery</h2>
        <div className="flex gap-2">
          <Dropdown
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
            className="bg-red-400 rounded-full text-white flex p-1"
          />

          <button
            onClick={() => setIsShowCreateCategoryModal((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
          >
            <BiCategory className="shrink-0 w-6 h-6" /> Add Category
          </button>

          {query.id !== "viewall" ? (
            <button
              onClick={() => setIsShowGalleryUpload((prev) => !prev)}
              className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
            >
              <RiGalleryLine className="shrink-0 w-6 h-6" /> Add Item
            </button>
          ) : (
            <></>
          )}

          <ModalComponent
            popup={false}
            isShow={isShowCreateCategoryModal}
            onClose={setIsShowCreateCategoryModal}
            onSubmit={formikCategory.handleSubmit}
            heading="Create Category"
            isLoading={isLoading}
          >
            <div id="create_category">
              <div className="mb-2 block flex-1">
                <Label value="Category" htmlFor="category" />
                <TextInput
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formikCategory.values.category}
                  required={true}
                  onChange={formikCategory.handleChange}
                  onBlur={formikCategory.handleBlur}
                />

                <span className="text-red-600 text-sm">
                  {formikCategory.errors ? formikCategory.errors.category : ""}
                </span>
              </div>

              <div className="mb-2 flex gap-2 flex-1">
                <div className="flex-1">
                  <Select
                    id="deleteCategory"
                    value={deleteCategoryId}
                    onChange={(e) => setDeleteCategoryId(e.target.value)}
                  >
                    {galleryCategoryItem.map((item, id) => {
                      return (
                        <option
                          key={new Date().getTime() + id + 1}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div className="flex items-center">
                  <Button
                    color={"failure"}
                    onClick={handleGalleryCategoryDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </ModalComponent>
        </div>

        {/* Gallery Post */}
        <ModalComponent
          popup={false}
          isShow={isShowGalleryUpload}
          onClose={setIsShowGalleryUpload}
          onSubmit={formikGallery.handleSubmit}
          heading="Upload Gallery"
          isLoading={isLoading}
        >
          <div id="create_category">
            <div className="mb-2 block flex-1">
              <Label htmlFor="title" value="Enter Title" />
              <TextInput
                id="title"
                type="text"
                name="title"
                onChange={formikGallery.handleChange}
                onBlur={formikGallery.handleBlur}
                placeholder="Title"
              />
              <span className="text-red-600 text-sm">
                {formikGallery.errors ? formikGallery.errors.title : ""}
              </span>
            </div>
            <div className="mb-2 block flex-1">
              <Label htmlFor="type" value="Select Your Type" />
              <Select
                id="type"
                name="type"
                value={formikGallery.values.type}
                onChange={formikGallery.handleChange}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Select>
              <span className="text-red-600 text-sm">
                {formikGallery.errors ? formikGallery.errors.type : ""}
              </span>
            </div>

            <div className="mb-2 block flex-1">
              <Label htmlFor="catgory" value="Category" />
              <TextInput
                id="category"
                disabled
                value={
                  galleryCategoryItem.find(
                    (item) => item.id === parseInt(query.id)
                  )?.name
                }
              />
            </div>

            {formikGallery.values.type === "image" ? (
              <div className="mb-2 block flex-1">
                <Label value="File" htmlFor="file" />
                <FileInput
                  id="file"
                  name={formikGallery.values.type}
                  accept={`${
                    formikGallery.values.type === "image"
                      ? ".jpg,.webp,.jpeg"
                      : ".mp4,.mpeg,.mov,.avi"
                  }`}
                  required={true}
                  onChange={(e) =>
                    formikGallery.setFieldValue("file", {
                      [e.target.name]: e.target.files[0],
                    })
                  }
                />
                <span className="text-red-600 text-sm">
                  {formikGallery.errors ? formikGallery.errors.file : ""}
                </span>
              </div>
            ) : (
              <>
                <div className="mb-2 block flex-1">
                  <Label value="Youtube Video" htmlFor="byurl" />
                  <TextInput
                    id="byurl"
                    type="url"
                    name={formikGallery.values.type}
                    onChange={(e) =>
                      formikGallery.setFieldValue("video_url", e.target.value)
                    }
                    placeholder="https://www.youtube.com/watch?v=sNzw23FETUI"
                  />
                  <span className="text-red-600 text-sm">
                    {formikGallery.errors ? formikGallery.errors.video_url : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        </ModalComponent>
      </div>

      {isLoading ? (
        <>
          <div className="items_container text-center py-2 px-4 sm:px-6 lg:px-8">
            <Spinner color="failure" />
          </div>
        </>
      ) : (
        <>
          <div className="mb-2 py-2 px-4 sm:px-6 lg:px-8 grid grid-cols-3">
            {data.data?.length > 0 ? (
              data.data.map((item, index) => {
                if (item.type === "IMAGE") {
                  return (
                    <div
                      className=" col-span-1 p-2"
                      key={new Date().getTime() + 1 + index}
                    >
                      <div className="relative h-72 w-72 mx-auto hover:shadow-lg hover:scale-105 transition-all">
                        <span
                          className="absolute right-3 z-[9] top-3 bg-white shadow-xl rounded-full p-2 cursor-pointer text-2xl hover:text-gray-700"
                          onClick={() => {
                            setIsShowDeleteModal((prev) => !prev);
                            setActiveItemId(item.id);
                          }}
                        >
                          <MdDelete />
                        </span>

                        <span className="absolute capitalize left-3 z-[9] top-3 cursor-pointer text-sm text-white bg-blue-600 px-2 py-1 rounded-md">
                          {item.category_name}
                        </span>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_APIURL}${
                            item.image_thumbnail ? item.image_thumbnail : ""
                          }`}
                          alt="cake"
                          fill
                          className="absolute top-0 left-0 object-cover"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={new Date().getTime() + 1 + index}
                      className="col-span-1 p-2"
                    >
                      <div className="relative h-72 w-72 mx-auto">
                        <span
                          className="absolute right-3 z-[9] top-3 bg-white shadow-xl rounded-full p-2 cursor-pointer text-2xl hover:text-gray-700"
                          onClick={() => {
                            setIsShowDeleteModal((prev) => !prev);
                            setActiveItemId(item.id);
                          }}
                        >
                          <MdDelete />
                        </span>

                        <span className="absolute capitalize left-3 z-[9] top-3 cursor-pointer text-sm text-white bg-blue-600 px-2 py-1 rounded-md">
                          {item.category_name}
                        </span>

                        <Video
                          src={item?.video_url || ""}
                          videoThumbnail={item?.yt_thumbnail || ""}
                          className="aspect-square"
                        />
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="col-span-5 text-center">No Items Found!</div>
            )}
          </div>

          <div className="pagination py-2 px-4 sm:px-6 lg:px-8 flex justify-center  bg-white w-full shadow-sm z-[11]">
            <Pagination
              activePage={parseInt(data?.current_page) || 1}
              itemsCountPerPage={9}
              totalItemsCount={data?.total_gallerys || 1}
              pageRangeDisplayed={5}
              onChange={handlePagination}
              innerClass="flex gap-5"
              activeClass="bg-red-500 text-white border-0"
              linkClass="w-full h-full flex items-center justify-center"
              disabledClass="bg-gray-200 text-white border-0 pointer-events-none"
              itemClass="border border-gray-500 rounded-full w-9 h-9 hover:bg-red-500 hover:text-white hover:border-0"
            />
          </div>
        </>
      )}

      <ModalComponent
        popup={true}
        isShow={isShowDeleteModal}
        deleteId={activeItemId}
        onClose={setIsShowDeleteModal}
        itemDelete={handleGalleryDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Gallery;
