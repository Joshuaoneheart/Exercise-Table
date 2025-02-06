const Col = ({ children, style, className, onClick }) => {
  return (
    <div className={className + " mycol"} onClick={onClick} style={style}>
      {children}
    </div>
  );
};
export default Col;
