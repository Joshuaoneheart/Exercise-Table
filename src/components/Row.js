const Row = ({ children, style, className }) => {
  return (
    <div className={"row " + className} style={style}>
      {children}
    </div>
  );
};
export default Row;
