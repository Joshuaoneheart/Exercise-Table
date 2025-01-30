import CIcon from "@coreui/icons-react";
import { message } from "antd";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLink,
  CRow,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { firebase } from "db/firebase";
import React, { useEffect, useState } from "react";
import Input from "components/Input";
import Row from "components/Row";
import Col from "components/Col";
import { history } from "utils/history";
import Modal from "components/Modal";

const ForgetPasswdModal = ({ show, setModal }) => {
  const [email, setEmail] = useState("");
  const submit = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      message.success("重置密碼信已寄出");
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <Modal show={show} setShow={setModal} title="忘記密碼">
      <Row style={{ marginBottom: "4px" }}>
        <span className="primary-regular">電子郵件地址</span>
      </Row>
      <Input
        style={{ border: "1px solid var(--n-200)" }}
        placeholder="請輸入電子郵件地址"
        onChange={(v) => {
          setEmail(v);
        }}
      />
      <Row
        style={{
          justifyContent: "center",
          marginTop: "24px",
          marginBottom: "16px",
        }}
      >
        <button
          className="login-button primary-medium"
          onClick={() => {
            submit();
          }}
        >
          送出
        </button>
      </Row>
    </Modal>
  );
};

const Login = ({ width, firebase }) => {
  const [modal, setModal] = useState(false);
  var username = React.useRef();
  var password = React.useRef();
  const verse =
    "因為耶和華你神領你進入美地，那地有川，有泉，有源，從谷中和山上流出水來。（申8:7）";
  let login = () => {
    localStorage.setItem("username", username.current.value);
    localStorage.setItem("password", password.current.value);
    firebase
      .auth()
      .signInWithEmailAndPassword(
        username.current.value,
        password.current.value
      )
      .catch((error) => message.error(error.message, 1.5));
  };

  if (width <= 375)
    return (
      <Row
        style={{
          justifyContent: "center",
          width: "100%",
          paddingLeft: "36px",
          paddingRight: "36px",
          backgroundImage: "url(Images/welcome.svg)",
          height: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundColor: "var(--light-blue)",
        }}
      >
        <Col>
          <ForgetPasswdModal show={modal} setModal={setModal} />
          <Row style={{ justifyContent: "flex-start" }}>
            <span
              className="heading0-medium"
              style={{
                marginTop: "180px",
                color: "var(--dark-blue)",
                marginBottom: "24px",
              }}
            >
              歡迎
            </span>
          </Row>
          <p
            className="primary-medium"
            style={{ marginBottom: "56px", color: "var(--p-500)" }}
          >
            {verse}
          </p>
          <Input
            defaultValue={
              localStorage.getItem("username")
                ? localStorage.getItem("username")
                : ""
            }
            innerRef={username}
            type="text"
            placeholder="請輸入電子郵件地址"
            style={{ marginBottom: "16px" }}
          />
          <Input
            defaultValue={
              localStorage.getItem("password")
                ? localStorage.getItem("password")
                : ""
            }
            innerRef={password}
            type="password"
            placeholder="請輸入密碼"
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                login();
              }
            }}
            style={{ marginBottom: "24px" }}
          />
          <Row style={{ justifyContent: "flex-end", marginBottom: "24px" }}>
            <span
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "var(--n-500)",
              }}
              onClick={() => setModal(true)}
            >
              忘記密碼？
            </span>
          </Row>
          <button
            className="login-button primary-medium"
            style={{ marginBottom: "16px" }}
            onClick={login}
          >
            登入
          </button>
          <Row style={{ justifyContent: "center" }}>
            {" "}
            <span
              className="secondary-medium"
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "var(--dark-blue)",
              }}
              onClick={() => history.push("/register")}
            >
              註冊新帳號
            </span>
          </Row>
        </Col>
      </Row>
    );
  else
    return (
      <Row
        style={{
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          background:
            "url(Images/star.svg), linear-gradient(180deg, #5292A2 0%, #E8F8FC 86%)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--light-blue)",
            paddingLeft: "36px",
            paddingRight: "36px",
            height: "fit-content",
            width: "375px",
            borderRadius: "24px",
            boxShadow: "0px 4px 20px rgb(0 0 0 / 10%)",
          }}
        >
          <ForgetPasswdModal show={modal} setModal={setModal} />
          <Row style={{ justifyContent: "flex-start" }}>
            <span
              className="heading0-medium"
              style={{
                marginTop: "62px",
                color: "var(--dark-blue)",
                marginBottom: "24px",
              }}
            >
              歡迎
            </span>
          </Row>
          <p
            className="primary-medium"
            style={{ marginBottom: "56px", color: "var(--p-500)" }}
          >
            {verse}
          </p>
          <Input
            defaultValue={
              localStorage.getItem("username")
                ? localStorage.getItem("username")
                : ""
            }
            innerRef={username}
            type="text"
            placeholder="請輸入電子郵件地址"
            style={{ marginBottom: "16px" }}
          />
          <Input
            defaultValue={
              localStorage.getItem("password")
                ? localStorage.getItem("password")
                : ""
            }
            innerRef={password}
            type="password"
            placeholder="請輸入密碼"
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                login();
              }
            }}
            style={{ marginBottom: "24px" }}
          />
          <Row style={{ justifyContent: "flex-end", marginBottom: "24px" }}>
            <span
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "var(--n-500)",
              }}
              onClick={() => setModal(true)}
            >
              忘記密碼？
            </span>
          </Row>
          <button
            className="login-button primary-medium"
            style={{ marginBottom: "16px" }}
            onClick={login}
          >
            登入
          </button>
          <Row style={{ justifyContent: "center", marginBottom: "62px" }}>
            {" "}
            <span
              className="secondary-medium"
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "var(--dark-blue)",
              }}
              onClick={() => history.push("/register")}
            >
              註冊新帳號
            </span>
          </Row>
        </div>
      </Row>
    );
};

export default Login;
