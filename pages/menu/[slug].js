import React, { useState } from "react";
import { useRouter } from "next/router";
import ModalComponent from "../../components/Modal";
import { BiCategory } from "react-icons/bi";
import { MdEmojiFoodBeverage } from "react-icons/md";
import { Label, TextInput } from "flowbite-react";
import { categoryPost } from "../../api/category";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoad } from "../../redux/features/LoaderSlice";

const Menu = () => {
  const { query } = useRouter();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isShowCreateCategoryModal, setIsShowCreateCategoryModal] =
    useState(false);

  const [isShowCreateItemModal, setIsShowCreateItemModal] = useState(false);
  const [category, setCategory] = useState("");

  const handleCreateCategory = async () => {
    dispatch(setIsLoad(true));
    const res = await categoryPost(category.toLowerCase(), token);
    if (res) {
      setIsShowCreateCategoryModal(false);
      dispatch(setIsLoad(false));
      router.push(`/menu/${category.toLowerCase()}`);
      setCategory("");
    }
  };

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
    <>
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
              onClick={() => setIsShowCreateCategoryModal((prev) => !prev)}
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
      </div>
    </>
  );
};

export default Menu;
