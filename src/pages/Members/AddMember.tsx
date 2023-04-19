import React, { useEffect, useState, useRef } from "react";
import { Input, Typography, Button, Row, InputRef } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

interface PropTypes {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserSearchResult {
  email: string;
  fullName: string;
  username: string;
  avatar: string;
}

const AddMember: React.FC<PropTypes> = ({ closeModal }) => {
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const [searchInput, setSearchInput] = useState<string>();
  const [searchResult, setSearchResult] = useState<UserSearchResult[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchInput) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [searchInput]);

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
          setSearchResult(response.data.users);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    setTimeout(searchUsers, 1000);
  }, [searchInput]);

  console.log(searchResult);

  const handleSearchUsers = (event: any) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="add-member">
      {" "}
      <Title level={3}>Add Members</Title>
      <div className="search-box-container" style={{ width: "300px" }}>
        <Search
          value={searchInput}
          allowClear
          onChange={handleSearchUsers}
          placeholder="Full Name"
          size="large"
        />
        {isShow && (
          <div style={{ border: "1px solid black" }}>
            {isLoading ? (
              <LoadingOutlined />
            ) : (
              <>
                <div
                  onClick={() => {
                    setIsShow(false);
                  }}
                >
                  User 1
                </div>
                <div
                  onClick={() => {
                    setIsShow(false);
                  }}
                >
                  User 2
                </div>
                <div
                  onClick={() => {
                    setIsShow(false);
                  }}
                >
                  User 3
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="add-member-list">
        <div>Full Name</div>
        <div>Select Role</div>
        <div>X</div>
      </div>
      <div className="add-member-button">
        <Button type="primary">Add Members</Button>
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
