import { Dropdown, DropdownProps } from "antd";
import React from "react";

interface PropsType {
  children: any;
  className: string;
  items: any;
  open: boolean;
  onOpenChange: (flag: boolean) => void;
}

const CustomDropdown: React.FC<PropsType> = ({
  children,
  className,
  items,
  open,
  onOpenChange,
}) => {
  return (
    <>
      <Dropdown
        trigger={["click"]}
        className={className}
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
