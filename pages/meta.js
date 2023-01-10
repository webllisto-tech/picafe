import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import ModalComponent from "../components/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label, TextInput, Table, Spinner, Tooltip } from "flowbite-react";
import {
  metaDelete,
  metaGet,
  metaGetSingle,
  metaPost,
  metaUpdate,
} from "../api/meta";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoad } from "../redux/features/LoaderSlice";
import { RxUpdate } from "react-icons/rx";
import { MdDelete } from "react-icons/md";

const Meta = () => {
  const [isShowAddMeta, setIsShowAddMeta] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false);
  const [activeItemId, setActiveItemId] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const isLoad = useSelector((state) => state.loader.isLoad);

  const handleDelete = async () => {
    const res = await metaDelete(activeItemId, token);
    console.log(res);
    if (res?.status === 204) {
      dispatch(setIsLoad(!isLoad));
      setIsShow(false);
      toast.success("Delete Successfully");
    }

    if (res.code === "ERR_NETWORK") {
      dispatch(setIsLoad(!isLoad));
      toast.error("Network Error!");
    }

    if (res.code === "ERR_BAD_REQUEST" || res.code === "ERR_BAD_RESPONSE") {
      dispatch(setIsLoad(!isLoad));
      toast.error("Bad Request!");
    }
  };

  const handleUpdataMeta = async (values, action) => {
    const res = await metaUpdate(values, activeItemId, token);
    setIsLoading(true);
    if (res?.status === 200) {
      setIsShow(false);
      dispatch(setIsLoad(!isLoad));
      toast.success("Update Successfully");
    }

    if (res.code === "ERR_NETWORK") {
      dispatch(setIsLoad(!isLoad));
      setIsShow(false);
      toast.error("Network Error!");
    }

    if (res.code === "ERR_BAD_REQUEST" || res.code === "ERR_BAD_RESPONSE") {
      dispatch(setIsLoad(!isLoad));
      setIsShow(false);
      toast.error("Bad Request!");
    }
  };

  const handleGetSingleItem = async (id) => {
    setActiveItemId(id);
    setIsUpdateLoading(true);
    const res = await metaGetSingle(id);

    if (res.code === "ERR_NETWORK") {
      dispatch(setIsLoad(!isLoad));
      toast.error("Network Error!");
    }

    if (res.code === "ERR_BAD_REQUEST" || res.code === "ERR_BAD_RESPONSE") {
      dispatch(setIsLoad(!isLoad));
      toast.error("Bad Request!");
    }

    if (res?.status === 200) {
      metaFormikUpdate.setValues(res.data);
      setIsUpdateLoading(false);
    }
  };

  const handleCreateMeta = async (values, action) => {
    setIsLoading(true);
    const res = await metaPost(values, token);
    if (res?.status === 201) {
      setData(res.data);
      dispatch(setIsLoad(!isLoad));
      setIsShowAddMeta(false);
      action.resetForm();
      toast.success("Created Successfully");
    }

    if (res.code === "ERR_NETWORK") {
      dispatch(setIsLoad(!isLoad));
      toast.error("Network Error!");
    }

    if (res.code === "ERR_BAD_REQUEST" || res.code === "ERR_BAD_RESPONSE") {
      dispatch(setIsLoad(!isLoad));
      toast.error("Bad Request!");
    }
  };

  const metaFormik = useFormik({
    initialValues: {
      page_name: "",
      title: "",
      keyword: "",
      description: "",
    },

    validationSchema: Yup.object({
      page_name: Yup.string()
        .min(3, "Atleast 3 character")
        .required("This Field is required"),
      title: Yup.string()
        .min(3, "Atleast 3 character")
        .required("This Field is required"),
      keyword: Yup.string()
        .min(3, "Atleast 3 character")
        .required("This Field is required"),
      description: Yup.string()
        .min(15, "Atleast 15 character")
        .required("This Field is required"),
    }),

    onSubmit: (values, action) => {
      handleCreateMeta(values, action);
    },
  });

  const metaFormikUpdate = useFormik({
    initialValues: {
      page_name: "",
      title: "",
      keyword: "",
      description: "",
    },

    validationSchema: Yup.object({
      page_name: Yup.string()
        .min(3, "Atleast 3 character")
        .required("This Field is required"),
      title: Yup.string()
        .min(3, "Atleast 3 character")
        .required("This Field is required"),
      keyword: Yup.string()
        .min(3, "Atleast 3 character")
        .required("This Field is required"),
      description: Yup.string()
        .min(15, "Atleast 15 character")
        .required("This Field is required"),
    }),

    onSubmit: (values, action) => {
      handleUpdataMeta(values, action);
    },
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await metaGet();
      if (res?.status === 200) {
        setData(res.data);
      }

      if (res?.response?.status === 500) {
        toast.error("Some error occured!");
      }
      setIsLoading(false);
    })();
  }, [isLoad]);

  return (
    <div>
      <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
        <h2 className="text-xl font-[700]">Your Page Meta</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsShowAddMeta((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
          >
            <IoIosAddCircleOutline className="shrink-0 w-6 h-6" /> New
          </button>
        </div>

        <ModalComponent
          isShow={isShowAddMeta}
          onClose={setIsShowAddMeta}
          onSubmit={metaFormik.handleSubmit}
          isLoading={isLoading}
          heading="Upload Meta"
        >
          <div className="mb-2 block flex-1">
            <Label value="Page Name" htmlFor="page_name" />
            <TextInput
              id="page_name"
              type="text"
              name="page_name"
              placeholder="Page Name"
              value={metaFormik.values.page_name}
              required={true}
              onChange={metaFormik.handleChange}
              onBlur={metaFormik.handleBlur}
            />
            <span className="text-red-600 text-sm">
              {metaFormik.errors ? metaFormik.errors.page_name : ""}
            </span>
          </div>

          <div className="mb-2 block flex-1">
            <Label value="Meta Title" htmlFor="title" />
            <TextInput
              id="title"
              type="text"
              name="title"
              placeholder="Meta Title"
              value={metaFormik.values.title}
              required={true}
              onChange={metaFormik.handleChange}
              onBlur={metaFormik.handleBlur}
            />
            <span className="text-red-600 text-sm">
              {metaFormik.errors ? metaFormik.errors.title : ""}
            </span>
          </div>

          <div className="mb-2 block flex-1">
            <Label value="Meta Keyword" htmlFor="keyword" />
            <TextInput
              id="keyword"
              type="text"
              name="keyword"
              placeholder="Meta Keyword"
              value={metaFormik.values.keyword}
              required={true}
              helperText={"Each Keyword seprate with ,"}
              onChange={metaFormik.handleChange}
              onBlur={metaFormik.handleBlur}
            />
            <span className="text-red-600 text-sm">
              {metaFormik.errors ? metaFormik.errors.keyword : ""}
            </span>
          </div>

          <div className="mb-2 block flex-1">
            <Label value="Meta Description" htmlFor="description" />
            <TextInput
              id="description"
              type="text"
              name="description"
              placeholder="Meta Title"
              value={metaFormik.values.description}
              required={true}
              onChange={metaFormik.handleChange}
              onBlur={metaFormik.handleBlur}
            />
            <span className="text-red-600 text-sm">
              {metaFormik.errors ? metaFormik.errors.description : ""}
            </span>
          </div>
        </ModalComponent>
      </div>

      <div className="px-4">
        <div className="contact_wrp">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>S.No</Table.HeadCell>
              <Table.HeadCell>Page Name</Table.HeadCell>
              <Table.HeadCell>Meta Title</Table.HeadCell>
              <Table.HeadCell>Meta Keyword</Table.HeadCell>
              <Table.HeadCell>Meta Description</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>

            {isLoading ? (
              <>
                <Table.Body className="divide-y">
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center">
                      <Spinner color="info" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ) : (
              <Table.Body className="divide-y">
                {data?.length > 0 ? (
                  data.map((item, index) => {
                    return (
                      <Table.Row
                        key={new Date().getTime() + index + 1}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{item?.page_name}</Table.Cell>
                        <Table.Cell>{item?.title}</Table.Cell>
                        <Table.Cell>{item?.keyword}</Table.Cell>
                        <Table.Cell>{item?.description}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-4">
                            <div
                              className="p-2"
                              onClick={() => {
                                setIsShow(true);
                                setIsPopUp(false);
                                handleGetSingleItem(item?.id);
                              }}
                            >
                              <Tooltip content="Update">
                                <RxUpdate className="text-xl cursor-pointer" />
                              </Tooltip>
                            </div>

                            <div
                              className="p-2"
                              onClick={() => {
                                setIsShow(true);
                                setIsPopUp(true);
                                setActiveItemId(item.id);
                              }}
                            >
                              <Tooltip content="Delete">
                                <MdDelete className="text-xl cursor-pointer" />
                              </Tooltip>
                            </div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center">
                      No Data Found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            )}
          </Table>
        </div>
      </div>

      <ModalComponent
        popup={isPopUp}
        isShow={isShow}
        onClose={setIsShow}
        onSubmit={metaFormikUpdate.handleSubmit}
        itemDelete={handleDelete}
        deleteId={activeItemId}
        heading="Update Your Meta"
        isLoading={isLoading}
      >
        {!isUpdateLoading ? (
          <>
            <div className="mb-2 block flex-1">
              <Label value="Page Name" htmlFor="page_name" />
              <TextInput
                id="page_name"
                type="text"
                name="page_name"
                placeholder="Page Name"
                value={metaFormikUpdate.values.page_name}
                required={true}
                onChange={metaFormikUpdate.handleChange}
                onBlur={metaFormikUpdate.handleBlur}
              />
              <span className="text-red-600 text-sm">
                {metaFormikUpdate.errors
                  ? metaFormikUpdate.errors.page_name
                  : ""}
              </span>
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Meta Title" htmlFor="title" />
              <TextInput
                id="title"
                type="text"
                name="title"
                placeholder="Meta Title"
                value={metaFormikUpdate.values.title}
                required={true}
                onChange={metaFormikUpdate.handleChange}
                onBlur={metaFormikUpdate.handleBlur}
              />
              <span className="text-red-600 text-sm">
                {metaFormikUpdate.errors ? metaFormikUpdate.errors.title : ""}
              </span>
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Meta Keyword" htmlFor="keyword" />
              <TextInput
                id="keyword"
                type="text"
                name="keyword"
                placeholder="Meta Keyword"
                value={metaFormikUpdate.values.keyword}
                required={true}
                helperText={"Each Keyword seprate with ,"}
                onChange={metaFormikUpdate.handleChange}
                onBlur={metaFormikUpdate.handleBlur}
              />
              <span className="text-red-600 text-sm">
                {metaFormikUpdate.errors ? metaFormikUpdate.errors.keyword : ""}
              </span>
            </div>

            <div className="mb-2 block flex-1">
              <Label value="Meta Description" htmlFor="description" />
              <TextInput
                id="description"
                type="text"
                name="description"
                placeholder="Meta Title"
                value={metaFormikUpdate.values.description}
                required={true}
                onChange={metaFormikUpdate.handleChange}
                onBlur={metaFormikUpdate.handleBlur}
              />
              <span className="text-red-600 text-sm">
                {metaFormikUpdate.errors
                  ? metaFormikUpdate.errors.description
                  : ""}
              </span>
            </div>
          </>
        ) : (
          <>Loading...</>
        )}
      </ModalComponent>
    </div>
  );
};

export default Meta;
