import { Button, DatePicker, Input, Space, message } from "antd";
import locale from "antd/es/date-picker/locale/zh_TW";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import { DB, firebase } from "db/firebase";
import SemesterContext from "hooks/semester";
import { useContext, useState } from "react";
import { GetWeeklyBaseFromTime } from "utils/date";

const { RangePicker } = DatePicker;
const CustomDatePicker = ({ startTime }) => {
  // make sure that the props are dayjs complient.
  // https://day.js.org/docs/en/parse/parse
  const [semesterStart, setSemesterStart] = useState(dayjs(new Date()));
  const [semesterEnd, setSemesterEnd] = useState(dayjs(new Date()));
  const [semesterName, setSemesterName] = useState("");
  const { setSemesters } = useContext(SemesterContext);
  const onChange = (value, dateString) => {
    if (value) {
      setSemesterStart(value[0]);
      setSemesterEnd(value[1]);
    }
  };

  const submitDate = async () => {
    // TODO: Yi-Hsin
    // Implement logic to save semester date into the database
    // You may have to add a confirm block for better UX
    // Validation for semester Name/ID should also be done here
    let check = window.confirm("確定新增學期嗎？");
    if (check) {
      // backup previous semester data, backup prefix "$|$"
      await DB.updateByUrl("/info/semester", {
        semesters: firebase.firestore.FieldValue.arrayUnion({
          start: semesterStart.toDate(),
          end: semesterEnd.toDate(),
          name: semesterName,
        }),
      });
      await DB.updateByUrl("/info/counter", {
        week_counter: GetWeeklyBaseFromTime(semesterStart.toDate()),
      });
      setSemesters(null);
      message.success("變更完成");
    }
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
            disabledDate={(current) => {
              if (!startTime) return true;
              return current && dayjs(startTime) > current;
            }}
            id={{
              start: "startInput",
              end: "endInput",
            }}
            onChange={onChange}
            defaultValue={[semesterStart, semesterEnd]}
            size="small"
          />
          <Button onClick={submitDate} type="primary">
            新增學期
          </Button>
        </Space.Compact>
      </Space>
    </>
  );
};

export default CustomDatePicker;
