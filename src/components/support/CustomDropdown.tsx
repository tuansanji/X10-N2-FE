import { Dropdown, DropdownProps } from "antd";
import React, { useRef } from "react";

interface PropsType {
  children: any;
  items: any;
  open: boolean;
  onOpenChange: (flag: boolean) => void;
}

const CustomDropdown: React.FC<PropsType> = ({
  children,
  items,
  open,
  onOpenChange,
}) => {
  return (
    <>
      <Dropdown
        className="dropdown_btn"
        trigger={["click"]}
        menu={{ items }}
        open={open}
        onOpenChange={onOpenChange}
      >
        {children}
      </Dropdown>
    </>
  );
};

export default CustomDropdown;
