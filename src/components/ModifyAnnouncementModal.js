import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { DB } from "db/firebase";
import { useEffect, useRef, useState } from "react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ModifyAnnouncementModal = ({
  data,
  show,
  account,
  setData,
  setModal,
  id,
}) => {
  var form = useRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  useEffect(() => {
    if (data) {
      const contentBlock = htmlToDraft(data.content);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [data]);
  if (!show) {
    return null;
  }
  var writeData = async () => {
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["content"] = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    tmp["posted_by"] = account.id;
    tmp["timestamp"] = new Date();
    await DB.updateByUrl("/announcement/" + id, tmp)
      .then(() => {
        alert("編輯完成");
        setData(tmp);
      })
      .catch((error) => {
        alert(error.message);
      });
    setModal(false);
  };
  return (
    <CModal
      show={show}
      size="lg"
      onClose={() => {
        setModal(false);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>編輯公告</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          innerRef={form}
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>主題</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput defaultValue={data.title} name="title" required />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>內容</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <div
                style={{
                  border: "1px solid gray",
                  minHeight: "400px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                <Editor
                  initialEditorState={editorState}
                  editorState={editorState}
                  editorStyle={{ minHeight: "400px" }}
                  onEditorStateChange={(state) => {
                    setEditorState(state);
                  }}
                />
              </div>
            </CCol>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          儲存
        </CButton>{" "}
        <CButton
          color="secondary"
          onClick={() => {
            setModal(false);
          }}
        >
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModifyAnnouncementModal;
