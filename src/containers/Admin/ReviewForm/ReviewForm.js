import { CRow } from "@coreui/react";
import Form from "components/Form";
import { useState } from "react";

const ReviewForm = () => {
  const [thisWeek, setThisWeek] = useState(true);
  return (
    <CRow>
      <Form thisWeek={thisWeek} setThisWeek={setThisWeek} />
    </CRow>
  );
};

export default ReviewForm;
