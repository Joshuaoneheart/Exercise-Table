import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { FirestoreCollection } from "@react-firebase/firestore";
import { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { loading } from "components";
const MemberListBody = ({ data }) => {
  const fields = [
    { key: "displayName", label: "姓名", _style: { width: "7%" } },
    { key: "group", label: "活力組", _style: { width: "20%" } },
    { key: "revival", label: "上週晨興", _style: { width: "20%" } },
    { key: "score", label: "上週總分", _style: { width: "20%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];
  return (
    <CCardBody>
      <CDataTable
        items={data.filter((d) => d.role === "Member")}
        fields={fields}
        columnFilter
        tableFilter
        itemsPerPage={10}
        hover
        sorter
        pagination
        scopedSlots={{
          show_details: (item) => {
            return (
              <Link to={"/member/" + item.id}>
                <CIcon name="cil-info" style={{ marginTop: "40%" }} />
              </Link>
            );
          },
        }}
      />
    </CCardBody>
  );
};

const MemberList = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>個人操練情形</CCardHeader>
          <FirestoreCollection path="/accounts/">
            {(d) => {
              if (d.isLoading) return loading;
              if (d && d.value) {
                // add "id" to data
                for (var i = 0; i < d.value.length; i++) {
                  d.value[i]["id"] = d.ids[i];
                }
                return <MemberListBody data={d.value} />;
              } else return null;
            }}
          </FirestoreCollection>
        </CCard>
      </CCol>
    </CRow>
  );
};
export default MemberList;
