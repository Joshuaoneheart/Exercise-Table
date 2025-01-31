import Modal from "./Modal";
const AnnouncementPreviewModal = ({ content, setContent, accountsMap }) => {
  return (
    <Modal
      title="公告內容"
      show={content !== null}
      setShow={() => setContent(null)}
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
        onClick={() => setContent(null)}
      >
        確認
      </button>
    </Modal>
  );
};
export default AnnouncementPreviewModal;
