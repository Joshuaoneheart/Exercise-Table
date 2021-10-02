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
import {
  FirestoreCollection,
  FirestoreBatchedWrite,
} from "@react-firebase/firestore";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  var [activeTab, setActiveTab] = useState(0);
  const [transferModal, setTransferModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  if (activeTab >= data.ids.length)
    activeTab = data.ids.length >= 0 ? data.ids.length : 0;
  var titles = [];
  var contents = [];
  for (var i = 0; i < data.ids.length; i++) {
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {data.ids[i]}
      </CDropdownItem>
    );
    var tmp_content = [];
    for (var j = 0; j < data.value[i]["member"].length; j++) {
      tmp_content.push(
        <CListGroupItem accent="secondary" color="secondary" key={j}>
          <CRow className="align-items-center">
            <CCol xs="5" sm="9" md="9" lg="10" style={{ color: "#000000" }}>
              {data.value[i]["member"][j]}
            </CCol>
            <CCol align="end">
              <CButton
                variant="ghost"
                color="dark"
                onClick={function (i, j) {
                  setTransferModal([i, j]);
                }.bind(null, i, j)}
              >
                <CIcon name="cil-swap-horizontal" />
              </CButton>
            </CCol>
          </CRow>
        </CListGroupItem>
      );
    }
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{tmp_content}</CListGroup>
      </CTabPane>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs="4" sm="9" md="9" lg="9">
            活力組管理
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CDropdown>
                <CDropdownToggle color="info" style={{ color: "#FFFFFF" }}>
                  {data.ids[activeTab]}
                </CDropdownToggle>
                <CDropdownMenu style={{ overflow: "auto", maxHeight: "270px" }}>
                  {titles}
                </CDropdownMenu>
              </CDropdown>
              <CButton
                variant="ghost"
                color="dark"
                onClick={() => {
                  setAddModal(true);
                }}
              >
                <CIcon alt="新增組別" name="cil-library-add" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={() => {
                  setDeleteModal(activeTab);
                }}
              >
                <CIcon alt="刪除組別" name="cil-trash" />
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
        />
        <DeleteModal
          data={data}
          setData={setData}
          show={deleteModal}
          setModal={setDeleteModal}
        />
        <AddModal
          data={data}
          setData={setData}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <FirestoreBatchedWrite>
          {({ addMutationToBatch, commit }) => {
            return (
              <CButton
                variant="ghost"
                color="primary"
                onClick={() => {
                  var check = window.confirm("確定儲存修改嗎？");
                  if (!check) return;
                  var pathPrefix = "/groups/";
                  for (var idx in data.ids) {
                    var path = pathPrefix + data.ids[idx] + "/";
                    addMutationToBatch({
                      path,
                      value: data.value[idx],
                      type: "set",
                    });
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
      </CCardFooter>
    </CCard>
  );
};

const AddModal = (props) => {
  if (props.show == null) {
    return null;
  }
  var form = React.createRef();
  var writeData = () => {
    var data = props.data;
    data.value.push({ member: [] });
    data.ids.push(form.current.elements.name.value);
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
          <CFormGroup row inline>
            <CCol md="3">
              <CLabel>活力組名稱</CLabel>
            </CCol>
            <CCol xs="12" md="9">
              <CInput name="name" required />
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

const DeleteModal = (props) => {
  if (props.show === null) return null;
  var deleteData = () => {
    var data = props.data;
    if (data.value[props.show].length !== 0) {
      alert("活力組內尚有住戶，請將所有住戶刪除後再刪除活力組");
      props.setModal(null);
      return;
    }
    data.value.splice(props.show, 1);
    data.ids.splice(props.show, 1);
    props.setData(data);
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
        <CModalTitle>刪除活力組</CModalTitle>
      </CModalHeader>
      <CModalBody>確認刪除活力組 {props.data.ids[props.show]} 嗎？</CModalBody>
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
  if (props.show == null) return null;
  var form = React.createRef();
  var writeData = () => {
    var tmp = form.current.elements.group.value;
    data = props.data;
    data.value[data.ids.indexOf(tmp)]["member"].push(
      data.value[props.show[0]]["member"][props.show[1]]
    );
    data.value[props.show[0]]["member"].splice(props.show[1], 1);
    props.setData(data);
    props.setModal(null);
  };
  var groups_option = [];
  for (let i in data.ids) {
    if (i !== props.show)
      groups_option.push(<option value={data.ids[i]}>{data.ids[i]}</option>);
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
                <CSelect name="group">{groups_option}</CSelect>
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

const ModifyGroup = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/groups/">
          {(d) => {
            return d.isLoading ? (
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

export default ModifyGroup;
