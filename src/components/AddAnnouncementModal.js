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
import { firebase } from "db/firebase";
import { useRef, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const AddAnnouncementModal = ({ data, show, account, setData, setModal }) => {
  var form = useRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  if (!show) {
    return null;
  }
  var writeData = async () => {
    var cur_data = data;
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["content"] = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    tmp["posted_by"] = account.id;
    tmp["timestamp"] = new Date();
    cur_data.push(tmp);
    await firebase
      .firestore()
      .collection("announcement")
      .add(tmp)
      .then(() => {
        alert("新增完成");
        setData(cur_data);
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
        <CModalTitle>新增公告</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          innerRef={form}
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>主題</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="title" required />
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
          新增
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

export default AddAnnouncementModal;
