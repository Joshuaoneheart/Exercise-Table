import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CLabel,
  CRow,
} from "@coreui/react";
import { firebase } from "db/firebase";
import { useState } from "react";
import Select from "react-select";
import { GetWeeklyBase } from "utils/date";
import AddModal from "./AddGFModal";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";

const saveChange = async (
  account_id,
  selected,
  titles,
  GFs,
  setGFs,
  setSelected
) => {
  let v = {};
  let has_created = {};
  for (let i = 0; i < titles.length; i++) {
    v[titles[i]] = [];
    for (let j = 0; j < selected[i].length; j++) {
      if (selected[i][j] in has_created)
        selected[i][j] = has_created[selected[i][j]];
      let value = selected[i][j];
      let index = parseInt(value.split("|")[0]);
      let id = value.split("|")[1];
      let name = value.split("|")[2];
      let school = value.split("|")[3];
      let department = value.split("|")[4];
      let grade = value.split("|")[5];
      let note = value.split("|")[6];
      if (id === "") {
        let res = await firebase.firestore().collection("GF").add({
          name,
          school,
          department,
          grade,
          note,
        });
        v[titles[i]].push(res.id);
        GFs[index].id = res.id;
        has_created[value] =
          index +
          "|" +
          res.id +
          "|" +
          name +
          "|" +
          school +
          "|" +
          department +
          "|" +
          grade +
          "|" +
          note;
          selected[i][j] = has_created[value];
      } else v[titles[i]].push(id);
    }
  }
  await firebase
    .firestore()
    .collection("accounts")
    .doc(account_id)
    .collection("GF")
    .doc(GetWeeklyBase().toString())
    .set(v)
    .then(() => {
      alert("儲存完成");
    })
    .catch((error) => {
      alert(error.message);
    });
  setGFs(Array.from(GFs));
  setSelected(Array.from(selected));
};

const GFFormContent = ({ data, account, default_data }) => {
  const titles = ["家聚會", "小排", "主日聚會"];
  const [GFs, setGFs] = useState(data.value);
  const [addModal, setAddModal] = useState(false);
  let default_selected = [];
  let id_to_v = {};
  for (let i = 0; i < GFs.length; i++) {
    id_to_v[GFs[i].id] =
      i +
      "|" +
      GFs[i].id +
      "|" +
      GFs[i].name +
      "|" +
      GFs[i].school +
      "|" +
      GFs[i].department +
      "|" +
      GFs[i].grade +
      "|" +
      GFs[i].note;
  }
  for (let i in titles) {
    var d = default_data;
    if (d && d.value)
      default_selected.push(
        d.value[titles[i]]
          .map((x) => id_to_v[x])
          .filter((element) => element !== undefined)
      );
    else default_selected.push([]);
  }
  var [selected, setSelected] = useState(default_selected);
  var inputs = [];
  for (let i = 0; i < titles.length; i++) {
    var default_options = [];
    var GF_options = [];
    for (var j = 0; j < GFs.length; j++) {
      if (selected[i].includes(id_to_v[GFs[j].id])) {
        default_options.push({
          value: id_to_v[GFs[j].id],
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>
            </span>
          ),
        });
      } else
        GF_options.push({
          value: id_to_v[GFs[j].id],
          label: (
            <span style={{ whiteSpace: "pre" }}>
              <b>{GFs[j].name}</b>{" "}
              <span>
                {"      " +
                  GFs[j].school +
                  " " +
                  GFs[j].department +
                  " " +
                  GFs[j].grade +
                  " " +
                  GFs[j].note +
                  " "}
              </span>
              {GFs[j].id !== "" && (
                <Link to={"/GF/" + GFs[j].id}>
                  <CIcon name="cil-info" />
                </Link>
              )}
            </span>
          ),
        });
    }
    inputs.push(
      <CFormGroup key={i}>
        <CLabel>{titles[i]}</CLabel>
        <Select
          value={default_options}
          defaultValue={default_options}
          isMulti
          isSearchable
          autoFocus
          options={GF_options}
          defaultMenuIsOpen={false}
          onChange={function (setSelected, selected, i, value) {
            selected[i] = value.map((x) => x.value);
            setSelected(Array.from(selected));
          }.bind(null, setSelected, selected, i)}
        />
      </CFormGroup>
    );
  }
  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol style={{ fontSize: "30px" }}>牧養對象邀約</CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CForm
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          {inputs}
        </CForm>

        <AddModal
          data={GFs}
          setData={setGFs}
          show={addModal}
          setModal={setAddModal}
        />
      </CCardBody>
      <CCardFooter>
        <CButton
          variant="ghost"
          color="primary"
          onClick={function (setAddModal) {
            setAddModal(true);
          }.bind(null, setAddModal)}
        >
          新增牧養對象
        </CButton>
        <CButton
          variant="ghost"
          color="dark"
          onClick={() => {
            saveChange(account.id, selected, titles, GFs, setGFs, setSelected);
          }}
        >
          提交表單
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default GFFormContent;
