import CIcon from "@coreui/icons-react";
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
  CListGroup,
  CListGroupItem,
  CRow, CTabContent,
  CTabPane
} from "@coreui/react";
import {
  FirestoreBatchedWrite,
  FirestoreCollection
} from "@react-firebase/firestore";
import { loading } from "Components";
import { AddModal, DeleteModal, ModifyModal } from "Components/ModifyFormModal";
import { firebase } from "db/firebase";
import { useState } from "react";

const ModifyListGroupItem = ({
  index,
  name,
  setModifyModal,
  setDeleteModal,
}) => {
  return (
    <CListGroupItem accent="secondary" color="secondary" key={index}>
      <CRow className="align-items-center">
        <CCol xs="5" sm="9" md="9" lg="10" style={{ color: "#000000" }}>
          {name}
        </CCol>
        <CCol>
          <CButtonToolbar justify="end">
            <CButton
              variant="ghost"
              color="dark"
              onClick={() => {
                setModifyModal(index);
              }}
            >
              <CIcon name="cil-pencil" />
            </CButton>
            <CButton
              variant="ghost"
              color="danger"
              onClick={() => {
                setDeleteModal({
                  type: "problem",
                  title: "問題",
                  index,
                  name,
                });
              }}
            >
              <CIcon name="cil-trash" />
            </CButton>
          </CButtonToolbar>
        </CCol>
      </CRow>
    </CListGroupItem>
  );
};
const ModifyCard = ({ default_data }) => {
  const [data, setData] = useState(default_data);
  var [activeTab, setActiveTab] = useState(0);
  const [modifyModal, setModifyModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  var [sections, setSections] = useState([]);
  if (sections.length <= activeTab)
    activeTab = sections.length > 0 ? sections.length - 1 : 0;
  var contents = [];
  var titles = [];
  var section_members = [];
  for (let i = 0; i < sections.length; i++) section_members.push([]);
  for (var i = 0; i < data.value.length; i++) {
    //assign id to data
    if (data.value[i].id === "deleted") continue;
    if (!sections.includes(data.value[i].section)) {
      sections.push(data.value[i].section);
      section_members.push([]);
    }
    section_members[sections.indexOf(data.value[i].section)].push(
      <ModifyListGroupItem
        name={data.value[i].title}
        index={i}
        setModifyModal={setModifyModal}
        setDeleteModal={setDeleteModal}
      />
    );
  }

  // handle Dropdown list of sections
  for (let i = 0; i < sections.length; i++) {
    titles.push(
      <CDropdownItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
      >
        {sections[i]}
      </CDropdownItem>
    );
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        <CListGroup accent>{section_members[i]}</CListGroup>
      </CTabPane>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol>表單修改</CCol>
          <CCol>
            <CButtonToolbar justify="end">
              <CDropdown>
                <CDropdownToggle color="info" style={{ color: "#FFFFFF" }}>
                  {sections[activeTab]}
                </CDropdownToggle>
                <CDropdownMenu style={{ overflow: "auto", maxHeight: "270px" }}>
                  {titles}
                </CDropdownMenu>
              </CDropdown>
              <CButton
                variant="ghost"
                color="dark"
                onClick={function () {
                  setAddModal({ title: "區塊", type: "section" });
                }}
              >
                <CIcon alt="新增區塊" name="cil-library-add" />
              </CButton>
              <CButton
                variant="ghost"
                color="danger"
                onClick={() => {
                  setDeleteModal({
                    type: "group",
                    title: "區塊",
                    name: sections[activeTab],
                    index: activeTab,
                  });
                }}
              >
                <CIcon alt="刪除區塊" name="cil-trash" />
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
        <ModifyModal
          data={data}
          setData={setData}
          show={modifyModal}
          setModal={setModifyModal}
        />
        <DeleteModal
          data={data}
          setData={setData}
          groups={sections}
          setGroups={setSections}
          group_members={section_members}
          page={"form"}
          show={deleteModal}
          setModal={setDeleteModal}
        />
        <AddModal
          data={data}
          setData={setData}
          sections={sections}
          setSections={setSections}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <CButtonToolbar>
          <CButton
            variant="ghost"
            color="dark"
            onClick={function (activeTab) {
              setAddModal({ type: "problem", title: "問題", index: activeTab });
            }.bind(null, activeTab)}
          >
            新增問題
          </CButton>
          <FirestoreBatchedWrite>
            {({ addMutationToBatch, commit }) => {
              return (
                <CButton
                  variant="ghost"
                  color="primary"
                  onClick={async () => {
                    var check = window.confirm("確定儲存修改嗎？");
                    if (!check) return;
                    var pathPrefix = "/form/";
                    for (let i = 0; i < data.value.length; i++) {
                      let problem = data.value[i];
                      if (problem.id === "new") {
                        try {
                          await firebase
                            .firestore()
                            .collection("form")
                            .add(problem)
                            .then((d) => {
                              data.value[i].id = d.id;
                              setData(data);
                            });
                        } catch (error) {
                          alert(error.message);
                        }
                      } else if (problem.id === "deleted") {
                        try {
                          await firebase
                            .firestore()
                            .collection("form")
                            .doc(problem.old_id)
                            .delete();
                        } catch (error) {
                          alert(error.message);
                        }
                      } else {
                        var path = pathPrefix + problem.id + "/";
                        addMutationToBatch({
                          path,
                          value: problem,
                          type: "set",
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
      </CCardFooter>
    </CCard>
  );
};

const ModifyForm = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/form/">
          {(d) => {
            if (d && d.value) {
              for (let i = 0; i < d.ids.length; i++) d.value[i].id = d.ids[i];
              return (
                <CCol>
                  <ModifyCard default_data={d} />
                </CCol>
              );
            } else return loading;
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyForm;
