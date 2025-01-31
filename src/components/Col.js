const Col = ({ children, style, className }) => {
  return (
    <div className={"mycol " + className} style={style}>
      {children}
    </div>
  );
};
export default Col;
