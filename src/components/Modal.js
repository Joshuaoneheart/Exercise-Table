import { Row, Portal } from ".";

const Modal = ({
  children,
  show,
  container_style,
  title,
  title_style,
  body_style,
  setShow,
}) => {
  container_style = Object.assign(
    { display: show ? "block" : "none" },
    container_style
  );
  title_style = Object.assign(
    { paddingTop: "4px", minHeight: "56px" },
    title_style
  );
  body_style = Object.assign({ padding: "0" }, body_style);
  return (
    <Portal customRootId="root">
      <>
        <div className="modal-container" style={container_style}>
          <Row style={{ justifyContent: "space-between", paddingTop: "20px" }}>
            <div className="heading2-bold" style={title_style}>
              {title}
            </div>
            <img
              src={process.env.PUBLIC_URL + "/Images/close.svg"}
              alt="close"
              onClick={() => setShow(false)}
              style={{ height: "24px", marginRight: "4px" }}
            />
          </Row>
          <div className="primary-regular" style={body_style}>
            {children}
          </div>
        </div>
        <div
          onClick={() => setShow(false)}
          className="modal-mask"
          style={{ display: show ? "block" : "none" }}
        />
      </>
    </Portal>
  );
};
export default Modal;
