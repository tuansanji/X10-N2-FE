import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input, Typography, Button, Row, Select } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

interface PropTypes {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  memberData: any[];
  leaderOptionValidate: any[];
}

interface UserSearchResult {
  _id?: string;
  email: string;
  fullName: string;
  username: string;
  avatar: string;
  role?: string;
  id?: string;
}

const AddMember: React.FC<PropTypes> = ({
  closeModal,
  memberData,
  leaderOptionValidate,
}) => {
  const params = useParams();
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const [searchInput, setSearchInput] = useState<string>();
  const [searchResult, setSearchResult] = useState<UserSearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<UserSearchResult[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableSearchResult, setDisableSearchResult] =
    useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [toogleSelect, setToogleSelect] = useState<any>({ isSelected: false });

  const roleSelectOptions = [
    { label: "Manager", value: "manager", disabled: true },
    {
      label: "Leader",
      value: "leader",
      disabled: leaderOptionValidate?.length >= 3 && true,
    },
    { label: "Supervisor", value: "supervisor" },
    { label: "Member", value: "member" },
  ];

  // Đóng mở search result container khi điền/xóa input
  useEffect(() => {
    if (searchInput) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [searchInput]);
  console.log("Member đã join dự án:", memberData);
  console.log("Show Search Restul:", searchResult);
  const handleSearchInput = (event: any) => {
    setError({});
    setSearchInput(event.target.value);
  };

  // Gửi request search user trên hệ thống
  // Set vào state hiển thị kết quả search
  useEffect(() => {
    const searchUsers = async () => {
      try {
        if (searchInput) {
          setIsLoading(true);
          const response = await axios({
            method: "get",
            url: `${process.env.REACT_APP_BACKEND_URL}/user/search`,
            params: { query: searchInput },
            headers: { Authorization: `Bearer ${token}` },
          });

          // Lọc trong kết quả search những ai đã có trong dự án
          let validatedSearchResult = response.data.users?.map(
            (result: UserSearchResult) => {
              if (
                memberData.some(
                  (memberInfo: any) => memberInfo.data._id === result._id
                )
              ) {
                return { ...result, isJoined: true };
              } else {
                return result;
              }
            }
          );
          setSearchResult(validatedSearchResult);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    setTimeout(searchUsers, 1000);
  }, [searchInput]);

  // Chọn User sau khi có kết quả Search
  // Set vào state hiển thị danh sách được chọn
  const selectSearchResult = (indexValue: number) => {
    setToogleSelect({
      ...toogleSelect,
      isSelected: !toogleSelect.isSelected,
      index: indexValue,
    });
    let selected = searchResult.filter(
      (result: UserSearchResult, index: number) => {
        return index === indexValue;
      }
    );

    if (!selectedResult.includes(selected[0])) {
      setSelectedResult([...selectedResult, selected[0]]);
    } else {
      let finalResult = selectedResult?.filter((item: UserSearchResult) => {
        return item._id !== selected[0]._id;
      });
      setSelectedResult(finalResult);
    }
  };

  // Chọn role cho thành viên để add vào dự án
  const handleSelectRole = (value: string, indexValue: number) => {
    let selectedItem = selectedResult?.map(
      (item: UserSearchResult, index: number) => {
        if (indexValue === index) {
          return { ...item, role: value, id: item._id };
        } else return item;
      }
    );
    setSelectedResult(selectedItem);
  };

  // Cancel User nếu không muốn add vào dự án nữa
  const cancelSelectedUser = (indexValue: number) => {
    let updatedResult = selectedResult?.filter(
      (result: UserSearchResult, index: number) => {
        return indexValue !== index;
      }
    );
    setSelectedResult(updatedResult);
  };

  const handleAddMembers = async () => {
    try {
      if (selectedResult.length > 0) {
        setIsLoading(true);
        const response = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/project/members/add/${params.projectId}`,
          data: selectedResult.map(({ role, id }) => ({ role, id })),
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        setIsLoading(false);
        closeModal(false);
      } else {
        setError({ ...error, message: "Please add members" });
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="add-member">
      {" "}
      <Title level={3}>Add Members</Title>
      <div className="search-box-container" style={{ width: "300px" }}>
        <Search
          value={searchInput}
          allowClear
          onChange={handleSearchInput}
          placeholder="Full Name"
          size="large"
        />
        {isShow && (
          <div className="search-result-container">
            {isLoading ? (
              <LoadingOutlined />
            ) : (
              <>
                {searchResult?.map((result: any, index: number) => {
                  return (
                    <div
                      key={result._id}
                      style={{
                        cursor: result.isJoined ? "not-allowed" : "pointer",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            (toogleSelect.isSelected &&
                              toogleSelect.index === index) ||
                            result.isJoined
                              ? "#d1d6de"
                              : "",
                        }}
                        className={`search-result-item ${
                          result.isJoined ? "disabled-item" : ""
                        }`}
                        onClick={() => {
                          selectSearchResult(index);
                        }}
                      >
                        <img src={result.avatar} alt="user-avatar" />
                        <Text>{result.fullName}</Text>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
        <div className="error-message">
          {error.message ?? <>{error.message}</>}
        </div>
      </div>
      <div className="add-member-container">
        {selectedResult?.map((result: UserSearchResult, index: number) => {
          return (
            <div key={result._id} className="add-member-item">
              <div className="item-content">
                <img src={result.avatar} alt="user-avatar" />
                {result.fullName}
              </div>
              <div className="item-action">
                <Select
                  options={roleSelectOptions}
                  placeholder="Select role"
                  onSelect={(value) => {
                    handleSelectRole(value, index);
                  }}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    cancelSelectedUser(index);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="add-member-button">
        <Button type="primary" onClick={handleAddMembers}>
          {isLoading && <LoadingOutlined />} Add Members
        </Button>
        <Button
          onClick={() => {
            closeModal(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddMember;
