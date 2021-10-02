import React, { useState } from "react";
import {
  CButton,
  CButtonToolbar,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSelect,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { loading } from "src/reusable";
import {
  FirestoreCollection,
  FirestoreBatchedWrite,
} from "@react-firebase/firestore";
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  var [activeTab, setActiveTab] = useState(0);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  var titles = [];
  var [residences, setResidences] = useState([]);
  var residence_contents = [];
  for (let i = 0; i < residences.length; i++) {
    residence_contents.push([]);
  }
  if (activeTab >= residences.length)
    activeTab = Math.max(residences.length - 1, 0);
  var contents = [];
  var add_modal_options = [];
  for (var i = 0; i < data.ids.length; i++) {
    if (data.value[i].role !== "Member") continue;
    if (!data.value[i].residence) {
      add_modal_options.push(
        <option value={i} key={i}>
          {data.value[i].displayName}
        </option>
      );
      continue;
    }
    if (!residences.includes(data.value[i].residence)) {
      residences.push(data.value[i].residence);
      residence_contents.push([]);
    }
    residence_contents[residences.indexOf(data.value[i].residence)].push(
      //ToDo: Change ascent to danger when the name has not been bind
      <CListGroupItem
        key={
          residence_contents[residences.indexOf(data.value[i].residence)].length
        }
        accent="secondary"
        color="secondary"
      >
        <CRow className="align-items-center">
          <CCol xs="4" sm="9" md="9" lg="9" style={{ color: "#000000" }}>
            {data.value[i].displayName}
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CButton variant="ghost" color="dark"
              onClick={function (i, activeTab) {
                setTransferModal({ resident: i, residence: activeTab });
              }.bind(null, i, activeTab)}>
                <CIcon
                  name="cil-swap-horizontal"
                />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={function (i) {
                  setDeleteModal({
                    title: "住戶",
                    type: "resident",
                    name: data.value[i].displayName,
                    index: i,
                  });
                }.bind(null, i)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </CButtonToolbar>
          </CCol>
        </CRow>
      </CListGroupItem>
    );
  }
  for (let i = 0; i < residences.length; i++) {
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{residence_contents[i]}</CListGroup>
      </CTabPane>
    );
  }
  for (let i = 0; i < residences.length; i++) {
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {residences[i]}
      </CDropdownItem>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs="5" md="7" lg="7" xl="8">
            住戶名冊修改
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CDropdown>
                <CDropdownToggle color="info" style={{ color: "#FFFFFF" }}>
                  {residences.length ? residences[activeTab] : null}
                </CDropdownToggle>
                <CDropdownMenu style={{ overflow: "auto", maxHeight: "270px" }}>
                  {titles}
                </CDropdownMenu>
              </CDropdown>
              <CButton
                variant="ghost"
                color="dark"
                onClick={() =>
                  setAddModal({ type: "residence", title: "住處" })
                }
              >
                <CIcon alt="新增住處" name="cil-library-add" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={() =>
                  setDeleteModal({
                    type: "residence",
                    title: "住處",
                    name: residences[activeTab],
                    index: activeTab,
                  })
                }
              >
                <CIcon alt="刪除住處" name="cil-trash" />
              </CButton>
            </CButtonToolbar>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CTabContent>{contents}</CTabContent>
          </CCol>
        </CRow>
        <TransferModal
          data={data}
          setData={setData}
          show={transferModal}
          setModal={setTransferModal}
          residences={residences}
        />
        <DeleteModal
          data={data}
          setData={setData}
          show={deleteModal}
          setModal={setDeleteModal}
          residences={residences}
          setResidences={setResidences}
          residence_contents={residence_contents}
        />
        <AddModal
          options={add_modal_options}
          data={data}
          setData={setData}
          residences={residences}
          setResidences={setResidences}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <CCol align="end">
          <CButtonToolbar>
            <CButton
              variant="ghost"
              color="dark"
              onClick={() =>
                setAddModal({ type: "resident", index: activeTab })
              }
            >
              新增住戶
            </CButton>{" "}
            <FirestoreBatchedWrite>
              {({ addMutationToBatch, commit }) => {
                return (
                  <CButton
                    variant="ghost"
                    color="primary"
                    onClick={() => {
                      var check = window.confirm("確定儲存修改嗎？");
                      if (!check) return;
                      var pathPrefix = "/accounts/";
                      for (var idx in data.ids) {
                        var path = pathPrefix + data.ids[idx];
                        if (data.value[idx].isChanged) {
                          var tmp = { residence: data.value[idx].residence };
                          addMutationToBatch({
                            path,
                            value: tmp,
                            type: "update",
                          });
                        }
                      }
                      commit()
                        .then(() => {
                          alert("儲存完成");
                        })
                        .catch((error) => {
                          alert(error);
                        });
                    }}
                  >
                    儲存變更
                  </CButton>
                );
              }}
            </FirestoreBatchedWrite>
          </CButtonToolbar>
        </CCol>
      </CCardFooter>
    </CCard>
  );
};

