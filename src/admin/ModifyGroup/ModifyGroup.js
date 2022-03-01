import { useRef, useState } from "react";
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
import { loading } from "src/Components";
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
  var [groups, setGroups] = useState([]);
  var group_contents = [];
  for (let i = 0; i < groups.length; i++) {
    group_contents.push([]);
  }
  if (activeTab >= groups.length) activeTab = Math.max(groups.length - 1, 0);
  var contents = [];
  var add_modal_options = [];
  for (var i = 0; i < data.ids.length; i++) {
    if (data.value[i].role !== "Member") continue;
    if (!data.value[i].group) {
      add_modal_options.push(
        <option value={i} key={i}>
          {data.value[i].displayName}
        </option>
      );
      continue;
    }
    if (!groups.includes(data.value[i].group)) {
      groups.push(data.value[i].group);
      group_contents.push([]);
    }
    group_contents[groups.indexOf(data.value[i].group)].push(
      //ToDo: Change ascent to danger when the name has not been bind
      <CListGroupItem
        key={group_contents[groups.indexOf(data.value[i].group)].length}
        accent="secondary"
        color="secondary"
      >
        <CRow className="align-items-center">
          <CCol xs="4" sm="9" md="9" lg="9" style={{ color: "#000000" }}>
            {data.value[i].displayName}
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CButton
                variant="ghost"
                color="dark"
                onClick={function (i, activeTab) {
                  setTransferModal({ resident: i, group: activeTab });
                }.bind(null, i, activeTab)}
              >
                <CIcon name="cil-swap-horizontal" />
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
  for (let i = 0; i < groups.length; i++) {
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{group_contents[i]}</CListGroup>
      </CTabPane>
    );
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {groups[i]}
      </CDropdownItem>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol xs="5" md="7" lg="7" xl="8">
            住戶活力組管理
          </CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CDropdown>
                <CDropdownToggle color="info" style={{ color: "#FFFFFF" }}>
                  {groups.length ? groups[activeTab] : null}
                </CDropdownToggle>
                <CDropdownMenu style={{ overflow: "auto", maxHeight: "270px" }}>
                  {titles}
                </CDropdownMenu>
              </CDropdown>
              <CButton
                variant="ghost"
                color="dark"
                onClick={() => setAddModal({ type: "group", title: "活力組" })}
              >
                <CIcon alt="新增活力組" name="cil-library-add" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={() =>
                  setDeleteModal({
                    type: "group",
                    title: "活力組",
                    name: groups[activeTab],
                    index: activeTab,
                  })
                }
              >
                <CIcon alt="刪除活力組" name="cil-trash" />
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
          groups={groups}
        />
        <DeleteModal
          data={data}
          setData={setData}
          show={deleteModal}
          setModal={setDeleteModal}
          groups={groups}
          setGroups={setGroups}
          group_contents={group_contents}
        />
        <AddModal
          options={add_modal_options}
          data={data}
          setData={setData}
          groups={groups}
          setGroups={setGroups}
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
                          var tmp = { group: data.value[idx].group };
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
  var form = useRef();
  if (props.show == null) return null;
  var writeData = () => {
    switch (props.show.type) {
      case "resident":
        var data = props.data;
        data.value[form.current.elements.name.value].group =
          props.groups[form.current.elements.group.value];
        data.value[form.current.elements.name.value].isChanged = true;
        props.setData(data);
        break;
      case "group":
        props.groups.push(form.current.elements.name.value);
        props.setGroups(props.groups);
        break;
      default:
        break;
    }
    props.setModal(null);
  };
  var options = [];
  for (var i in props.groups) {
    options.push(
      <option value={i} key={i}>
        {props.groups[i]}
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
                  <CLabel>活力組</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect name="group">{options}</CSelect>
                </CCol>
              </CFormGroup>
            </>
          )}
          {props.show.type === "group" && (
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>活力組名稱</CLabel>
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
        delete data.value[props.show.index].group;
        data.value[props.show.index].isChanged = true;
        props.setData(data);
        break;
      case "group":
        if (props.group_contents[props.show.index].length !== 0) {
          alert("活力組內尚有住戶，請將所有住戶刪除後再刪除活力組");
          break;
        }
        props.groups.splice(props.show.index, 1);
        props.setGroups(props.groups);
        break;
      default:
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
  var form = useRef();
  if (props.show == null) return null;
  var writeData = () => {
    props.data.value[props.show.resident].group =
      props.groups[form.current.elements.group.value];
    props.data.value[props.show.resident].isChanged = true;
    props.setData(props.data);
    props.setModal(null);
  };
  var groups_option = [];
  for (let i = 0; i < props.groups.length; i++) {
    if (i !== props.show.group)
      groups_option.push(
        <option value={i} key={i}>
          {props.groups[i]}
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

export default ModifyGroup;
