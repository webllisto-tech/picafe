import React, { useState, useEffect } from "react";
import { CgAdd } from "react-icons/cg";
import Card from "../Card";
import ModalComponent from "../Modal";
import { FileInput } from "flowbite-react";
import { bannerDelete, bannerGet, bannerPost } from "../../api/bannerupload";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoad } from "../../redux/features/LoaderSlice";
import { toast } from "react-toastify";

const BannerUploads = () => {
  const [isShowUploadModal, setIsShowUploadModal] = useState(false);
  const [bannerUploadGetData, setBannerUploadGetData] = useState([]);
  const [image, setImage] = useState({});
  const [activeItemId, setActiveItemId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const isLoad = useSelector((state) => state.loader.isLoad);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleBannerUpload = async (e) => {
    e.preventDefault();
    dispatch(setIsLoad(true));
    const data = new FormData();
    data.append("image", image);
    const res = await bannerPost(data, token);
    if (res) {
      toast.success("Uploaded Successfully!");
      setIsShowUploadModal(false);
      setImage("");
      document.getElementById("file").value = "";
      dispatch(setIsLoad(false));
    }
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    try {
      dispatch(setIsLoad(true));
      const res = await bannerDelete(id, token);
      if (res) {
        setIsShow(false)
        toast.success("Deleted Successfully!");
      }
      dispatch(setIsLoad(false));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await bannerGet();
      setBannerUploadGetData(res.data);
      console.log(res.data);
      setIsLoading(false);
    })();
  }, [isLoad]);

  if (isLoading) {
    return (
      <div className="banner_uploads_wrp text-center">
        <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
          <h2 className="text-xl font-[700]">Your Uploads</h2>

          <button
            onClick={() => setIsShowUploadModal((prev) => !prev)}
            className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
          >
            <CgAdd className="shrink-0 w-6 h-6" /> Add New
          </button>
          <ModalComponent
            popup={false}
            isShow={isShowUploadModal}
            onClose={setIsShowUploadModal}
            onSubmit={handleBannerUpload}
            heading="Upload file"
          >
            <div id="fileUpload">
              <FileInput
                id="file"
                name="image"
                onChange={handleFile}
                accept=".jpg,.webp,.jpeg,.mp4,.mpeg,.mov,.avi"
                helperText="Allowed Files .jpg,.webp,.jpeg,.mp4,.mpeg,.mov,.avi"
              />
            </div>
          </ModalComponent>
        </div>

        <div className="banner_uploads_container px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="banner_uploads_wrp">
      <div className="header mb-4 py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-[64px] z-[10] bg-white">
        <h2 className="text-xl font-[700]">Your Uploads</h2>

        <button
          onClick={() => setIsShowUploadModal((prev) => !prev)}
          className="flex items-center justify-center gap-2 bg-red-400 text-white py-1 px-2 rounded-full hover:bg-red-500"
        >
          <CgAdd className="shrink-0 w-6 h-6" /> Add New
        </button>
        <ModalComponent
          popup={false}
          isShow={isShowUploadModal}
          onClose={setIsShowUploadModal}
          onSubmit={handleBannerUpload}
          heading="Upload file"
        >
          <div id="fileUpload">
            <FileInput
              id="file"
              name="image"
              onChange={handleFile}
              accept=".jpg,.webp,.jpeg,.mp4,.mpeg,.mov,.avi"
              helperText="Allowed Files .jpg,.webp,.jpeg,.mp4,.mpeg,.mov,.avi"
            />
          </div>
        </ModalComponent>
      </div>

      <div className="banner_uploads_container px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8">
        {bannerUploadGetData.length > 0 ? (
          bannerUploadGetData.map((item, index) => {
            return (
              <Card
                key={new Date().getTime() + index}
                edit={false}
                item={item}
                setIsPopup={setIsPopup}
                setIsShow={setIsShow}
                setActiveItemId={setActiveItemId}
                className="md:col-span-3 sm:col-span-6 col-span-12"
              />
            );
          })
        ) : (
          <div className="col-span-12 text-center">Upload Your Banners</div>
        )}

        <ModalComponent
          popup={isPopup}
          isShow={isShow}
          onClose={setIsShow}
          itemDelete={handleDelete}
          deleteId={activeItemId}
        />
      </div>
    </div>
  );
};

export default BannerUploads;
