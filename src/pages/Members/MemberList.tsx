import React, { useState } from "react";
import { Button, Input, Divider, Table, Modal, Typography, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { DeleteFilled } from "@ant-design/icons";

const { Search } = Input;
const { Text, Title } = Typography;

interface MemberDataType {
  name: string;
  role: string;
  joinDate: string;
}

const projectUser = [
  { name: "Nguyen Van A", role: "Project Owner", joinDate: new Date(), id: 1 },
  {
    name: "Nguyen Van B",
    role: "Project Manager",
    joinDate: new Date(),
    id: 2,
  },
  {
    name: "Nguyen Van C",
    role: "Project Supervisor",
    joinDate: new Date(),
    id: 3,
  },
  { name: "Nguyen Van D", role: "Project Member", joinDate: new Date(), id: 4 },
  { name: "Nguyen Van E", role: "Project Member", joinDate: new Date(), id: 5 },
  { name: "Nguyen Van F", role: "Project Member", joinDate: new Date(), id: 6 },
  { name: "Nguyen Van G", role: "Project Member", joinDate: new Date(), id: 7 },
  { name: "Nguyen Van E", role: "Project Member", joinDate: new Date(), id: 8 },
  { name: "Nguyen Van F", role: "Project Member", joinDate: new Date(), id: 9 },
  {
    name: "Nguyen Van G",
    role: "Project Member",
    joinDate: new Date(),
    id: 10,
  },
];

const MemberList: React.FC = () => {
  const [memberData, setMemberData] = useState<any[]>(projectUser);
  const [searchInput, setSearchInput] = useState<string>("");
  const [memberInfoModal, setmemberInfoModal] = useState<any>({});
  const [showMemberInfoModal, setShowMemberInfoModal] =
    useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [newMem, setNewMem] = useState<object>({});

  // Validate điều kiện 1 dự án chỉ có 1 owner và 3 manager
  let managerOptionValidate = memberData.filter((data: any) => {
    return data.role === "Project Manager";
  });

  let ownerOptionValidate = memberData.filter((data: any) => {
    return data.role === "Project Owner";
  });
  // Kết thúc Validate

  const roleSelectOptions = [
    {
      value: "Project Owner",
      label: "Project Owner",
      disabled: ownerOptionValidate.length >= 1 && true,
    },
    {
      value: "Project Manager",
      label: "Project Manager",
      disabled: managerOptionValidate.length >= 3 && true,
    },
    { value: "Project Supervisor", label: "Project Supervisor" },
    { value: "Project Member", label: "Project Member" },
  ];

  // Add Member function trong modal
  const handleAddMember = (value: any) => {
    setShowAddMemberModal(false);
  };

  // Search Member trong bảng chính: Cần API search theo tên thành viên trong dự án
  const handleSearchMember = (value: string) => {
    setSearchInput("");
  };

  // Update Role cho member trong dự án: Cần API cập nhật lại thông tin người dùng trong dự án
  const updateRole = (selectValue: any, indexValue: number) => {
    let updatedRole = memberData.map((element: any, index: number) => {
      if (indexValue === index) {
        return { ...element, role: selectValue };
      }
      return element;
    });
    setMemberData(updatedRole);
  };

  // Cũng gọi API để cập nhật lại người dùng trong dự án?
  const handleDeleteMember = (indexValue: any) => {
    let newData = memberData.filter((element: any, index: number) => {
      return indexValue !== index;
    });
    setMemberData(newData);
  };

  // Show thông tin chi tiết member khi click vào từng member
  // Nếu show thông tin chi tiết thì lại cần 1 API để get chi tiết user?
  const showMemberModal = (indexValue: any) => {
    let memberInfo = memberData.filter((element: any, index: number) => {
      return indexValue === index;
    });
    setmemberInfoModal(memberInfo[0]);
    setShowMemberInfoModal(true);
  };

  // Setup Table
  const columns: ColumnsType<MemberDataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",

      render: (_, record: MemberDataType, index: number) => {
        return (
          <>
            <Text
              onClick={() => {
                showMemberModal(index);
              }}
            >
              {record.name}
            </Text>
          </>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record: MemberDataType, index: number) => {
        return (
          <>
            <Select
              onSelect={(value) => updateRole(value, index)}
              value={record.role}
              options={roleSelectOptions}
              dropdownMatchSelectWidth={false}
            />
          </>
        );
      },
    },
    {
      title: "Join date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record: MemberDataType, index: number) => {
        return (
          <>
            <Button
              disabled
              icon={<DeleteFilled />}
              onClick={() => handleDeleteMember(index)}
            />
          </>
        );
      },
    },
  ];

  const data: MemberDataType[] = memberData.map((data) => {
    return {
      key: data.id,
      name: data.name,
      role: data.role,
      joinDate: moment(data.joinDate).format("DD/MM/YYYY"),
    };
  });
  //Kết thúc setup table

  return (
    <div className="member-list">
      {/* Member Info Modal */}
      <Modal
        footer={null}
        centered
        open={showMemberInfoModal}
        onCancel={() => {
          setShowMemberInfoModal(false);
        }}
      >
        <p>{memberInfoModal.id}</p>
        <p>{memberInfoModal.name}</p>
        <p>{memberInfoModal.role}</p>
        <p>{moment(memberInfoModal.joinDate).format("DD/MM/YYYY")}</p>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        centered
        open={showAddMemberModal}
        onCancel={() => {
          setShowAddMemberModal(false);
        }}
        footer={
          <>
            <Button type="primary" onClick={handleAddMember}>
              Add Members
            </Button>
            <Button onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
          </>
        }
      >
        <Title level={3}>Add Members</Title>
        {/* Tìm User trong công ty để nhét vào dự án 
        Call API search User theo input? */}
        <Search
          value={searchInput}
          allowClear
          onChange={(event: any) => setSearchInput(event?.target.value)}
          onSearch={handleSearchMember}
          placeholder="Full Name"
          size="large"
          style={{ width: "300px" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2rem 0",
          }}
        >
          <div>Full Name</div>
          <div>Select Role</div>
          <div>X</div>
        </div>
      </Modal>

      {/* Main Content */}
      <div className="header">
        <Button
          type="primary"
          size="large"
          onClick={() => setShowAddMemberModal(true)}
        >
          Add Members
        </Button>
        <Search
          value={searchInput}
          allowClear
          onChange={(event: any) => setSearchInput(event?.target.value)}
          onSearch={handleSearchMember}
          placeholder="Member Name"
          size="large"
          style={{ width: "300px" }}
        />
      </div>
      <Divider />
      <div className="content">
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1440 }}
          pagination={{ position: ["bottomCenter"] }}
        />
      </div>
    </div>
  );
};

export default MemberList;
