import Select, { components } from "react-select";
/*
options: [{
    value: ...,
    label: ...
}, ...]
*/
const DropdownIndicator = (props) => {
  const { menuIsOpen } = props.selectProps; // Detect if the menu is open
  return (
    <components.DropdownIndicator {...props}>
      <img
        alt={menuIsOpen ? "up" : "down"}
        src={
          process.env.PUBLIC_URL +
          (menuIsOpen ? "/Images/arrow_up.svg" : "/Images/arrow_down.svg")
        }
      />
    </components.DropdownIndicator>
  );
};

const MySelect = ({
  options,
  onChange,
  value,
  defaultValue,
  autoFocus = false,
  isMulti = false,
  isSearchable = false,
  style = {},
  container_style = {},
  menu_style = {},
  option_style = {},
  placeholder = "",
}) => {
  let key_value = {};
  for (let option of options) key_value[option.value] = option.label;
  return (
    <Select
      placeholder={placeholder}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      isMulti={isMulti}
      value={value}
      options={options}
      onChange={(v) => {
        onChange(v);
      }}
      components={{
        DropdownIndicator,
      }}
      menuPortalTarget={document.body}
      classNames={{
        control: () => "primary-regular select",
        menu: () => "select-menu primary-regular",
        option: () => "select-item",
        multiValue: () => "secondary-regular",
      }}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        container: (base) => ({ ...base, ...container_style }),
        indicatorContainer: (base) => ({ ...base, padding: "0" }),
        indicatorSeparator: () => ({ display: "none" }),
        control: (base) => {
          delete base["&:hover"];
          delete base["boxShadow"];
          delete base["borderColor"];
          delete base["borderWidth"];
          return { ...base, ...style, outline: "0", "&:hover": {} };
        },
        menu: (base) => ({ ...base, ...menu_style }),
        option: (base) => {
          delete base[":active"];
          return {
            ...base,
            backgroundColor: "var(--white)",
            color: "#000000",
            ...option_style,
          };
        },
        multiValue: (base) => ({
          ...base,
          paddingRight: "4px !important",
          borderRadius: "4px",
          paddingLeft: "8px !important",
        })
      }}
      isSearchable={isSearchable}
    />
  );
};
export default MySelect;
