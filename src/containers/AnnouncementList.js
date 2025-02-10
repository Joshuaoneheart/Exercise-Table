import { loading } from "components";
import { AccountContext } from "hooks/context";
import { useContext, useEffect, useState } from "react";
import { GetAccountsMap } from "utils/account";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import {
  Datatable,
  Select,
  Input,
  Row,
  Col,
  Pagination,
  Portal,
  AnnouncementPreviewModal,
  AddAnnouncementModal,
} from "components";
import { DB } from "db/firebase";
const AnnouncementListBody = ({ data, account }) => {
  const { t } = useTranslation("translation", { i18n });
  const [announcements, setAnnouncements] = useState(data);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [accountsMap, setAccountsMap] = useState(null);
  const history = useHistory();
  const [previewSrc, setPreviewSrc] = useState(null);
  const [active, setActive] = useState(0);
  const [previewModal, setPreviewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [condition, setCondition] = useState({
    value: "all",
    label: t("全部"),
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    let FetchAccountsMap = async () => {
      setAccountsMap(await GetAccountsMap(true));
    };
    FetchAccountsMap();
  }, []);
  useEffect(() => {
    if (data) setAnnouncements(Array.from(data));
  }, [data]);
  useEffect(() => {
    if (previewModal) {
      const container = document.getElementsByClassName(
        "announcement-content"
      )[0];
      if (!container) return;

      const images = container.querySelectorAll("img"); // 只選取特定 `div` 內的圖片
      const handleClick = (event) => {
        setPreviewSrc(event.target.src);
      };

      images.forEach((img) => img.addEventListener("click", handleClick));

      return () => {
        images.forEach((img) => img.removeEventListener("click", handleClick));
      };
    }
  }, [previewModal]);
  useEffect(() => {
    if (id && previewModal === null) {
      setPreviewModal(id);
    }
  }, [id, previewModal]);
  useEffect(() => {
    setCondition({ value: "all", label: t("全部") });
  }, [t]);
  if (accountsMap === null || data === null || announcements === null)
    return loading;
  data = data.reverse();
  const fields = [
    { value: "all", label: t("全部") },
    { value: "timestamp", label: t("日期") },
    { value: "title", label: t("主題") },
  ];
  const maxDisplay = 10;
  let content = [];
  for (let item of announcements.sort((a, b) => {
    if (a.top === b.top) {
      return a.timestamp.toDate() < b.timestamp.toDate() ? 1 : -1;
    }
    return a.top < b.top ? 1 : -1;
  })) {
    let date = item["timestamp"].toDate();
    content.push({
      title: item["title"],
      timestamp: `${date.getFullYear()}.${
        date.getMonth() + 1
      }.${date.getDate()}`,
      content: item["content"],
      posted_by: item["posted_by"],
      id: item["id"],
      checked: item["checked"],
    });
  }
  if (condition.value === "all")
    content = content.filter((x) => {
      let qualified = false;
      for (let i = 1; i < 3; i++)
        qualified |= x[fields[i].value].includes(search);
      return qualified;
    });
  else content = content.filter((x) => x[condition.value].includes(search));
  return (
    <>
      <Portal>
        {previewSrc && (
          <>
            <img
              style={{
                marginLeft: "16px",
                marginRight: "16px",
                position: "fixed",
                zIndex: "1033",
                width: "calc(100% - 32px)",
                top: 0,
                transform: "translateY(50%)",
              }}
              src={previewSrc}
              alt="previewer"
            />
            <img
              onClick={() => setPreviewSrc(null)}
              style={{
                position: "fixed",
                zIndex: "1033",
                top: "45px",
                right: "27px",
                cursor: "pointer",
              }}
              src={"/Images/white_close.svg"}
              alt="close"
            />
            <div
              onClick={() => setPreviewSrc(null)}
              style={{
                zIndex: "1032",
                backgroundColor: "rgb(0 0 0 / 60%)",
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
              }}
            />
          </>
        )}
      </Portal>
      <div className="GFList-banner">
        <span className="heading2-bold GFList-topic">{t("公告")}</span>
        {account.role === "Admin" && (
          <img
            src={"/Images/plus.svg"}
            alt="新增公告"
            className="plus-icon"
            onClick={() => {
              setAddModal(true);
            }}
          />
        )}
      </div>
      <div className="GFList-search-banner" style={{ marginBottom: "24px" }}>
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
      <AddAnnouncementModal
        show={addModal}
        data={announcements}
        account={account}
        setModal={setAddModal}
        setData={setAnnouncements}
      />
      <AnnouncementPreviewModal
        id={previewModal}
        data={data}
        setId={setPreviewModal}
        accountsMap={accountsMap}
        account={account}
      />
      <Row
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
          justifyContent: "center",
        }}
      >
        {content.length !== 0 ? (
          <Col>
            <Datatable
              fields={fields.slice(1, 3)}
              tableClassName="rounded-table announcements"
              content={content}
              onRowClick={(item) => {
                if (account.role === "Admin")
                  history.push(`/Announcement/${item.id}`);
                else setPreviewModal(item.id);
              }}
              maxDisplay={maxDisplay}
              start={active * maxDisplay}
            />
            <Pagination
              totalPage={Math.ceil(content.length / maxDisplay)}
              active={active}
              setActive={setActive}
            />
          </Col>
        ) : (
          <div className="GFList-empty-container">
            <img
              src={"/Images/empty.svg"}
              alt="empty"
            />
            <span className="heading3-regular">{t("暫無資料")}</span>
          </div>
        )}
      </Row>
    </>
  );
};
const AnnouncementList = () => {
  const account = useContext(AccountContext);
  const [data, setData] = useState(null);
  useEffect(() => {
    const GetData = async () => {
      let { docs } = await DB.getByUrl("/announcement");
      let tmp = [];
      for (let doc of docs) {
        let item = doc.data();
        item.id = doc.id;
        tmp.push(item);
      }
      setData(tmp);
    };
    if (!data) GetData();
  });
  return (
    <div className="GF-background">
      <AnnouncementListBody account={account} data={data} />;
    </div>
  );
};
export default AnnouncementList;
