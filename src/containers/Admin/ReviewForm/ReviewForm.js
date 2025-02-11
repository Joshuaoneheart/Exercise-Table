import Form from "components/Form";
import { useState } from "react";

const ReviewForm = () => {
  const [thisWeek, setThisWeek] = useState(true);
  return <Form thisWeek={thisWeek} setThisWeek={setThisWeek} />;
};

export default ReviewForm;
