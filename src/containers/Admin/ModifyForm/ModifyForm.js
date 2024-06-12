import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import Select from "react-select";
import { loading } from "components";
import {
  AddModal,
  DeleteModal,
  ModifyModal,
  TransferModal,
} from "components/ModifyFormModal";
import { firebase, DB } from "db/firebase";
import { useEffect, useState } from "react";
import { message } from "antd";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { GetProblems } from "utils/problem";
import ImportProblemModal from "components/ImportProblemModal";

const ModifyListGroupItem = ({
  index,
  name,
  setModifyModal,
  setDeleteModal,
  setTransferModal,
}) => {
  return (
    <CListGroupItem accent="secondary" color="secondary" key={index}>
      <CRow className="align-items-center">
        <CCol xs="5" sm="9" md="9" lg="10" style={{ color: "#000000" }}>
          {name}
        </CCol>
        <CCol>
          <CRow alignHorizontal="end" style={{ padding: "inherit" }}>
            <CButtonGroup justify="end">
              <CButton
                variant="outline"
                color="dark"
                onClick={() => {
                  setModifyModal(index);
                }}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton
                variant="outline"
                color="primary"
                onClick={() => {
                  setTransferModal(index);
                }}
              >
                <CIcon name="cil-swap-horizontal" />
              </CButton>
              <CButton
                variant="outline"
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
            </CButtonGroup>
          </CRow>
        </CCol>
      </CRow>
    </CListGroupItem>
  );
};
const ModifyCard = ({ default_data, form_id }) => {
  const [data, setData] = useState(default_data);
  var [activeTab, setActiveTab] = useState(0);
  const [modifyModal, setModifyModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [importModal, setImportModal] = useState(false);
  const [transferModal, setTransferModal] = useState(null);
  var [sections, setSections] = useState([]);
  if (sections.length <= activeTab)
    activeTab = sections.length > 0 ? sections.length - 1 : 0;
  var contents = [];
  var titles = [];
  var section_members = [];
  for (let i = 0; i < sections.length; i++) section_members.push([]);
  for (var i = 0; i < data.length; i++) {
    //assign id to data
    if (data[i].id === "deleted") continue;
    if (!sections.includes(data[i].section)) {
      sections.push(data[i].section);
      section_members.push([]);
    }
    section_members[sections.indexOf(data[i].section)].push(
      <ModifyListGroupItem
        name={data[i].title}
        index={i}
        setModifyModal={setModifyModal}
        setDeleteModal={setDeleteModal}
        setTransferModal={setTransferModal}
      />
    );
  }

  // handle Dropdown list of sections
  for (let i = 0; i < sections.length; i++) {
    titles.push({
      idx: i,
      value: sections[i],
      label: <span style={{ whiteSpace: "pre" }}>{sections[i]}</span>,
    });
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
          <CCol xs="4" md="7" lg="7" xl="8">
            表單修改
          </CCol>
          <CCol>
            <Select
              style={{ width: "80%" }}
              value={{
                idx: activeTab,
                value: sections[activeTab],
                label: (
                  <span style={{ whiteSpace: "pre" }}>
                    {sections[activeTab]}
                  </span>
                ),
              }}
              isSearchable
              options={titles}
              onChange={(v) => {
                setActiveTab(v.idx);
              }}
            />
          </CCol>
          <CCol xs="4" md="2">
            <CRow alignHorizontal="end" style={{ padding: "inherit" }}>
              <CButtonGroup justify="end">
                <CButton
                  variant="outline"
                  color="dark"
                  onClick={function () {
                    setAddModal({ title: "區塊", type: "section" });
                  }}
                >
                  <CIcon alt="新增區塊" name="cil-library-add" />
                </CButton>
                <CButton
                  variant="outline"
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
              </CButtonGroup>
            </CRow>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CTabContent>{contents}</CTabContent>
          </CCol>
        </CRow>
        <ImportProblemModal
          setData={setData}
          show={importModal}
          form_id={form_id}
          setModal={setImportModal}
          data={data}
        />
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
        <TransferModal
          data={data}
          setData={setData}
          sections={sections}
          show={transferModal}
          setModal={setTransferModal}
        />
      </CCardBody>
      <CCardFooter align="right">
        <CButtonGroup>
          <CButton
            color="dark"
            onClick={() => {
              setImportModal(true);
            }}
          >
            匯入問題
          </CButton>
          <CButton
            variant="outline"
            color="dark"
            onClick={function (activeTab) {
              setAddModal({ type: "problem", title: "問題", index: activeTab });
            }.bind(null, activeTab)}
          >
            新增問題
          </CButton>
          <CButton
            variant="outline"
            color="primary"
            onClick={async () => {
              var check = window.confirm("確定儲存修改嗎？");
              if (!check) return;
              var pathPrefix = "/form/";
              for (let i = 0; i < data.length; i++) {
                let problem = data[i];
                if (problem.id === "new") {
                  try {
                    delete problem.id;
                    await firebase
                      .firestore()
                      .collection("form")
                      .add(problem)
                      .then((d) => {
                        data[i].id = d.id;
                        setData(data);
                      });
                  } catch (error) {
                    message.error(error.message);
                  }
                } else if (problem.id === "deleted") {
                  try {
                    await firebase
                      .firestore()
                      .collection("form")
                      .doc(problem.old_id)
                      .delete();
                  } catch (error) {
                    message.error(error.message);
                  }
                } else {
                  var path = pathPrefix + problem.id;
                  await DB.updateByUrl(path, problem);
                }
              }
              await DB.updateByUrl(`/forms/${form_id}`, {
                problems: data.map((x) => x.id),
              });
              message.success("儲存完成");
            }}
          >
            儲存變更
          </CButton>
        </CButtonGroup>
      </CCardFooter>
    </CCard>
  );
};

const ModifyForm = () => {
  const { id } = useParams();
  const [problems, setProblems] = useState(null);
  useEffect(() => {
    const GetData = async () => {
      setProblems(await GetProblems(id, true));
    };
    if (problems === null) GetData();
  });
  if (problems === null) return loading;
  return (
    <>
      <CRow>
        <CCol>
          <ModifyCard default_data={problems} form_id={id} />
        </CCol>
      </CRow>
    </>
  );
};

export default ModifyForm;
