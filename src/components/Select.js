import { useEffect, useState, useRef } from "react";
/*
options: [{
    key: ...,
    label: ...
}, ...]
*/
const Select = ({
  options,
  isSearchable,
  onChange,
  value,
  style = {},
  menu_style = {},
  option_style = {},
}) => {
  const [key, setKey] = useState(value ? value : options[0].key);
  const [open, setOpen] = useState(false);
  const select = useRef();
  let key_value = {};
  for (let option of options) key_value[option.key] = option.label;
  const select_style = Object.assign(
    {
      backgroundImage: open
        ? "url(Images/arrow_up.svg)"
        : "url(Images/arrow_down.svg)",
    },
    style
  );
  menu_style = Object.assign(
    {
      width: select.current ? select.current.offsetWidth : "0",
      display: open ? "block" : "none",
    },
    menu_style
  );
  option_style = Object.assign(
    { width: select.current ? select.current.offsetWidth : "0" },
    option_style
  );
  useEffect(() => {
    if (!options.some((x) => x.key === key)) setKey(options[0].key);
  }, [options]);
  useEffect(() => {
    onChange(key);
  }, [key]);
  useEffect(() => {
    setKey(value);
  }, [value]);
  return (
    <div
      ref={select}
      tabindex="0"
      className="select primary-regular"
      style={select_style}
      onClick={() => setOpen((v) => !v)}
      onBlur={() => setOpen(false)}
    >
      <span>{key_value[key]}</span>
      <div
        style={{
          width: 0,
          overflow: "visible",
        }}
      >
        <ul className="select-menu" style={menu_style}>
          {options.map((x, i) => (
            <li
              className="select-item"
              key={`select-li-${i}`}
              style={option_style}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setKey(x.key);
              }}
            >
              {x.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Select;
