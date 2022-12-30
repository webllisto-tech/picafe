import React, { useLayoutEffect, useRef, useState } from "react";

const Editor = ({ html, setHtml }) => {
  const editor = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { CKEditor, ClassicEditor } = editor.current || {};

  useLayoutEffect(() => {
    editor.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../../utils/ckeditor"),
    };

    setIsLoading(true);

    return () => {
      editor.current = {
        CKEditor: null,
        ClassicEditor: null,
      };
    };
  }, []);

  return (
    <div className="editor_wrp w-full">
      {isLoading && CKEditor && ClassicEditor ? (
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
