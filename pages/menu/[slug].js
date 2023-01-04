import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalComponent from "../../components/Modal";
import { BiCategory } from "react-icons/bi";
import { MdEmojiFoodBeverage } from "react-icons/md";
import Pagination from "react-js-pagination";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
  const [deleteCategoryId, setDeleteCategoryId] = useState(query.slug);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleCreateCategory = async (category) => {
    dispatch(setIsLoad(true));
    const res = await categoryPost(category.toLowerCase(), token);
    setIsShowCreateCategoryModal(false);
    if (res) {
      dispatch(setIsLoad(false));
      router.push(`/menu/${res.data?.id}`);
    }
  };

  const handleCreateItem = async (data, action) => {
    try {
      setIsLoading(true);
      const res = await menuItemPost(data, token);

      if (res.code === "ERR_NETWORK") {
        setIsShowCreateItemModal(false);
        dispatch(setIsLoad(!isLoad));
        toast.error("Network Erorr!");
      }

      if (res.status === 201) {
        setIsShowCreateItemModal(false);
        action.resetForm();
        dispatch(setIsLoad(!isLoad));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await menuDelete(activeItemId, token);
      if (res.status === 204) {
        setIsShow(false);
        dispatch(setIsLoad(!isLoad));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (data, action) => {
    try {
      setIsLoading(true);
      const res = await menuGetSingleUpdate(activeItemId, data, token);
      if (res) {
        setIsShow(false);
        action.resetForm();
        dispatch(setIsLoad(!isLoad));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const res = await categoryDelete(deleteCategoryId, token);
      if (res.status === 204) {
        dispatch(setIsLoad(!isLoad));
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

  const handlePagination = async (page) => {
    setIsLoading(true);
    if (query.slug) {
      const res = await menuItemGet(query.slug, page);
      setMenuItems(res.data);
      setIsLoading(false);
    }
  };

  const formikCreateItem = useFormik({
    initialValues: {
      title: "",
      price: "",
      image: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Please Atleast enter 3 character!")
        .required("Please Fill Field!"),
      image: Yup.mixed()
        .required("Please Select File!")
        .test(
          "fileSize",
          "File Too Large! Max File Size 50MB",
          (file) => file?.size <= 50 * 1000 * 1000
        ),
      description: Yup.string("Add atleast 30 character").required(
        "Please Fill this Field!"
      ),
    }),
    onSubmit: (values, action) => {
      handleCreateItem({ ...values, category: query.slug }, action);
    },
  });

  const formikUpdateItem = useFormik({
    initialValues: {
      title: "",
      price: "",
      image: "",
      description: "",
    },

    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Please Atleast enter 3 character!")
        .required("Please Fill Field!"),
      image: Yup.mixed()
        .required("Please Select File!")
        .test(
          "fileSize",
          "File Too Large! Max File Size 50MB",
          (file) => file?.size <= 50 * 1000 * 1000
        ),
      description: Yup.string("Add atleast 30 character").required(
        "Please Fill this Field!"
      ),
    }),
    onSubmit: (values, action) => {
      handleUpdate({ ...values, category: query.slug }, action);
    },
  });

  const formikCategory = useFormik({
    initialValues: {
      category: "",
    },
    validationSchema: Yup.object({
      category: Yup.string()
        .min(3, "Please Atleast enter 3 character!")
        .required("Please Fill Field!"),
    }),
    onSubmit: (values) => {
      handleCreateCategory(values.category);
    },
  });

  const handleGetSingleItem = async (id) => {
    setActiveItemId(id);
    setIsUpdateLoading(true);
    const res = await menuGetSingle(id, token);
    formikUpdateItem.setValues(res);
    setIsUpdateLoading(false);
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
          const res = await menuItemGet(query.slug, 1);
          setMenuItems(res.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [token, isLoad, query.slug]);

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
            onSubmit={formikCategory.handleSubmit}
            isLoading={isLoading}
            heading="Create Category"
          >
            <div id="create_category">
              <div className="mb-2 block flex-1">
                <TextInput
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formikCategory.values.category}
                  required={true}
                  // onChange={(e) => setCategory(e.target.value)}
                  onChange={formikCategory.handleChange}
                  onBlur={formikCategory.handleBlur}
                />
                <span className="text-red-600 text-sm">
                  {formikCategory.errors ? formikCategory.errors.category : ""}
                </span>
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
          <h2 className="text-xl font-[700]">Menu</h2>
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
            onSubmit={formikCreateItem.handleSubmit}
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
                    // value={menuItemCreate?.title}
                    value={formikCreateItem.values.title}
                    required={true}
                    // onChange={handleInput}
                    onChange={formikCreateItem.handleChange}
                    onBlur={formikCreateItem.handleBlur}
                  />
                  <span className="text-red-600 text-sm">
                    {formikCreateItem.errors
                      ? formikCreateItem.errors.title
                      : ""}
                  </span>
                </div>

                <div className="mb-2 block flex-1">
                  <Label value="Price" htmlFor="price" />
                  <TextInput
                    id="price"
                    type="number"
                    name="price"
                    placeholder="30"
                    // value={menuItemCreate?.price}
                    value={formikCreateItem.values.price}
                    // required={true}
                    // onChange={handleInput}
                    onChange={formikCreateItem.handleChange}
                    onBlur={formikCreateItem.handleBlur}
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
                    // onChange={handleFile}
                    onChange={(e) =>
                      formikCreateItem.setFieldValue("image", e.target.files[0])
                    }
                    onBlur={formikCreateItem.handleBlur}
                    accept=".jpg,.webp,.jpeg,.png"
                    helperText="Allowed Files .jpg,.webp,.jpeg,.png"
                  />
                  <span className="text-red-600 text-sm">
                    {formikCreateItem.errors
                      ? formikCreateItem.errors.image
                      : ""}
                  </span>
                </div>
              </div>

              <div className="mb-2 block flex-1">
                <Label value="Description" htmlFor="description" />
                <Editor
                  key={"uyuygyugu"}
                  // html={menuItemCreate?.description}
                  // setHtml={handleHtml}
                  name="description"
                  html={formikCreateItem.values.description}
                  onChange={(_, editor) =>
                    formikCreateItem.setFieldValue(
                      "description",
                      editor.getData()
                    )
                  }
                />
                <span className="text-red-600 text-sm">
                  {formikCreateItem.errors
                    ? formikCreateItem.errors.description
                    : ""}
                </span>
              </div>
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
            <div className="items_container grid grid-cols-12 gap-8 py-2 px-4 sm:px-6 lg:px-8">
              {menuItems.data?.length > 0 ? (
                menuItems.data.map((item, index) => {
                  return (
                    <Card
                      key={new Date().getTime() + index}
                      edit={true}
                      item={item}
                      setIsPopup={setIsPopup}
                      setIsShow={setIsShow}
                      setActiveItemId={setActiveItemId}
                      handleGetSingleItem={handleGetSingleItem}
                      className="md:col-span-4 sm:col-span-6 col-span-12"
                    >
                      <ul className="list-[square] mx-4 px-5">
                        <li>{item.title}</li>
                        <li>{item.price}</li>
                      </ul>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-12 text-center">No Items Found!</div>
              )}
            </div>

            <div className="pagination py-2 px-4 sm:px-6 lg:px-8 flex justify-center  bg-white w-full shadow-sm z-[11]">
              <Pagination
                activePage={parseInt(menuItems?.current_page?.split("")[0])}
                itemsCountPerPage={9}
                totalItemsCount={menuItems?.total_special_menu}
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
      </div>

      {/* Updata Menu Modal */}
      <ModalComponent
        popup={isPopup}
        isShow={isShow}
        onClose={setIsShow}
        onSubmit={formikUpdateItem.handleSubmit}
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
                  required={true}
                  value={formikUpdateItem.values.title}
                  onChange={formikUpdateItem.handleChange}
                  onBlur={formikUpdateItem.handleBlur}
                />
                <span className="text-red-600 text-sm">
                  {formikCreateItem.errors ? formikUpdateItem.errors.title : ""}
                </span>
              </div>

              <div className="mb-2 block flex-1">
                <Label value="Price" htmlFor="price" />
                <TextInput
                  id="price"
                  type="number"
                  name="price"
                  placeholder="30"
                  value={formikUpdateItem.values.price}
                  required={true}
                  onChange={formikUpdateItem.handleChange}
                  onBlur={formikUpdateItem.handleBlur}
                />
                {formikCreateItem.errors ? formikUpdateItem.errors.price : ""}
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
                  onChange={(e) =>
                    formikUpdateItem.setFieldValue("image", e.target.files[0])
                  }
                  accept=".jpg,.png,.webp,.jpeg"
                  helperText={`${formikUpdateItem.values?.old_img?.slice(
                    0,
                    15
                  )}...${formikUpdateItem.values?.old_img?.slice(
                    formikUpdateItem.values?.old_img.length - 15,
                    formikUpdateItem.values?.old_img.length
                  )}`}
                />
              </div>
              {formikCreateItem.errors ? formikUpdateItem.errors.image : ""}
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Description" htmlFor="description" />
              <Editor
                html={formikUpdateItem.values.description}
                onChange={(_, editor) =>
                  formikUpdateItem.setFieldValue(
                    "description",
                    editor.getData()
                  )
                }
              />
              {formikUpdateItem.errors
                ? formikUpdateItem.errors.description
                : ""}
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
