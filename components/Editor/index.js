import React, { useLayoutEffect, useRef, useState } from "react";

const Editor = ({ html, setHtml }) => {
  const editor = useRef();
  const [isLoad, setIsLoad] = useState(false);
  const { CKEditor, ClassicEditor } = editor.current || {};

  useLayoutEffect(() => {
    editor.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };

    setIsLoad(true);

    return () => {
      editor.current = {
        CKEditor: null,
        ClassicEditor: null,
      };
    };
  }, []);

  return (
    <div className="editor_wrp w-full">
      {isLoad ? (
        <CKEditor
          editor={ClassicEditor}
          data={html}
          onChange={(event, editor) => {
            setHtml(editor.getData());
          }}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Editor;
