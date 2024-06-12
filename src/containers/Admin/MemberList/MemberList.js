import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
} from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import { firebase, DB } from "db/firebase";
import { GetWeeklyBase } from "utils/date";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import SemesterContext from "hooks/semester";
import { IsCurrentSemester } from "utils/semester";
const MemberListBody = () => {
  const { t } = useTranslation("translation", { i18n });
  const { semester } = useContext(SemesterContext);
  const [data, setData] = useState([]);
  const history = useHistory();
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
            if (!item[semester.name + "|total_score"])
              item[semester.name + "|total_score"] = 0;
            if (!item[semester.name + "|召會生活操練"])
              item[semester.name + "|召會生活操練"] = 0;
            if (!item[semester.name + "|神人生活操練"])
              item[semester.name + "|神人生活操練"] = 0;
            if (!item[semester.name + "|福音牧養操練"])
              item[semester.name + "|福音牧養操練"] = 0;
            if (!item[semester.name + "|lord_table"])
              item[semester.name + "|lord_table"] = 0;
            if (IsCurrentSemester(semester)) {
              if (item.score)
                item[semester.name + "|total_score"] += item.score;
              if (item["cur_召會生活操練"])
                item[semester.name + "|召會生活操練"] +=
                  item["cur_召會生活操練"];
              if (item["cur_神人生活操練"])
                item[semester.name + "|神人生活操練"] +=
                  item["cur_神人生活操練"];
              if (item["cur_福音牧養操練"])
                item[semester.name + "|福音牧養操練"] +=
                  item["cur_福音牧養操練"];
              if (item.cur_lord_table)
                item[semester.name + "|lord_table"] += item.cur_lord_table;
            }
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
    if (semester) FetchMember();
  }, [semester]);
  if (!semester) return null;
  const fields = [
    {
      key: "displayName",
      label: t("姓名"),
      _style: { width: "25px", flexWrap: "nowrap" },
    },
    {
      key: "group",
      label: t("活力組"),
      _style: { width: "50px", flexWrap: "nowrap" },
    },
    {
      key: "submit",
      label: t("本週已交"),
      _style: { width: "25px", flexWrap: "nowrap" },
    },
    {
      key: semester.name + "|lord_table",
      label: t("累計主日聚會"),
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: semester.name + "|神人生活操練",
      label: t("累計神人生活操練"),
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: semester.name + "|福音牧養操練",
      label: t("累計福音牧養操練"),
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: semester.name + "|召會生活操練",
      label: t("累計召會生活操練"),
      _style: { width: "100px", flexWrap: "nowrap" },
    },
    {
      key: semester.name + "|total_score",
      label: t("累計總分"),
      _style: { width: "50px", flexWrap: "nowrap" },
    },
  ];
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
        onRowClick={(item) => {
          history.push(`/member/${item.id}`);
        }}
      />
    </CCardBody>
  );
};

const MemberList = () => {
  const { t } = useTranslation("translation", { i18n });
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>{t("個人操練情形")}</CCardHeader>
          <MemberListBody />
        </CCard>
      </CCol>
    </CRow>
  );
};
export default MemberList;
