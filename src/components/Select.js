import { useEffect, useState } from "react";

const Select = ({
  options,
  onChange,
  width,
  style = {},
  menu_style = {},
  option_style = {},
}) => {
  const [key, setKey] = useState(options[0].key);
  const [open, setOpen] = useState(false);
  let key_value = {};
  for (let option of options) key_value[option.key] = option.label;
  const select_style = Object.assign(
    {
      backgroundImage: open
        ? "url(Images/arrow_up.svg)"
        : "url(Images/arrow_down.svg)",
      minWidth: width,
    },
    style
  );
  menu_style = Object.assign(
    { width, display: open ? "block" : "none" },
    menu_style
  );
  option_style = Object.assign({ width }, option_style);
  useEffect(() => {
    onChange(key);
  }, [key]);
  return (
    <div
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
