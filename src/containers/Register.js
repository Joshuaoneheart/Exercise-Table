import { message } from "antd";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { DB } from "db/firebase";
import Account from "Models/Account";
import React, { useEffect, useState } from "react";
import { Row, Select, Input } from "components";
const Register = ({ width, firebase }) => {
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [gender, setGender] = useState("男");
  const register = (event) => {
    if (pw !== pwCheck) {
      message.error("兩次輸入密碼不一致");
      return;
    }
    if (!pw) {
      message.error("密碼為必填");
      return;
    }
    if (!email) {
      message.error("電子郵件地址為必填");
      return;
    }
    if (!name) {
      message.error("姓名為必填");
      return;
    }
    if (/@ntu\.edu\.tw$/.test(email) || /@mail\.ntust\.edu\.tw/.test(email)) {
      message.error(
        "請使用非台大或台科大的學校信箱進行註冊，因台大或台科大信箱會擋驗證信"
      );
      return;
    }
    event.target.disabled = true;
    setCreate(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then(async (user_data) => {
        let account = new Account(
          {
            id: user_data.user.uid,
            displayName: name,
            email: email,
            registered: firebase.firestore.FieldValue.serverTimestamp(),
            role: "Member",
            status: "Pending",
            gender,
          },
          true
        );
        await firebase.auth().currentUser.sendEmailVerification();
        await account.save(true);
        message.success("成功創建帳戶");
        await DB.signOut();
        window.location = window.location.href.replace("register", "/");
      })
      .catch((error) => {
        message.error(error.message);
        event.target.disabled = false;
      });
  };
  useEffect(() => {
    // if have signed in, sign out
    let checkSignedIn = async () => {
      if (!create && firebase.auth().uid) {
        await DB.signOut();
        window.location = window.location.href.replace("register", "/");
      }
    };
    checkSignedIn();
  }, [firebase, create]);
  if (width <= 375)
    return (
      <FirebaseAuthConsumer>
        <Row
          style={{
            justifyContent: "center",
            width: "100%",
            paddingLeft: "36px",
            paddingRight: "36px",
            backgroundImage: "url(Images/signup.svg)",
            height: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundColor: "var(--light-blue)",
            overflowY: "scroll",
            backgroundAttachment: "local",
          }}
        >
          <div>
            <Row>
              <span
                className="heading0-medium"
                style={{
                  marginTop: "110px",
                  color: "var(--dark-blue)",
                  marginBottom: "36px",
                }}
              >
                創建新帳號
              </span>
            </Row>
            <Row style={{ marginBottom: "4px" }}>
              <span>姓名（請使用本名）</span>
            </Row>
            <Input
              type="text"
              placeholder="請輸入姓名"
              onChange={(v) => {
                setName(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>電子郵件地址</span>
            </Row>
            <Input
              type="text"
              placeholder="請輸入電子郵件地址"
              onChange={(v) => {
                setEmail(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>密碼</span>
            </Row>
            <Input
              type="password"
              placeholder="請輸入密碼"
              required
              onChange={(v) => {
                setPw(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>再次確認密碼</span>
            </Row>
            <Input
              type="password"
              placeholder="請再次輸入密碼"
              onChange={(v) => {
                setPwCheck(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>性別</span>
            </Row>
            <Select
              defaultValue={{
                value: "男",
                label: <span style={{ whiteSpace: "pre" }}>弟兄</span>,
              }}
              options={[
                {
                  value: "男",
                  label: <span style={{ whiteSpace: "pre" }}>弟兄</span>,
                },
                {
                  value: "女",
                  label: <span style={{ whiteSpace: "pre" }}>姊妹</span>,
                },
              ]}
              onChange={(v) => {
                setGender(v.value);
              }}
              name="gender"
            />
            <button
              style={{ marginBottom: "32px", marginTop: "70px" }}
              className="primary-medium login-button"
              onClick={register}
            >
              完成
            </button>
          </div>
        </Row>
      </FirebaseAuthConsumer>
    );
  else
    return (
      <FirebaseAuthConsumer>
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
            <Row>
              <span
                className="heading0-medium"
                style={{
                  marginTop: "32px",
                  color: "var(--dark-blue)",
                  marginBottom: "36px",
                }}
              >
                創建新帳號
              </span>
            </Row>
            <Row style={{ marginBottom: "4px" }}>
              <span>姓名（請使用本名）</span>
            </Row>
            <Input
              type="text"
              placeholder="請輸入姓名"
              onChange={(v) => {
                setName(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>電子郵件地址</span>
            </Row>
            <Input
              type="text"
              placeholder="請輸入電子郵件地址"
              onChange={(v) => {
                setEmail(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>密碼</span>
            </Row>
            <Input
              type="password"
              placeholder="請輸入密碼"
              required
              onChange={(v) => {
                setPw(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>再次確認密碼</span>
            </Row>
            <Input
              type="password"
              placeholder="請再次輸入密碼"
              onChange={(v) => {
                setPwCheck(v);
              }}
              style={{ marginBottom: "16px" }}
            />
            <Row style={{ marginBottom: "4px" }}>
              <span>性別</span>
            </Row>
            <Select
              defaultValue={{
                value: "男",
                label: <span style={{ whiteSpace: "pre" }}>弟兄</span>,
              }}
              options={[
                {
                  value: "男",
                  label: <span style={{ whiteSpace: "pre" }}>弟兄</span>,
                },
                {
                  value: "女",
                  label: <span style={{ whiteSpace: "pre" }}>姊妹</span>,
                },
              ]}
              onChange={(v) => {
                setGender(v.value);
              }}
              name="gender"
            />
            <button
              style={{ marginBottom: "32px", marginTop: "48px" }}
              className="primary-medium login-button"
              onClick={register}
            >
              完成
            </button>
          </div>
        </Row>
      </FirebaseAuthConsumer>
    );
};

export default Register;
