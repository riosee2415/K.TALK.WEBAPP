import React, { useState, forwardRef, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Button } from "antd";
import { Wrapper } from "../commonComponents";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import backURL from "../../config/config";
import axios from "axios";

const EditorWrapper = styled(Wrapper)`
  & > div {
    width: 90%;
  }

  & > div {
    height: 500px !important;
  }
`;

const Editor = dynamic(() => import("./WrappedEditor"), { ssr: false });
// 2. Pass down to child components using forwardRef
const EditorWithForwardedRef = React.forwardRef((props, ref) => (
  <Editor {...props} forwardedRef={ref} />
));

const ToastEditorComponent = (props) => {
  const dispatch = useDispatch();
  const { heightMin, onChange } = props;

  const editorRef = useRef(null);

  const handleChange = useCallback(() => {
    if (!editorRef.current) {
      return;
    }

    const instance = editorRef.current.getInstance();
    onChange(instance.getHTML()); // maximum call stack error at the moment(2021.07.02)
  }, [editorRef, onChange]);

  const uploadImage = useCallback(async (blob) => {
    const formData = new FormData();

    formData.append("image", blob);
    formData.append("path", "issue");

    const result = await axios.post(`${backURL}/api/edit/image`, formData);

    return result.data.path;
  }, []);

  const getContentInEditor = () => {
    props.action(editorRef.current.getInstance().getHTML());
    return editorRef.current.getInstance().getHTML();
  };

  return (
    <>
      <EditorWrapper margin="20px 0px">
        <EditorWithForwardedRef
          {...props}
          placeholder={props.placeholder || "내용을 입력해주세요."}
          previewStyle="vertical"
          setHeight="600px"
          initialEditType="wysiwyg"
          //   initialEditType="markdown"
          useCommandShortcut={true}
          ref={editorRef}
          hideModeSwitch={true}
          hooks={{
            addImageBlobHook: async (blob, callback) => {
              const uploadedImageURL = await uploadImage(blob);
              callback(uploadedImageURL, "alt text");
              return false;
            },
          }}
          events={{
            load: function (param) {
              setEditor(param);
            },
            change: handleChange,
            keydown: function (editorType, event) {
              if (event.which === 13 && tributeRef.current.isActive) {
                return false;
              }
            },
          }}
        />
      </EditorWrapper>

      <Wrapper margin="10px 0px" dr="row" ju="flex-end" width="90%">
        <Button type="primary" onClick={getContentInEditor}>
          작성하기
        </Button>
      </Wrapper>
    </>
  );
};

export default ToastEditorComponent;
