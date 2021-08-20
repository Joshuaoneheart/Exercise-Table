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
  CListGroup,
  CListGroupItem,
  CRow,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FirestoreCollection } from "@react-firebase/firestore";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
const ModifyCard = (props) => {
  const [data, setData] = useState(props.data);
  const [activeTab, setActiveTab] = useState(0);
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
		  //ToDo: Change ascent to danger when the name has not been bind
        <CListGroupItem key={j} accent="secondary" color="secondary">
          <CRow className="align-items-center">
            <CCol xs="4" sm="9" md="9" lg="9" style={{color: "#000000"}}>
              {data.value[i]["member"][j]}
            </CCol>
            <CCol>
		  	  <CButtonToolbar justify="end">
				  <CButton variant="ghost" color="dark">
					<CIcon name="cil-swap-horizontal" />
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
	  <CCol xs="5" md="7" lg="7" xl="8">
		住戶名冊修改
	  </CCol>
	  <CCol>
	  	<CButtonToolbar justify="end">
		<CDropdown>
			<CDropdownToggle color="info" style={{color: "#FFFFFF"}}>
	  			{data.ids[activeTab]}
			</CDropdownToggle>
			<CDropdownMenu style={{overflow: "auto", maxHeight: "270px"}}>
	  			{titles}
			</CDropdownMenu>
		</CDropdown>
	    <CButton variant="ghost" color="dark">
		  <CIcon alt="新增住處" name="cil-library-add"/>
	    </CButton>
	    <CButton variant="ghost" color="danger">
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
    </CCardBody>
  <CCardFooter>
	<CCol align="end">
	  <CButtonToolbar>
        <CButton variant="ghost" color="dark">
	  	新增住戶
        </CButton>
		<CButton variant="ghost" color="primary">
	  	儲存變更
		</CButton>
	  </CButtonToolbar>
	</CCol>
  </CCardFooter>
</CCard>
  );
};

const ModifyResident = () => {
  return (
    <>
      <CRow>
        <FirestoreCollection path="/residences/">
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

export default ModifyResident;
