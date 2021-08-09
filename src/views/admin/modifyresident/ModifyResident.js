import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
      <CListGroupItem
        key={i}
        onClick={function (i) {
          setActiveTab(i);
        }.bind(null, i)}
        action
        active={activeTab === i}
      >
        <CRow className="align-items-center">
          <CCol xs="5" sm="9" md="9" lg="10">
            {data.ids[i]}
          </CCol>
          <CCol xs="1" sm="1" md="1">
            <CButton block variant="ghost" color="danger">
              <CIcon name="cil-trash" />
            </CButton>
          </CCol>
        </CRow>
      </CListGroupItem>
    );
    var tmp_content = [];
    for (var j = 0; j < data.value[i]["member"].length; j++) {
      tmp_content.push(
        <CListGroupItem key={j}>
          <CRow className="align-items-center">
            <CCol xs="5" sm="9" md="9" lg="10">
              {data.value[i]["member"][j]}
            </CCol>
            <CCol xs="1" sm="1" md="1">
              <CButton block variant="ghost" color="dark">
                <CIcon name="cil-swap-horizontal" />
              </CButton>
            </CCol>
            <CCol xs="1" sm="1" md="1">
              <CButton block variant="ghost" color="danger">
                <CIcon name="cil-trash" />
              </CButton>
            </CCol>
          </CRow>
        </CListGroupItem>
      );
    }
    contents.push(
      <CTabPane key={i} active={activeTab === i}>
        {tmp_content}
      </CTabPane>
    );
  }
  return (
    <CCardBody>
      <CRow>
        <CCol xs="4">
          <CListGroup id="list-tab" role="tablist">
            {titles}
          </CListGroup>
          <CButton block variant="ghost" color="dark">
            <CIcon name="cil-library-add" size="xl" />
          </CButton>
        </CCol>
        <CCol xs="8">
          <CTabContent>{contents}</CTabContent>
          <CButton block variant="ghost" color="dark">
            <CIcon name="cil-user-plus" size="xl" />
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
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
                <CCard>
                  <CCardHeader>
                    <CRow className="align-items-center">
                      <CCol xs="5" sm="9" md="9" lg="10">
                        住戶名冊修改
                      </CCol>
                      <CCol xs="1" sm="1" md="1">
                        <CButton block variant="ghost" color="dark">
                          <CIcon name="cil-save" /> Save
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <ModifyCard data={d} />
                </CCard>
              </CCol>
            );
          }}
        </FirestoreCollection>
      </CRow>
    </>
  );
};

export default ModifyResident;
