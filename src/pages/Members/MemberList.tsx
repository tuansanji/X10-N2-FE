import React, { useState } from "react";
import { Button, Input, Divider, Table, Modal, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { DeleteFilled } from "@ant-design/icons";
const { Search } = Input;

const { Text } = Typography;

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
  const [modalInfo, setModalInfo] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (indexValue: any) => {
    let newData = memberData.filter((element: any, index: number) => {
      return indexValue !== index;
    });
    setMemberData(newData);
  };
  const showModal = (indexValue: any) => {
    let memberInfo = memberData.filter((element: any, index: number) => {
      return indexValue === index;
    });
    setModalInfo(memberInfo[0]);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
                showModal(index);
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
              icon={<DeleteFilled />}
              onClick={() => handleDelete(index)}
            />
          </>
        );
      },
    },
  ];

  const data: MemberDataType[] = memberData.map((data) => {
    return {
      name: data.name,
      role: data.role,
      joinDate: moment(data.joinDate).format("DD/MM/YYYY"),
    };
  });

  return (
    <div className="member-list">
      <Modal
        footer={null}
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{modalInfo.id}</p>
        <p>{modalInfo.name}</p>
        <p>{modalInfo.role}</p>
        <p>{moment(modalInfo.joinDate).format("DD/MM/YYYY")}</p>
      </Modal>
      <div className="header">
        <Button type="primary" size="large">
          Add Members
        </Button>
        <Search
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
