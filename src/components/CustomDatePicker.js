import { Button, DatePicker, Input, Row, Space } from "antd";
import locale from "antd/es/date-picker/locale/zh_TW";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import { useState } from "react";

const { RangePicker } = DatePicker;
const CustomDatePicker = ({ presetStart, presetEnd, semesterID }) => {
  // make sure that the props are dayjs complient.
  // https://day.js.org/docs/en/parse/parse
  const [semesterStart, setSemesterStart] = useState(dayjs(presetStart));
  const [semesterEnd, setSemesterEnd] = useState(dayjs(presetEnd));
  const [semesterName, setSemesterName] = useState(semesterID);

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
    // You may have to add a confirm block for better UX
    // Validation for semester Name/ID should also be done here
    console.log(semesterStart, semesterEnd, semesterName);
  };

  return (
    <>
      <Space>
        <Space.Compact>
          <Input
            style={{ width: "20%" }}
            placeholder="例如： 112-1"
            value={semesterName}
            onChange={(e) => {
              e.preventDefault();
              setSemesterName(e.target.value);
            }}
          />
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
          <Button onClick={submitDate} type="primary">
            儲存
          </Button>
        </Space.Compact>
      </Space>
    </>
  );
};

export default CustomDatePicker;
