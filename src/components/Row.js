const Row = ({ children, style, className }) => {
  return (
    <div className={"myrow " + className} style={style}>
      {children}
    </div>
  );
};
export default Row;
