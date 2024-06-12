import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { DB } from "db/firebase";
import { useEffect, useState } from "react";
import { message } from "antd";
import Select from "react-select";
import { GetProblems } from "utils/problem";

const ImportProblemModal = ({ form_id, show, data, setModal, setData }) => {
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState(null);

  var writeData = async () => {
    if (problem === null) {
      message.error("請選擇問題");
      return;
    }
    let new_problem = await DB.getByUrl(`/form/${problem.id}`);
    new_problem.id = problem.id;
    setData([...data, new_problem]);
    message.success("匯入成功");
    setModal(false);
    setOptions(null);
    setProblem(null);
  };
  useEffect(() => {
    const GetOptions = async () => {
      const problems = await GetProblems(null, false);
      setOptions(
        problems
          .filter((x) => !data.map((y) => y.id).includes(x.id))
          .map((x) => {
            return {
              value: x,
              label: <span style={{ whiteSpace: "pre" }}>{x.title}</span>,
            };
          })
      );
    };
    if (options === null) GetOptions();
  }, [form_id, data, options]);
  if (!show) {
    return null;
  }
  return (
    <CModal
      show={show}
      size="lg"
      onClose={() => {
        setModal(false);
      }}
    >
      <CModalHeader closeButton>
        <CModalTitle>匯入問題</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <Select
          value={
            problem && {
              value: problem,
              label: <span style={{ whiteSpace: "pre" }}>{problem.title}</span>,
            }
          }
          options={options}
          isSearchable
          onChange={(v) => {
            setProblem(v.value);
          }}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={writeData}>
          匯入
        </CButton>{" "}
        <CButton
          color="secondary"
          onClick={() => {
            setModal(false);
          }}
        >
          取消
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ImportProblemModal;