const AddModal = (props) => {
  var form = React.useRef();
  if (props.show == null) return null;
  var writeData = () => {
    var data = props.data;
    var group = props.group;
    switch (props.show.type) {
      case "resident":
        var data = props.data;
        var tmp = {};
        data.value[form.current.elements.name.value].residence =
          props.residences[form.current.elements.residence.value];
        data.value[form.current.elements.name.value].isChanged = true;
        props.setData(data);
        break;
      case "residence":
        props.residences.push(form.current.elements.name.value);
        props.setResidences(props.residences);
        break;
    }
    props.setModal(null);
  };
  var options = [];
  for (var i in props.residences) {
    options.push(
      <option value={i} key={i}>
        {props.residences[i]}
      </option>
    );
  }
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>新增{props.show.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          innerRef={form}
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          {props.show.type === "resident" && (
            <>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>姓名</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect name="name">{props.options}</CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>住處</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect name="residence">{options}</CSelect>
                </CCol>
              </CFormGroup>
            </>
          )}
          {props.show.type === "residence" && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>住處名稱</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="name" required />
              </CCol>
            </CFormGroup>
          )}
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

const DeleteModal = (props) => {
  if (props.show === null) return null;
  var deleteData = () => {
    var data = props.data;
    switch (props.show.type) {
      case "resident":
        delete data.value[props.show.index].residence;
        data.value[props.show.index].isChanged = true;
        props.setData(data);
        break;
      case "residence":
        if (props.residence_contents[props.show.index].length !== 0) {
          alert("住處內尚有住戶，請將所有住戶刪除後再刪除住處");
          break;
        }
        props.residences.splice(props.show.index, 1);
        props.setResidences(props.residences);
        break;
    }
    props.setModal(null);
  };
  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
      color="danger"
    >
      <CModalHeader closeButton>
        <CModalTitle>刪除{props.show.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        確認刪除{props.show.title} {props.show.name} 嗎？
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={deleteData}>
          確認
        </CButton>{" "}
        <CButton color="secondary" onClick={() => props.setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const TransferModal = (props) => {
  var data = props.data;
  var form = React.useRef();
  if (props.show == null) return null;
  var writeData = () => {
    props.data.value[props.show.resident].residence =
      props.residences[form.current.elements.residence.value];
    props.data.value[props.show.resident].isChanged = true;
    props.setData(props.data);
    props.setModal(null);
  };
  var residences_option = [];
  for (let i = 0; i < props.residences.length; i++) {
    if (i !== props.show.residence)
      residences_option.push(
        <option value={i} key={i}>
          {props.residences[i]}
        </option>
      );
  }

  return (
    <CModal
      show={props.show !== null}
      onClose={() => {
        props.setModal(null);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>修改問題</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {data !== null && (
          <CForm
            innerRef={form}
            action=""
            method="post"
            encType="multipart/form-data"
            className="form-horizontal"
          >
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>移動至</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect name="residence">{residences_option}</CSelect>
              </CCol>
            </CFormGroup>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          儲存修改
        </CButton>{" "}
        <CButton color="secondary" onClick={() => props.setModal(null)}>
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const ModifyResident = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/accounts/">
          {(d) => {
            return !(d && d.value) ? (
              loading
            ) : (
              <CCol>
                <ModifyCard data={d} />
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyResident;
