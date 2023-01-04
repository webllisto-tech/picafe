import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_APIURL;

export const testimonialPost = async (data, token) => {
  try {
    const res = await axios.post(`${apiUrl}/review/`, data, {
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

export const testimonialGet = async () => {
  try {
    const res = await axios.get(`${apiUrl}/review/`);
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

export const testimonialGetSingle = async (id, token) => {
  try {
    const res = await axios.get(`${apiUrl}/review/${id}/`, {
      headers: {
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

export const testimonialGetSingleUpdate = async (id, data, token) => {
  try {
    const res = await axios.put(`${apiUrl}/review/${id}/`, data, {
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

export const testimonialDelete = async (id, token) => {
  try {
    const res = await axios.delete(`${apiUrl}/review/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};
