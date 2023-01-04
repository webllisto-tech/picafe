import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

const Editor = ({ html, onChange }) => {
  const editor = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const { CKEditor, ClassicEditor } = editor.current || {};

  useEffect(() => {
    editor.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../../utils/ckeditor"),
    };

    setIsLoading(false);
  }, []);

  return (
    <div className={`${styles.editor_wrp} w-full`}>
      {!isLoading ? (
        <CKEditor editor={ClassicEditor} data={html} onChange={onChange} />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Editor;
