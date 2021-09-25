import { CImg } from "@coreui/react";
const Brand = (props) => {
  return (
    <>
      <CImg
        src={process.env.PUBLIC_URL + "/favicon.ico"}
        style={{ width: "32px", marginRight: "15px" }}
      />
      <span style={{ fontSize: "23px", fontFamily: "sans-serif" }}>
        Exercise Table
      </span>
    </>
  );
};
export default Brand;
