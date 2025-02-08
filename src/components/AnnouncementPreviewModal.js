import { Modal } from ".";
import { DB } from "db/firebase";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const AnnouncementPreviewModal = ({
  id,
  data,
  setId,
  accountsMap,
  account,
}) => {
  const [content, setContent] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const check = async () => {
      if (!content.checked) {
        content.checked = account.id;
        await DB.updateByUrl("/announcement/" + content.id, {
          checked: content.checked,
        });
      } else if (!content.checked.split(";").includes(account.id)) {
        content.checked += ";" + account.id;
        await DB.updateByUrl("/announcement/" + content.id, {
          checked: content.checked,
        });
      }
    };
    if (content) check();
  }, [account, content]);
  useEffect(() => {
    if (data !== null && id !== null) {
      let tmp = Object.assign({}, data.filter((x) => x.id === id)[0]);
      let date = tmp["timestamp"].toDate();
      tmp.timestamp = `${date.getFullYear()}.${
        date.getMonth() + 1
      }.${date.getDate()}`;
      setContent(tmp);
    }
  }, [data, id]);
  return (
    <Modal
      title="公告內容"
      show={id !== null}
      setShow={() => {
        history.push({ search: "" });
        setId(null);
      }}
      container_style={{ backgroundColor: "var(--light-blue)" }}
    >
      {content && (
        <div
          style={{
            backgroundColor: "var(--white)",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <div
            className="primary-medium"
            style={{
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "16px",
            }}
          >
            {content.title}
          </div>
          <div
            className="secondary-regular announcement-content"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
          <div
            className="secondary-regular"
            style={{
              justifyContent: "space-between",
              color: "var(--n-600)",
              paddingTop: "10px",
              paddingRight: "16px",
              paddingLeft: "16px",
              paddingBottom: "10px",
              display: "flex",
            }}
          >
            <span>{content.timestamp}</span>
            <span>發佈人：{accountsMap[content.posted_by]}</span>
          </div>
        </div>
      )}
      <button
        className="login-button"
        style={{ width: "100%", marginBottom: "16px" }}
        onClick={() => {
          history.push({ search: "" });
          setId(null);
        }}
      >
        確認
      </button>
    </Modal>
  );
};
export default AnnouncementPreviewModal;
