import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const menuItemPost = async (data, token) => {
  try {
    const res = await axios.post(`${apiUrl}/specialmenu/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const menuItemGet = async (id, page) => {
  try {
    const res = await axios.get(
      `${apiUrl}/specialmenu-category/${id}/?page=${page}/`
    );
    return res;
  } catch (error) {
    return error;
  }
};

const changeUrlToByte = async (url) => {
  let res = await fetch(url);
  let file;
  const data = await res.blob();
  if (data.type === "image/png") {
    file = new File([data], "image.png", {
      type: "image/png",
    });
  }

  if (data.type === "application/octet-stream") {
    file = new File([data], "image.webp", {
      type: "application/octet-stream",
    });
  }

  if (data.type === "image/jpg") {
    file = new File([data], "image.jpg", {
      type: "image/jpg",
    });
  }

  if (data.type === "image/jpeg") {
    file = new File([data], "image.jpeg", {
      type: "image/jpeg",
    });
  }

  if (data.type === "application/pdf") {
    file = new File([data], "myFile.pdf", {
      type: "application/pdf",
    });
  }
  return file;
};

export const menuGetSingle = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/specialmenu/${id}/`);
    return {
      ...res.data,
      image: await changeUrlToByte(`${apiUrl}${res.data.image}`),
      old_img: res.data.image,
    };
  } catch (error) {
    return error;
  }
};

export const menuGetSingleUpdate = async (id, data, token) => {
  try {
    const res = await axios.put(`${apiUrl}/specialmenu/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...res.data,
      image: await changeUrlToByte(`${apiUrl}${res.data.image}`),
    };
  } catch (error) {
    return error;
  }
};

export const menuDelete = async (id, token) => {
  try {
    const res = await axios.delete(`${apiUrl}/specialmenu/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};
