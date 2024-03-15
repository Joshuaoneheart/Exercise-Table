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
import { useContext, useEffect, useState } from "react";
import { GroupContext } from "hooks/context";
import { firebase } from "db/firebase";
const MemberListBody = () => {
  const [data, setData] = useState([]);
  const groupMap = useContext(GroupContext);
  const fields = [
    { key: "displayName", label: "姓名", _style: { width: "7%" } },
    { key: "group", label: "活力組", _style: { width: "20%" } },
    { key: "lord_table", label: "累計主日聚會", _style: { width: "20%" } },
    { key: "神人生活操練", label: "累計神人生活操練", _style: { width: "20%" } },
    { key: "福音牧養操練", label: "累計福音牧養操練", _style: { width: "20%" } },
    { key: "召會生活操練", label: "累計召會生活操練", _style: { width: "20%" } },
    { key: "total_score", label: "累計總分", _style: { width: "20%" } },
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
          setData(tmp);
        });
    };
    FetchMember();
  }, [groupMap]);
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
