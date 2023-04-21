import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Params, useParams } from "react-router-dom";
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
import dayjs from "dayjs";
import { formatDate } from "../../ultils/formatDate";
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

interface PopupPropTypes {
  record: MemberDataType;
  token: string;
  params: { projectId?: string };
  setMemberData: React.Dispatch<React.SetStateAction<any[]>>;
}

interface MemberRolePropTypes {
  record: MemberDataType;
  roleSelectOptions: any[];
  params: { projectId?: string };
  token: string;
  setMemberData: React.Dispatch<React.SetStateAction<any[]>>;
}

const DeleteConfirmPopup: React.FC<PopupPropTypes> = ({
  record,
  params,
  token,
  setMemberData,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleConfirm = async (stages: MemberDataType) => {
    setConfirmLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/project/members/remove/${params.projectId}`,
        headers: { Authorization: `Bearer ${token}` },
        data: { id: stages.key },
      });
      setMemberData(response.data.members);
      message.success(response.data.message);
      setConfirmLoading(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Popconfirm
        disabled={record.role === "manager" && true}
        placement="topRight"
        title="Delete Member"
        description="Are you sure to delete this member?"
        open={open}
        onConfirm={() => handleConfirm(record)}
        onCancel={() => setOpen(false)}
        okButtonProps={{ loading: confirmLoading }}
      >
        <Button
          icon={<DeleteFilled />}
          disabled={record.role === "manager" && true}
          onClick={() => setOpen(true)}
        />
      </Popconfirm>
    </>
  );
};

const UpdateMemberRole: React.FC<MemberRolePropTypes> = ({
  record,
  roleSelectOptions,
  params,
  token,
  setMemberData,
}) => {
  const [roleUpdating, setRoleUpdating] = useState<boolean>(false);
  const updateRole = async (selectValue: any, record: MemberDataType) => {
    console.log(record);
    setRoleUpdating(true);
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/project/members/update/${params.projectId}`,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          id: record.key,
          role: selectValue,
          joiningDate: formatDate(record.joinDate),
        },
      });
      setMemberData(response.data.members);
      message.success(response.data.message);
      setRoleUpdating(false);
    } catch (err) {
      console.error(err);
      setRoleUpdating(false);
    }
  };
  return (
    <>
      <Select
        loading={roleUpdating && true}
        disabled={record.role === "manager" && true}
        onSelect={(value) => updateRole(value, record)}
        value={record.role}
        options={roleSelectOptions}
        dropdownMatchSelectWidth={false}
      />
    </>
  );
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
  const [searchResult, setSearchResult] = useState<any>(null);

  // Lấy List member thuộc project
  // **** CẦN THÊM PAGE INDEX, PAGE SIZE ĐỂ LẤY THEO PAGE ******
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
  let leaderCount = memberData.filter((data: any) => {
    return data.role === "leader";
  });

  const roleSelectOptions = [
    {
      value: "manager",
      label: "Manager",
      disabled: true,
    },
    {
      value: "leader",
      label: "Leader",
      disabled: leaderCount.length >= 3 && true,
    },
    { value: "supervisor", label: "Supervisor" },
    { value: "member", label: "Member" },
  ];
  // Kết thúc Validate

  // Search Member thuộc project
  useEffect(() => {
    const searchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_URL}/user/search`,
          params: { query: searchInput },
          headers: { Authorization: `Bearer ${token}` },
        });
        let result = memberData.filter((data: any) =>
          response.data.users.some((user: any) => user._id === data.data._id)
        );
        setSearchResult(result);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    setTimeout(searchUsers, 1000);
  }, [searchInput]);

  // Show thông tin chi tiết member khi click vào từng member
  // Nếu show thông tin chi tiết thì lại cần 1 API để get chi tiết user?
  const showMemberModal = (indexValue: any) => {
    let memberInfo = memberData.filter((element: any, index: number) => {
      return indexValue === index;
    });
    setmemberInfoModal(memberInfo[0]);
    setShowMemberInfoModal(true);
  };

  // **** PAGE CHANGE SẼ GỬI TIẾP API GET USER MEMBER ĐỂ LẤY THEO PAGE TƯƠNG ỨNG ****
  // HOẶC UPDATE LẠI PAGE INDEX, GẮN VÀO REQUEST Ở EFFECT PHÍA TRÊN
  const handlePageChange = (page: number, pageSize: number) => {
    console.log(page);
    console.log(pageSize);
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
            <UpdateMemberRole
              setMemberData={setMemberData}
              params={params}
              token={token}
              record={record}
              roleSelectOptions={roleSelectOptions}
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
            <DeleteConfirmPopup
              setMemberData={setMemberData}
              record={record}
              params={params}
              token={token}
            />
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

  const searchData: MemberDataType[] = searchResult?.map((data: any) => {
    return {
      key: data.data._id,
      name: data.data.fullName,
      role: data.role,
      joinDate: moment(data.joiningDate).format("DD/MM/YYYY"),
    };
  });

  // Show data của bảng tùy theo input ở searchBar
  function showData() {
    if (searchResult.length > 0) {
      return searchData;
    } else if (searchInput && searchResult.length === 0) {
      return undefined;
    } else if (searchInput === "" && searchResult.length === 0) {
      return data;
    }
  }

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
          setMemberData={setMemberData}
          closeModal={setShowAddMemberModal}
          memberData={memberData}
          leaderCount={leaderCount}
        />
      </Modal>

      {/* Main Content */}
      <div className="header">
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setSearchInput("");
            setShowAddMemberModal(true);
          }}
        >
          Add Members
        </Button>

        {/* Search Project Member Input */}
        <Search
          value={searchInput}
          allowClear
          onChange={(event: any) => setSearchInput(event.target.value)}
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
            dataSource={showData()}
            scroll={{ x: 1440 }}
            pagination={{
              position: ["bottomCenter"],
              total: memberData.length,
              pageSize: 8,
              defaultCurrent: 1,
              onChange: handlePageChange,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MemberList;
