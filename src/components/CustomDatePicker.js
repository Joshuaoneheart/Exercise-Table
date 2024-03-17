import { CButton, CRow } from "@coreui/react";
import { DatePicker, Row } from "antd";
import locale from "antd/es/date-picker/locale/zh_TW";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import { useState } from "react";

const { RangePicker } = DatePicker;
const CustomDatePicker = (presetStart, presetEnd) => {
  // make sure that the props are dayjs complient.
  // https://day.js.org/docs/en/parse/parse
  const [semesterStart, setSemesterStart] = useState(dayjs(presetStart));
  const [semesterEnd, setSemesterEnd] = useState(dayjs(presetEnd));

  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Selected Time as dateString: ", dateString);
    if (value) {
      setSemesterStart(value[0]);
      setSemesterEnd(value[1]);
    }
  };

  const submitDate = () => {
    // TODO: Yi-Hsin
    // Implement logic to save semester date into the database
    console.log(semesterStart, semesterEnd);
  };

  return (
    <>
      <Row>
        <RangePicker
          locale={locale}
          id={{
            start: "startInput",
            end: "endInput",
          }}
          onChange={onChange}
          defaultValue={[semesterStart, semesterEnd]}
          size="small"
        />
        <CButton size="sm" onClick={submitDate} color="primary">
          儲存
        </CButton>
      </Row>
    </>
  );
};

export default CustomDatePicker;
