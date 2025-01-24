const Input = ({ style, placeholder, onChange }) => {
  return (
    <input
      className="primary-regular input"
      style={style}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default Input;
