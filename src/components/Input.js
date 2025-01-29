const Input = ({ style, placeholder = "", onChange, defaultValue }) => {
  return (
    <input
      defaultValue={defaultValue}
      className="primary-regular input"
      style={style}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default Input;
