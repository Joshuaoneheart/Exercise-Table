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
import { firebase } from "src/App";
import "firebase/firestore";
import {
  FirestoreDocument,
  FirestoreCollection,
} from "@react-firebase/firestore";

const AddModal = (props) => {
  var form = React.useRef();
  if (props.show == null) {
    return null;
  }
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
  const [GFs, setGFs] = useState(props.data.value);
  const [addModal, setAddModal] = useState(null);
  let default_selected = [];
  function findID(id) {
    for (let i = 0; i < GFs.length; i++) {
      if (id === GFs[i].id) return i;
    }
    return -1;
  }
  for (let i in titles) {
    var d = props.default_data;
    if (d && d.value)
      default_selected.push(new Set(d.value[titles[i]].map(findID)));
    else default_selected.push(new Set());
  }
  var [selected, set_selected] = useState(default_selected);
  var inputs = [];
  for (let i = 0; i < titles.length; i++) {
    var selected_options = [];
    var GF_options = [];
    for (var j = 0; j < GFs.length; j++) {
      if (!GFs[j]) continue;
      else if (selected[i].has(j)) {
        GF_options.push({
          value: j,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
        });
        selected_options.push({
          value: j,
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
        });
      } else
        GF_options.push({
          value: j,
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
          defaultMenuIsOpen={false}
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
        <CButton
          variant="ghost"
          color="dark"
          onClick={() => {
            var saveChange = function (
              account_id,
              selected,
              selected_set,
              GFs,
              titles,
              i,
              j,
              data
            ) {
              if (selected.length <= i) {
                let v = {};
                for (let k = 0; k < selected.length; k++) {
                  v[titles[k]] = selected[k].map((x) => GFs[x].id);
                }
                firebase
                  .firestore()
                  .collection("accounts")
                  .doc(account_id)
                  .collection("GF")
                  .doc(GetWeeklyBase().toString())
                  .set(v)
                  .then(() => {
                    alert("儲存完成");
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              } else if (selected[i].length <= j) {
                saveChange(
                  account_id,
                  selected,
                  selected_set,
                  GFs,
                  titles,
                  i + 1,
                  0,
                  null
                );
              } else if (data) {
                GFs[selected[i][j]].id = data;
                saveChange(
                  account_id,
                  selected,
                  selected_set,
                  GFs,
                  titles,
                  i,
                  j + 1,
                  null
                );
              } else if (!("id" in GFs[selected[i][j]])) {
                firebase
                  .firestore()
                  .collection("GF")
                  .add(GFs[selected[i][j]])
                  .then((d) =>
                    saveChange(
                      account_id,
                      selected,
                      selected_set,
                      GFs,
                      titles,
                      i,
                      j,
                      d.id
                    )
                  )
                  .catch((error) => alert(error.message));
              } else {
                saveChange(
                  account_id,
                  selected,
                  selected_set,
                  GFs,
                  titles,
                  i,
                  j + 1,
                  null
                );
              }
            };
            var s = [];
            for (let i = 0; i < selected.length; i++) {
              s.push(Array.from(selected[i]));
            }
            saveChange(account.id, s, selected, GFs, titles, 0, 0);
          }}
        >
          提交表單
        </CButton>
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
                  if (d && d.value) {
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
