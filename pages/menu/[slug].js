import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalComponent from "../../components/Modal";
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
import { categoryDelete, categoryPost } from "../../api/category";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoad } from "../../redux/features/LoaderSlice";
import {
  menuDelete,
  menuGetSingle,
  menuGetSingleUpdate,
  menuItemGet,
  menuItemPost,
} from "../../api/menuItem";
import Card from "../../components/Card";
import Editor from "../../components/Editor";

const Menu = () => {
  const { query } = useRouter();
  const token = useSelector((state) => state.auth.token);
  const isLoad = useSelector((state) => state.loader.isLoad);
  const categoryItem = useSelector((state) => state.category.categoryItem);

  const [activeItemId, setActiveItemId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [isShowCreateCategoryModal, setIsShowCreateCategoryModal] =
    useState(false);

  const [isShowCreateItemModal, setIsShowCreateItemModal] = useState(false);
  const [category, setCategory] = useState("");

  const [menuItemCreate, setMenuItemCreate] = useState({});

  const [deleteCategoryId, setDeleteCategoryId] = useState(query.slug);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleInput = (e) => {
    setMenuItemCreate({ ...menuItemCreate, [e.target.name]: e.target.value });
  };

  const handleHtml = (data) => {
    setMenuItemCreate((prev) => ({ ...prev, description: data }));
  };

  const handleFile = (e) => {
    setMenuItemCreate({
      ...menuItemCreate,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleCreateCategory = async () => {
    dispatch(setIsLoad(true));
    const res = await categoryPost(category.toLowerCase(), token);
    if (res) {
      setIsShowCreateCategoryModal(false);
      dispatch(setIsLoad(false));
      router.push(`/menu/${res.data.id}`);
      setCategory("");
    }
  };

  const handleCreateItem = async () => {
    try {
      dispatch(setIsLoad(true));
      setIsLoading(true);
      const res = await menuItemPost(
        { ...menuItemCreate, category: query.slug },
        token
      );
      if (res.status === 201) {
        setMenuItemCreate({});
        dispatch(setIsLoad(false));
        setIsLoading(false);
        setIsShowCreateItemModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      dispatch(setIsLoad(true));
      const res = await menuDelete(activeItemId, token);
      if (res.status === 204) {
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
      const res = await menuGetSingleUpdate(
        activeItemId,
        menuItemCreate,
        token
      );
      if (res) {
        setIsShow(false);
        dispatch(setIsLoad(false));
        setIsLoading(false);
        setMenuItemCreate({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSingleItem = async (id) => {
    setActiveItemId(id);
    setIsUpdateLoading(true);
    const res = await menuGetSingle(id, token);
    setMenuItemCreate(res);
    setIsUpdateLoading(false);
  };

  const handleDeleteCategory = async () => {
    try {7
      dispatch(setIsLoad(true));
      const res = await categoryDelete(deleteCategoryId, token);
      dispatch(setIsLoad(false));
      console.log(res);
      if (res.status === 204) {
        setIsShowCreateCategoryModal(false);
        if (categoryItem.length > 0) {
          router.push(`/menu/${categoryItem[0].id}`);
        } else {
          router.push(`/menu/create`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const id = categoryItem.find(
      (item) => item.id === parseInt(query.slug)
    )?.id;
    setDeleteCategoryId(id);
  }, [query, categoryItem]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (query.slug) {
          const res = await menuItemGet(query.slug, token);
          setMenuItems(res.data.all_data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [token, isLoad, query.slug]);

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
              onClick={() => setIsShowCreateItemModal((prev) => !prev)}
              className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
            >
              <MdEmojiFoodBeverage className="shrink-0 w-6 h-6" /> Add Item
            </button>
          </div>

          {/* Create And Delete Category Modal */}
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
                    {categoryItem.map((item, id) => {
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
                  <Button color={"failure"} onClick={handleDeleteCategory}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </ModalComponent>

          {/* Create Menu Modal */}
          <ModalComponent
            popup={false}
            isShow={isShowCreateItemModal}
            onClose={setIsShowCreateItemModal}
            onSubmit={handleCreateItem}
            heading="Create Menu Item"
            isLoading={isLoading}
          >
            <div id="create_category">
              <div className="flex gap-2">
                <div className="mb-2 block flex-1">
                  <Label value="Title" htmlFor="title" />
                  <TextInput
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Item Name"
                    value={menuItemCreate?.title}
                    required={true}
                    onChange={handleInput}
                  />
                </div>

                <div className="mb-2 block flex-1">
                  <Label value="Price" htmlFor="price" />
                  <TextInput
                    id="price"
                    type="number"
                    name="price"
                    placeholder="30"
                    value={menuItemCreate?.price}
                    required={true}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="mb-2 block flex-1">
                  <Label value="Category" htmlFor="category" />
                  <TextInput
                    id="category"
                    type="text"
                    name="category"
                    placeholder="Your Category"
                    disabled
                    value={categoryItem
                      .find((item) => item.id === parseInt(query.slug))
                      ?.name.toUpperCase()}
                  />
                </div>

                <div className="mb-2 block flex-1">
                  <Label value="Image" htmlFor="file" />
                  <FileInput
                    id="file"
                    name="image"
                    onChange={handleFile}
                    accept=".jpg,.webp,.jpeg,.png"
                    helperText="Allowed Files .jpg,.webp,.jpeg,.png"
                  />
                </div>
              </div>

              <div className="mb-2 block flex-1">
                <Label value="Description" htmlFor="description" />
                <Editor
                  html={menuItemCreate?.description}
                  setHtml={handleHtml}
                />
              </div>
            </div>
          </ModalComponent>
        </div>

        <div className="items_container grid grid-cols-12 gap-8 py-2 px-4 sm:px-6 lg:px-8">
          {menuItems?.length > 0 ? (
            menuItems.map((item, index) => {
              return (
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
                    <li>{item.price}</li>
                    <li>{item.category_name}</li>
                  </ul>
                </Card>
              );
            })
          ) : (
            <div className="col-span-12 text-center">No Items Found!</div>
          )}
        </div>
      </div>

      {/* Updata Menu Modal */}
      <ModalComponent
        popup={isPopup}
        isShow={isShow}
        onClose={setIsShow}
        onSubmit={handleUpdate}
        itemDelete={handleDelete}
        deleteId={activeItemId}
        heading="Update Menu Item"
        isLoading={isLoading}
      >
        {!isUpdateLoading ? (
          <div id="create_category">
            <div className="flex gap-2">
              <div className="mb-2 block flex-1">
                <Label value="Title" htmlFor="title" />
                <TextInput
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Item Name"
                  value={menuItemCreate?.title}
                  required={true}
                  onChange={handleInput}
                />
              </div>

              <div className="mb-2 block flex-1">
                <Label value="Price" htmlFor="price" />
                <TextInput
                  id="price"
                  type="number"
                  name="price"
                  placeholder="30"
                  value={menuItemCreate?.price}
                  required={true}
                  onChange={handleInput}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="mb-2 block flex-1">
                <Label value="Category" htmlFor="category" />
                <TextInput
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Your Category"
                  disabled
                  value={categoryItem
                    .find((item) => item.id === parseInt(query.slug))
                    ?.name.toUpperCase()}
                />
              </div>

              <div className="mb-2 block flex-1">
                <Label value="Image" htmlFor="file" />
                <FileInput
                  id="file"
                  name="image"
                  onChange={handleFile}
                  accept=".jpg,.png,.webp,.jpeg"
                  helperText={`${menuItemCreate?.old_img?.slice(
                    0,
                    15
                  )}...${menuItemCreate?.old_img?.slice(
                    menuItemCreate?.old_img.length - 15,
                    menuItemCreate?.old_img.length
                  )}`}
                />
              </div>
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Description" htmlFor="description" />
              <Editor html={menuItemCreate?.description} setHtml={handleHtml} />
            </div>
          </div>
        ) : (
          <>Loading...</>
        )}
      </ModalComponent>
    </>
  );
};

export default Menu;
