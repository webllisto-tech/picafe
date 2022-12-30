import React, { useEffect, useState } from "react";
import ModalComponent from "../../components/Modal";
import { RiGalleryLine } from "react-icons/ri";
import { galleryDelete, galleryGet, galleryPost } from "../../api/gallery";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Video from "../../components/Video";
import { MdDelete } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { MdEmojiFoodBeverage } from "react-icons/md";
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

const Gallery = () => {
  const [file, setFile] = useState({});
  const [type, setType] = useState("image");
  const [isShowGalleryUpload, setIsShowGalleryUpload] = useState(false);
  const [isShowCreateCategoryModal, setIsShowCreateCategoryModal] = useState();
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isLoad = useSelector((state) => state.loader.isLoad);

  const router = useRouter();
  const { query } = router;
  const galleryCategoryItem = useSelector(
    (state) => state.category.galleryCategoryItem
  );

  const handlePostGallery = async () => {
    try {
      setisLoading(true);
      dispatch(setIsLoad(true));
      const res = await galleryPost(
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

      if (res.status === 201) {
        setIsShowGalleryUpload(false);
        setFile("");
        setType("");
        dispatch(setIsLoad(false));
        setisLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      dispatch(setIsLoad(true));
      const res = await galleryCategoryPost(category.toLowerCase(), token);
      if (res) {
        setIsShowCreateCategoryModal(false);
        dispatch(setIsLoad(false));
        router.push(`/menu/${res.data.id}`);
        setCategory("");
      }
      u;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGalleryCategoryDelete = async () => {
    try {
      dispatch(setIsLoad(true));
      const res = await galleryCategoryDelete(deleteCategoryId, token);
      dispatch(setIsLoad(false));
      console.log(res);
      if (res.status === 204) {
        setIsShowCreateCategoryModal(false);
        if (categoryItem.length > 0) {
          router.push(`/gallery/${galleryCategoryItem[0].id}`);
        } else {
          router.push(`/gallery/create`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const id = galleryCategoryItem.find(
      (item) => item.id === parseInt(query.id)
    )?.id;
    (async () => {
      setisLoading(true);
      const res = await galleryGet(query.id);
      setisLoading(false);
      console.log(res);
      if (res.status === 200) {
        setData(res.data.all_data);
        setDeleteCategoryId(id);
      }
    })();
  }, [galleryCategoryItem, query.id, isLoad]);

  if (isLoading) {
    return (
      <div>
        <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
          <h2 className="text-xl font-[700]">Your Uploads</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setIsShowCreateCategoryModal((prev) => !prev)}
              className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
            >
              <BiCategory className="shrink-0 w-6 h-6" /> Add Category
            </button>

            <button
              onClick={() => setIsShowCreateItemModal((prev) => !prev)}
              className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
            >
              <MdEmojiFoodBeverage className="shrink-0 w-6 h-6" /> Add Item
            </button>
          </div>
          <ModalComponent
            popup={false}
            isShow={isShowCreateCategoryModal}
            onClose={setIsShowCreateCategoryModal}
            onSubmit={handleCreateCategory}
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

        <div className="items_container text-center py-2 px-4 sm:px-6 lg:px-8">
          <Spinner color="failure" />
        </div>
      </div>
    );
  }

  if (query.slug === "create") {
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
        <h2 className="text-xl font-[700]">Your Uploads</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsShowCreateCategoryModal((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
          >
            <BiCategory className="shrink-0 w-6 h-6" /> Add Category
          </button>

          <button
            onClick={() => setIsShowGalleryUpload((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
          >
            <RiGalleryLine className="shrink-0 w-6 h-6" /> Add Item
          </button>

          <ModalComponent
            popup={false}
            isShow={isShowCreateCategoryModal}
            onClose={setIsShowCreateCategoryModal}
            onSubmit={handleCreateCategory}
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
                  value={category}
                  required={true}
                  onChange={(e) => setCategory(e.target.value)}
                />
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

        <ModalComponent
          popup={false}
          isShow={isShowGalleryUpload}
          onClose={setIsShowGalleryUpload}
          onSubmit={handlePostGallery}
          heading="Upload Gallery"
        >
          <div id="create_category">
            <div className="mb-2 block flex-1">
              <Label htmlFor="type" value="Select Your Type" />
              <Select id="type" onChange={(e) => setType(e.target.value)}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Select>
            </div>

            <div className="mb-2 block flex-1">
              <Label htmlFor="catgory" value="Select Your Type" />
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

            <div className="mb-2 block flex-1">
              <Label value="File" htmlFor="" />
              <FileInput
                id="file"
                name={type}
                accept={`${
                  type === "image" ? ".jpg,.webp,.jpeg" : ".mp4,.mpeg,.mov,.avi"
                }`}
                required={true}
                onChange={(e) =>
                  setFile({ [e.target.name]: e.target.files[0] })
                }
              />
            </div>
          </div>
        </ModalComponent>
      </div>
      <div className="mb-4 py-2 px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8">
        {data.length > 0 ? (
          data.map((item, index) => {
            if (item.type === "IMAGE") {
              return (
                <div
                  className="relative col-span-3 aspect-square"
                  key={new Date().getTime() + 1 + index}
                >
                  <span
                    className="absolute right-3 z-[9] top-3 cursor-pointer text-2xl hover:text-gray-700"
                    onClick={() => handleGalleryDelete(item.id)}
                  >
                    <MdDelete />
                  </span>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APIURL}${
                      item.image ? item.image : ""
                    }`}
                    alt="cake"
                    fill
                    className="absolute top-0 left-0 object-cover"
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={new Date().getTime() + 1 + index}
                  className="col-span-3 relative"
                >
                  <span
                    className="absolute right-3 z-[9] top-3 cursor-pointer text-2xl hover:text-gray-700"
                    onClick={() => handleGalleryDelete(item.id)}
                  >
                    <MdDelete />
                  </span>
                  <Video
                    src={`${process.env.NEXT_PUBLIC_APIURL}${
                      item.video ? item.video : ""
                    }`}
                    className="aspect-square"
                    controls
                    // onSeeked={handleVideo}
                  />
                </div>
              );
            }
          })
        ) : (
          <div className="col-span-12 text-center">No Items Found!</div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
