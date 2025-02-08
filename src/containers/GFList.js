import { FirestoreCollection } from "@react-firebase/firestore";
import {
  loading,
  AddGFModal,
  Datatable,
  Pagination,
  Select,
  Input,
} from "components";
import { AccountContext } from "hooks/context";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18n";

const GFListCard = ({ data }) => {
  const { t } = useTranslation("translation", { i18n });
  const [addModal, setAddModal] = useState(false);
  const account = useContext(AccountContext);
  const [d, setD] = useState(data);
  const [active, setActive] = useState(0);
  const [condition, setCondition] = useState({
    value: "all",
    label: t("全部"),
  });
  const [search, setSearch] = useState("");
  const fields = [
    { value: "all", label: t("全部") },
    { value: "name", label: t("姓名") },
    { value: "school", label: t("學校") },
    { value: "department", label: t("科系") },
    { value: "grade", label: t("年級") },
    { value: "type", label: t("身份") },
    { value: "note", label: t("備註") },
  ];
  const history = useHistory();
  useEffect(() => {
    setD(data);
  }, [data]);
  useEffect(() => {
    setCondition({
      value: "all",
      label: t("全部"),
    });
  }, [t]);
  const maxDisplay = 10;
  let content;
  if (condition.value === "all")
    content = d.filter((x) => {
      let qualified = false;
      for (let i = 1; i < 7; i++)
        qualified |= x[fields[i].value].includes(search);
      return qualified;
    });
  else content = d.filter((x) => x[condition.value].includes(search));
  return (
    <div className="GF-background">
      <div className="GFList-banner">
        <span className="heading2-bold GFList-topic">{t("牧養對象資料")}</span>
        <img
          src={process.env.PUBLIC_URL + "/Images/plus.svg"}
          alt="新增牧養對象"
          className="plus-icon"
          onClick={() => {
            setAddModal(true);
          }}
        />
      </div>
      <div className="GFList-search-banner">
        <Select
          container_style={{
            marginLeft: "16px",
            width: "133px",
          }}
          value={condition}
          options={fields}
          onChange={(key) => {
            setCondition(key);
            setActive(0);
          }}
        />
        <Input
          style={{
            marginLeft: "8px",
            marginRight: "16px",
            width: "calc(100% - 165px)",
          }}
          onChange={(key) => {
            setSearch(key);
            setActive(0);
          }}
          placeholder="請輸入關鍵字"
        />
      </div>
      <AddGFModal
        show={addModal}
        setModal={setAddModal}
        data={d}
        account={account}
        setData={setD}
      />
      {content.length !== 0 ? (
        <>
          <Datatable
            fields={fields.slice(1, 7)}
            start={active * maxDisplay}
            maxDisplay={maxDisplay}
            content={content}
            onRowClick={(item) => {
              history.push(`/GF/${item.id}`);
            }}
          />
          <Pagination
            totalPage={Math.ceil(content.length / maxDisplay)}
            active={active}
            setActive={setActive}
          />
        </>
      ) : (
        <div className="GFList-empty-container">
          <img src={process.env.PUBLIC_URL + "Images/empty.svg"} alt="empty" />
          <span className="heading3-regular">{t("暫無資料")}</span>
        </div>
      )}
    </div>
  );
};
const GFList = () => {
  const account = useContext(AccountContext);
  return (
    <FirestoreCollection path="/GF/">
      {(d) => {
        if (d.isLoading) return loading;
        if (d && d.value) {
          // add "id" to data
          const data = [];
          for (var i = 0; i < d.value.length; i++) {
            if (
              account.role === "Admin" ||
              account.gender === d.value[i].gender
            )
              data.push(Object.assign(d.value[i], { id: d.ids[i] }));
          }
          return <GFListCard data={data} />;
        } else return null;
      }}
    </FirestoreCollection>
  );
};
export default GFList;
