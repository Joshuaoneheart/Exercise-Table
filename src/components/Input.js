const Input = ({
  style,
  innerRef,
  placeholder = "",
  onChange,
  defaultValue,
  onKeyUp,
  type = "text",
}) => {
  return (
    <input
      defaultValue={defaultValue}
      className="primary-regular input"
      style={style}
      ref={innerRef}
      type={type}
      placeholder={placeholder}
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
      }}
      onKeyUp={(e) => {
        if (onKeyUp) onKeyUp(e);
      }}
    />
  );
};
export default Input;
