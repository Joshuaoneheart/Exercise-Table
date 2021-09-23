import React, { useContext, useState } from "react";
import {
  CButton,
  CCol,
  CCardHeader,
  CRow,
  CCard,
  CCardBody,
  CCardFooter,
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
import Select from "react-select";
import { loading } from "src/reusable";
import { AccountContext, GetWeeklyBase } from "src/App";
import {
  FirestoreDocument,
  FirestoreCollection,
  FirestoreBatchedWrite,
} from "@react-firebase/firestore";

const AddModal = (props) => {
  if (props.show == null) {
    return null;
  }
  var form = React.createRef();
  var writeData = () => {
    var data = props.data;
    var tmp = {};
    tmp["name"] = form.current.elements.name.value;
    tmp["note"] = form.current.elements.note.value;
    data.push(tmp);
    props.setData(data);
    props.setModal(null);
  };
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>新增牧養對象</CModalTitle>
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
              <CLabel>姓名</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="name" required />
            </CCol>
          </CFormGroup>
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>備註</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="note" required />
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
            props.setModal(null);
          }}
        >
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const GFFormContent = (props) => {
  const titles = ["家聚會", "小排", "主日聚會"];
  var account = props.account;
  let default_selected = [];
  for (let i in titles) {
    var d = props.default_data;
    if (d && d.value) default_selected.push(new Set(d.value[titles[i]]));
    else default_selected.push(new Set());
  }
  var [selected, set_selected] = useState(default_selected);
  const [addModal, setAddModal] = useState(null);
  const [GFs, setGFs] = useState(props.data.value);
  var inputs = [];
  for (let i = 0; i < titles.length; i++) {
    var selected_options = [];
    var GF_options = [];
    for (var j = 0; j < GFs.length; j++) {
      if (selected[i].has(GFs[j].id)) {
        GF_options.push({
          value: GFs[j].id,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
        });
        selected_options.push({
          value: GFs[j].id,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
        });
      } else
        GF_options.push({
          value: GFs[j].id,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b> <span>{"      " + GFs[j].note}</span>
            </span>
          ),
        });
    }
    inputs.push(
      <CFormGroup key={i}>
        <CLabel>{titles[i]}</CLabel>
        <Select
          value={selected_options}
          defaultValue={selected_options}
          isMulti
          autoFocus
          options={GF_options}
          onChange={function (set_selected, selected, i, value) {
            var tmp = new Set();
            for (let v of value) {
              tmp.add(v.value);
            }
            selected[i] = tmp;
            set_selected(Array.from(selected));
          }.bind(null, set_selected, selected, i)}
        />
      </CFormGroup>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol style={{ fontSize: "30px" }}>牧養對象邀約</CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          {inputs}
        </CForm>

        <AddModal
          data={GFs}
          setData={setGFs}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <CButton
          variant="ghost"
          color="primary"
          onClick={function (setAddModal) {
            setAddModal(true);
          }.bind(null, setAddModal)}
        >
          新增牧養對象
        </CButton>
        <FirestoreBatchedWrite>
          {({ addMutationToBatch, commit }) => {
            return (
              <CButton
                variant="ghost"
                color="dark"
                onClick={() => {
                  for (let i = 0; i < GFs.length; i++) {
                    if (!("id" in GFs[i]))
                      addMutationToBatch({
                        path: "/GF",
                        value: GFs[i],
                        type: "add",
                      });
                  }
                  var v = {};
                  for (let i = 0; i < selected.length; i++) {
                    if (selected[i]) v[titles[i]] = Array.from(selected[i]);
                  }
                  addMutationToBatch({
                    path: "/accounts/" + account.id + "/GF/" + GetWeeklyBase(),
                    value: v,
                    type: "set",
                  });
                  commit()
                    .then(() => {
                      alert("儲存完成");
                    })
                    .catch((error) => {
                      alert(error.message);
                    });
                }}
              >
                提交表單
              </CButton>
            );
          }}
        </FirestoreBatchedWrite>
      </CCardFooter>
    </CCard>
  );
};

const GFForm = () => {
  const account = useContext(AccountContext);
  return (
    <CRow>
      <CCol>
        <FirestoreDocument
          path={"/accounts/" + account.id + "/GF/" + GetWeeklyBase()}
        >
          {(default_data) => {
            if (default_data.isLoading) return loading;
            return (
              <FirestoreCollection path="/GF/">
                {(d) => {
                  if (d.isLoading) return loading;
                  if (
                    d != null &&
                    typeof d != "undefined" &&
                    typeof d.value != "undefined"
                  ) {
                    for (var i = 0; i < d.value.length; i++) {
                      d.value[i]["id"] = d.ids[i];
                    }
                    return (
                      <GFFormContent
                        default_data={default_data}
                        data={d}
                        account={account}
                      />
                    );
                  } else return null;
                }}
              </FirestoreCollection>
            );
          }}
        </FirestoreDocument>
      </CCol>
    </CRow>
  );
};

export default GFForm;
