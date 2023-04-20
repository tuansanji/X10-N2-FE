import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  Input,
  Divider,
  Table,
  Modal,
  Typography,
  Select,
  Popconfirm,
  message,
  Skeleton,
} from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { DeleteFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import AddMember from "./AddMember";

const { Search } = Input;
const { Text, Title } = Typography;

interface MemberDataType {
  name: string;
  role: string;
  joinDate: string;
  key?: string;
}

const DeleteConfirmPopup: React.FC = () => {
  return <></>;
};

const MemberList: React.FC = () => {
  const params = useParams();
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const [memberData, setMemberData] = useState<any[]>([]);
  const [memberInfoModal, setmemberInfoModal] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMemberInfoModal, setShowMemberInfoModal] =
    useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  // Lấy List member thuộc project
  useEffect(() => {
    const getMemberData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/project/members/${params.projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMemberData(response.data.members);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    getMemberData();
  }, []);

  // Validate điều kiện 1 dự án chỉ có 1 owner và 3 manager
  let leaderOptionValidate = memberData.filter((data: any) => {
    return data.role === "leader";
  });

  let managerOptionValidate = memberData.filter((data: any) => {
    return data.role === "manager";
  });

  const roleSelectOptions = [
    {
      value: "manager",
      label: "Manager",
      disabled: managerOptionValidate.length >= 1 && true,
    },
    {
      value: "leader",
      label: "Leader",
      disabled: leaderOptionValidate.length >= 3 && true,
    },
    { value: "supervisor", label: "Supervisor" },
    { value: "member", label: "Member" },
  ];
  // Kết thúc Validate

  // Add Member function trong modal
  const handleAddMember = (value: any) => {
    setShowAddMemberModal(false);
  };

  // Search Member thuộc project
  const handleSearchMember = (event: any) => {};

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

  // Show thông tin chi tiết member khi click vào từng member
  // Nếu show thông tin chi tiết thì lại cần 1 API để get chi tiết user?
  const showMemberModal = (indexValue: any) => {
    let memberInfo = memberData.filter((element: any, index: number) => {
      return indexValue === index;
    });
    setmemberInfoModal(memberInfo[0]);
    setShowMemberInfoModal(true);
  };

  // Popup confirm khi click vao delete user
  const handleConfirm = async (stages: MemberDataType) => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/project/members/remove/${params.projectId}`,
        headers: { Authorization: `Bearer ${token}` },
        data: stages.key,
      });
      console.log(response);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }

    // message.success("Click on Yes");
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
              disabled={record.role === "manager" && true}
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
            <Popconfirm
              disabled={record.role === "manager" && true}
              placement="topRight"
              title="Delete Member"
              description="Are you sure to delete this member?"
              onConfirm={() => handleConfirm(record)}
            >
              <Button
                icon={<DeleteFilled />}
                disabled={record.role === "manager" && true}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const data: MemberDataType[] = memberData.map((data) => {
    return {
      key: data.data._id,
      name: data.data.fullName,
      role: data.role,
      joinDate: moment(data.joiningDate).format("DD/MM/YYYY"),
    };
  });
  //Kết thúc setup table

  return (
    <div className="member-list">
      {/* Member Info Modal */}
      {/* <Modal
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
      </Modal> */}

      {/* Add Member Modal */}
      <Modal
        centered
        open={showAddMemberModal}
        onCancel={() => {
          setShowAddMemberModal(false);
        }}
        footer={null}
      >
        <AddMember
          closeModal={setShowAddMemberModal}
          memberData={memberData}
          leaderOptionValidate={leaderOptionValidate}
        />
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

        {/* Search Project Member Input */}
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
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="content">
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: 1440 }}
            pagination={{ position: ["bottomCenter"] }}
          />
        </div>
      )}
    </div>
  );
};

export default MemberList;
