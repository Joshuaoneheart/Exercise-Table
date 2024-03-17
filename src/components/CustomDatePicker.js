import { Button, DatePicker, Input, Space } from "antd";
import locale from "antd/es/date-picker/locale/zh_TW";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import { DB } from "db/firebase";
import { useState } from "react";
import { GetWeeklyBaseFromTime } from "utils/date";

const { RangePicker } = DatePicker;
const CustomDatePicker = () => {
  // make sure that the props are dayjs complient.
  // https://day.js.org/docs/en/parse/parse
  const [semesterStart, setSemesterStart] = useState(dayjs(new Date()));
  const [semesterEnd, setSemesterEnd] = useState(dayjs(new Date()));
  const [semesterName, setSemesterName] = useState("");

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
    let check = window.confirm(
      "設定學期資料將會清空以往累計成績以及在學期外之時間無法填寫操練表，確定執行此操作嗎？"
    );
    if (check) {
      // backup previous semester data, backup prefix "$|$"
      let prev = await DB.getByUrl("/info/semester");
      let accounts = await DB.getByUrl("/accounts");
      await accounts.forEach((doc) => {
        let tmp = {};
        tmp["$|$" + prev.name + "|lord_table"] = doc.data().lord_table
          ? doc.data().lord_table
          : 0;
        tmp["$|$" + prev.name + "|total_score"] = doc.data().total_score
          ? doc.data().total_score
          : 0;
        tmp["$|$" + prev.name + "|召會生活操練"] = doc.data()["召會生活操練"]
          ? doc.data()["召會生活操練"]
          : 0;
        tmp["$|$" + prev.name + "|福音牧養操練"] = doc.data()["福音牧養操練"]
          ? doc.data()["福音牧養操練"]
          : 0;
        tmp["$|$" + prev.name + "|神人生活操練"] = doc.data()["神人生活操練"]
          ? doc.data()["神人生活操練"]
          : 0;
        tmp.total_score = 0;
        tmp.lord_table = 0;
        tmp["召會生活操練"] = 0;
        tmp["福音牧養操練"] = 0;
        tmp["神人生活操練"] = 0;
        DB.updateByUrl("/accounts/" + doc.id, tmp);
      });
      let GFs = await DB.getByUrl("/GF");
      await GFs.forEach((doc) => {
        let tmp = {};
        tmp["$|$" + prev.name + "|主日聚會"] = doc.data()["主日聚會"]
          ? doc.data()["主日聚會"]
          : 0;
        tmp["$|$" + prev.name + "|家聚會"] = doc.data()["家聚會"]
          ? doc.data()["家聚會"]
          : 0;
        tmp["$|$" + prev.name + "|小排"] = doc.data()["小排"]
          ? doc.data()["家聚會"]
          : 0;
        tmp["主日聚會"] = 0;
        tmp["家聚會"] = 0;
        tmp["小排"] = 0;
        DB.updateByUrl("/GF/" + doc.id, tmp);
      });
      await DB.updateByUrl("/info/semester", {
        start: semesterStart.toDate(),
        end: semesterEnd.toDate(),
        name: semesterName,
      });
      await DB.updateByUrl("/info/counter", {
        week_counter: GetWeeklyBaseFromTime(semesterStart.toDate()),
      });
      alert("變更完成");
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
