import { DB } from "db/firebase";
import { GetWeeklyBase, WeeklyBase2String } from "./date";
const GetProblems = async (form_id, is_filter) => {
  let docs = await DB.getByUrl("/form");
  let problems = [];
  await docs.forEach((doc) => {
    problems.push(Object.assign(doc.data(), { id: doc.id }));
  });
  if (is_filter) {
    let currentForm = await DB.getByUrl(`/forms/${form_id}`);
    problems = problems.filter((x) => currentForm.problems.includes(x.id));
  }

  return problems;
};

const SummaryScore = async (data, problems, id) => {
  let items = [];
  let result = {
    total_score: 0,
    召會生活操練: 0,
    神人生活操練: 0,
    福音牧養操練: 0,
    lord_table: 0,
    score: 0,
    cur_召會生活操練: 0,
    cur_神人生活操練: 0,
    cur_福音牧養操練: 0,
    cur_lord_table: 0,
  };
  const lord_table_id = "0it0L8KlnfUVO1i4VUqi";
  // record if the problem is used in this semester
  let problem_used = {};
  for (let problem of problems) {
    problem_used[problem.id] = 0;
  }
  for (let i = 0; i < data.value.length; i++) {
    items.push({
      week_base: WeeklyBase2String(parseInt(data.ids[i])),
      score: 0,
    });
    for (let problem of problems) {
      if (problem.type === "Grid") {
        for (let suboption of problem["子選項"]) {
          items[i][problem.id + "-" + suboption] = "";
        }
      } else if (problem.type === "MultiGrid") {
        for (let option of problem["選項"]) {
          items[i][problem.id + "-" + option] = 0;
        }
      } else if (problem.type === "MultiChoice") items[i][problem.id] = "";
      else if (problem.type === "Number" || problem.type === "MultiAnswer")
        items[i][problem.id] = 0;
      if (problem.type === "GF") items[i][problem.id] = 0;
      if (problem.type === "GF" && problem.title in data.value[i]) {
        problem_used[problem.id] += 1;
        items[i][problem.id] = data.value[i][problem.title].length;
      }
      if (!(problem.id in data.value[i])) continue;
      if (problem.type === "MultiChoice") {
        items[i][problem.id] = data.value[i][problem.id].ans;
        problem_used[problem.id] += 1;
      } else if (problem.type === "MultiAnswer") {
        items[i][problem.id] = data.value[i][problem.id].ans.length;
        problem_used[problem.id] += 1;
      } else if (problem.type === "Grid") {
        problem_used[problem.id] += 1;
        for (let suboption of problem["子選項"]) {
          if (suboption in data.value[i][problem.id]) {
            items[i][problem.id + "-" + suboption] =
              data.value[i][problem.id][suboption].ans;
          }
        }
      } else if (problem.type === "MultiGrid") {
        problem_used[problem.id] += 1;
        for (let option of problem["選項"]) {
          if (option in data.value[i][problem.id]) {
            items[i][problem.id + "-" + option] =
              data.value[i][problem.id][option].ans.length;
          }
        }
      } else if (problem.type === "Number") {
        problem_used[problem.id] += 1;
        items[i][problem.id] = data.value[i][problem.id].ans;
      }
    }
    items[i].score = data.value[i].scores;
    items[i]["召會生活操練"] = data.value[i]["召會生活操練"];
    items[i]["神人生活操練"] = data.value[i]["神人生活操練"];
    items[i]["福音牧養操練"] = data.value[i]["福音牧養操練"];

    if (parseInt(data.ids[i]) !== GetWeeklyBase()) {
      result.total_score += items[i].score;
      if ("召會生活操練" in items[i])
        result["召會生活操練"] += items[i]["召會生活操練"];
      if ("神人生活操練" in items[i])
        result["神人生活操練"] += items[i]["神人生活操練"];
      if ("福音牧養操練" in items[i])
        result["福音牧養操練"] += items[i]["福音牧養操練"];
      if (data.value[i][lord_table_id])
        result.lord_table += data.value[i][lord_table_id].ans === "有";
    } else {
      result.score = items[i].score;
      if ("召會生活操練" in items[i])
        result["cur_召會生活操練"] = items[i]["召會生活操練"];
      if ("神人生活操練" in items[i])
        result["cur_神人生活操練"] = items[i]["神人生活操練"];
      if ("福音牧養操練" in items[i])
        result["cur_福音牧養操練"] = items[i]["福音牧養操練"];
      if (data.value[i][lord_table_id])
        result.cur_lord_table =
          data.value[i][lord_table_id].ans === "有" ? 1 : 0;
    }
  }

  for (let problem of problems) {
    for (let i = 0; i < items.length; i++) {
      if (problem_used[problem.id] === 0) {
        console.log(problem);
        for (let [k, v] of Object.entries(items[i])) {
          if (k.includes(problem.id)) delete items[i][k];
        }
      }
    }
  }
  return { items, result };
};
export { SummaryScore, GetProblems };
