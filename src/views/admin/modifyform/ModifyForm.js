import React, { useState } from "react";
import {
  CButton,
  CButtonToolbar,
  CCol,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
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
import { loading } from 'src/reusable'
import { FirestoreCollection } from "@react-firebase/firestore";
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState(null);
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
    for (var j = 0; j < data.value[i]["problem"].length; j++) {
      tmp_content.push(
        <CListGroupItem accent="secondary" color="secondary" key={j}>
          <CRow className="align-items-center">
            <CCol xs="5" sm="9" md="9" lg="10" style={{color:"#000000"}}>
              {data.value[i]["problem"][j]["title"]}
            </CCol>
            <CCol>
		  	<CButtonToolbar justify="end">
              <CButton
                variant="ghost"
                color="dark"
                onClick={function (i, j) {
                  setModal([i, j]);
                }.bind(null, i, j)}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton variant="ghost" color="danger">
                <CIcon name="cil-trash" />
              </CButton>
		  	</CButtonToolbar>
            </CCol>
          </CRow>
        </CListGroupItem>
      );
    }
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
		<CListGroup accent>
			{tmp_content}
		</CListGroup>
      </CTabPane>
    );
  }
  return (
<CCard>
  <CCardHeader>
	  <CRow className="align-items-center">
	  <CCol>
	  表單修改
	  </CCol>
	  <CCol>
	  	<CButtonToolbar justify="end">
	  		<CDropdown>
	  			<CDropdownToggle color="info" style={{color: "#FFFFFF"}}>{data.ids[activeTab]}</CDropdownToggle>
	  			<CDropdownMenu style={{overflow:"auto", maxHeight: "270px"}}>{titles}</CDropdownMenu>
	  		</CDropdown>
	  		<CButton variant="ghost" color="dark">
	  			<CIcon alt="新增區塊" name="cil-library-add" />
	  		</CButton>
	  		<CButton variant="ghost" color="danger">
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
        show={modal}
        setModal={setModal}
      />
    </CCardBody>
  <CCardFooter>
	<CButtonToolbar>
		<CButton variant="ghost" color="dark">新增問題</CButton>
		<CButton variant="ghost" color="primary">儲存變更</CButton>
	</CButtonToolbar>
  </CCardFooter>
</CCard>
);
};

const ModifyModal = (props) => {
  var data = null;
  if (props.show != null)
    data = props.data.value[props.show[0]]["problem"][props.show[1]];
  const [isGrid, setGrid] = useState(
    data === null ? false : data["type"] === "Grid"
  );
  var form = React.createRef();

  var writeData = () => {
    var tmp = {};
    tmp["title"] = form.current.elements.title.value;
    tmp["type"] = form.current.elements.type.value;
    tmp["score"] = form.current.elements.score.value;
    tmp["選項"] = form.current.elements.option.value;
    if (tmp["type"] === "Grid")
      tmp["子選項"] = form.current.elements.suboption.value;
    data = props.data;
    data.value[props.show[0]]["problem"][props.show[1]] = tmp;
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
                <CLabel>標題</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="title" defaultValue={data["title"]} />
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>類型</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect
                  onChange={function (isGrid, setGrid, event) {
                    if ((event.target.value === "Grid") ^ isGrid)
                      setGrid(event.target.value === "Grid");
                  }.bind(null, isGrid, setGrid)}
                  name="type"
                  defaultValue={data["type"]}
                >
                  <option value="MultiChoice">單選題</option>
                  <option value="MultiAnswer">多選題</option>
                  <option value="Grid">單選網格題</option>
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>分數</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="score" defaultValue={data["score"]} />
              </CCol>
            </CFormGroup>
            <CFormGroup row inline>
              <CCol md="3">
                <CLabel>選項</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CInput name="option" defaultValue={data["選項"]} />
              </CCol>
            </CFormGroup>
            {isGrid && (
              <CFormGroup row inline>
                <CCol md="3">
                  <CLabel>子選項</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="suboption" defaultValue={data["子選項"]} />
                </CCol>
              </CFormGroup>
            )}
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

const ModifyForm = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/form/">
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

export default ModifyForm;
