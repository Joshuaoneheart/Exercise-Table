import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
} from "@coreui/react";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { useEffect, useState } from "react";
import { firebase, DB } from "db/firebase";
import { GetWeeklyBase } from "utils/date";
const MemberListBody = () => {
  const [data, setData] = useState([]);
  const fields = [
    {
      key: "displayName",
      label: "姓名",
      _style: { width: "25px", flexWrap: "nowrap" },
    },
    {
      key: "group",
      label: "活力組",
      _style: { width: "50px", flexWrap: "nowrap" },
    },
    {
      key: "submit",
      label: "本週已交",
      _style: { width: "25px", flexWrap: "nowrap" },
    },
    {
      key: "lord_table",
      label: "累計主日聚會",
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: "神人生活操練",
      label: "累計神人生活操練",
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: "福音牧養操練",
      label: "累計福音牧養操練",
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: "召會生活操練",
      label: "累計召會生活操練",
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: "total_score",
      label: "累計總分",
      _style: { width: "50px", flexWrap: "nowrap" },
    },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];
  useEffect(() => {
    let FetchMember = async () => {
      let groupMap = {};
      let group = await DB.getByUrl("/group");
      await group.forEach((doc) => {
        groupMap[doc.id] = doc.data().name;
      });
      let tmp = [];
      await firebase
        .firestore()
        .collection("accounts")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            tmp.push(Object.assign({ id: doc.id }, doc.data()));
            tmp[tmp.length - 1].group = groupMap[tmp[tmp.length - 1].group];
          });
        });
      for (let i = 0; i < tmp.length; i++) {
        let cur = await DB.getByUrl(
          "/accounts/" + tmp[i].id + "/data/" + GetWeeklyBase()
        );
        if (cur) tmp[i].submit = "是";
        else tmp[i].submit = "否";
      }
      setData(tmp);
    };
    FetchMember();
  }, []);
  return (
    <CCardBody>
      <CDataTable
        items={data.filter((d) => d.role === "Member" && d.status === "Active")}
        fields={fields}
        columnFilter
        tableFilter
        itemsPerPage={10}
        hover
        sorter
        pagination
        scopedSlots={{
          total_score: (item) => {
            let tmp = 0;
            if (item.total_score) tmp += item.total_score;
            if (item.score) tmp += item.score;
            return <td>{tmp}</td>;
          },
          召會生活操練: (item) => {
            let tmp = 0;
            if (item["召會生活操練"]) tmp += item["召會生活操練"];
            if (item["cur_召會生活操練"]) tmp += item["cur_召會生活操練"];
            return <td>{tmp}</td>;
          },
          福音牧養操練: (item) => {
            let tmp = 0;
            if (item["福音牧養操練"]) tmp += item["福音牧養操練"];
            if (item["cur_福音牧養操練"]) tmp += item["cur_福音牧養操練"];
            return <td>{tmp}</td>;
          },
          神人生活操練: (item) => {
            let tmp = 0;
            if (item["神人生活操練"]) tmp += item["神人生活操練"];
            if (item["cur_神人生活操練"]) tmp += item["cur_神人生活操練"];
            return <td>{tmp}</td>;
          },
          lord_table: (item) => {
            let tmp = 0;
            if (item.lord_table) tmp += item.lord_table;
            if (item.cur_lord_table) tmp += item.cur_lord_table;
            return <td>{tmp}</td>;
          },
          show_details: (item) => {
            return (
              <td>
                <Link to={"/member/" + item.id}>
                  <CIcon name="cil-info" />
                </Link>
              </td>
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
          <MemberListBody />;
        </CCard>
      </CCol>
    </CRow>
  );
};
export default MemberList;
