import { CCardHeader, CCard, CCardBody } from "@coreui/react";
import TrackingTable from "components/TrackingTable";

const HabitTracker = () => {
  return (
    <CCard>
      <CCardHeader>Hello</CCardHeader>
      <CCardBody>
        <TrackingTable />
      </CCardBody>
    </CCard>
  );
};

export default HabitTracker;
