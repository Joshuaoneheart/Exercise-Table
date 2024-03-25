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
            let item = Object.assign({}, doc.data());
            if (!item.total_score) item.total_score = 0;
            if (item.score) item.total_score += item.score;
            if (!item["召會生活操練"]) item["召會生活操練"] = 0;
            if (item["cur_召會生活操練"])
              item["召會生活操練"] += item["cur_召會生活操練"];
            if (!item["神人生活操練"]) item["神人生活操練"] = 0;
            if (item["cur_神人生活操練"])
              item["神人生活操練"] += item["cur_神人生活操練"];
            if (!item["福音牧養操練"]) item["福音牧養操練"] = 0;
            if (item["cur_福音牧養操練"])
              item["福音牧養操練"] += item["cur_福音牧養操練"];
            if (!item.lord_table) item.lord_table = 0;
            if (item.cur_lord_table) item.lord_table += item.cur_lord_table;
            tmp.push(Object.assign({ id: doc.id }, item));
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
