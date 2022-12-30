export const useVideoThumbnail = () => {
  return (path, secs, callback) => {
    try {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      video.src = path;
      video.currentTime = 2;
      video.crossOrigin = "anonymous";

      video.addEventListener("loadeddata", () => {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        callback(canvas.toDataURL());
      });
    } catch (error) {
      console.log(error);
    }
  };
};
