import { useAxios } from "../../hooks";
import { updateUserInfo } from "../../redux/slice/authSlice";
import { requestLogin } from "../../redux/store";
import userApi from "../../services/api/userApi";
import { DatePicker, Input, Select, Space } from "antd";
import { Button, Modal, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { DatePickerProps } from "antd";
import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";

interface IUser {
  avatar: string;
  dob: Date;
  email: string;
  fullName: string;
  gender: string;
  phone: number;
  userType: string;
  username: string;
}
interface IDataEdit {
  field: string;
  data: any;
  requirePassword?: boolean;
}
const UserDetails = () => {
  const [dataImage, setDataImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [fieldUserEdit, setFieldUserEdit] = useState<IDataEdit>({
    field: "",
    data: "",
    requirePassword: false,
  });
  //2 modal
  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [countReload, setCountReload] = useState<number>(1);
  //lấy dữ liệu user
  const { responseData, isLoading } = useAxios("get", "/user/details", [
    countReload,
  ]);
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const { t, i18n } = useTranslation(["content", "base"]);
  const dispatch = useDispatch();
  const userInfo: IUser = useMemo(() => {
    return responseData ? responseData?.user : null;
  }, [responseData]);

  moment.locale(i18n.language);

  useEffect(() => {
    dispatch(updateUserInfo(userInfo));
  }, [userInfo]);

  //thay đổi ngày
  const handleChangeDay: DatePickerProps["onChange"] = (date) => {
    setFieldUserEdit({
      field: "dob",
      data: date,
      requirePassword: false,
    });
  };
  //thay đôi giới tính
  const handleChangeGender = (value: string) => {
    setFieldUserEdit({
      ...fieldUserEdit,
      data: value,
    });
  };
  // xử lí preview ảnh
  const handleImagePreview = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      file.preview = URL.createObjectURL(file);
      setImagePreview(file);
      const formData = new FormData();
      formData.append("avatar", file, file.name);
      setDataImage(formData);
    }
  };
  //edit các field text thường
  const handleEditUser = () => {
    // không yêu cầu mật khẩu -- các field thường
    if (fieldUserEdit.data && !fieldUserEdit.requirePassword) {
      if (fieldUserEdit.field === "phone") {
        fieldUserEdit.data = fieldUserEdit.data.trim();
        if (!/^(0\d{9})$/.test(fieldUserEdit.data)) {
          showMessage("error", "Vui lòng nhập đúng định dạng số điện thoại", 2);
          return;
        }
      }
      showMessage("loading", `${t("content:loading")}...`);
      userApi
        .editUser({
          [fieldUserEdit.field]: fieldUserEdit.data,
        })
        .then((res: any) => {
          showMessage("success", res.message, 2);
          setOpen(false);
          setFieldUserEdit({
            field: "",
            data: "",
            requirePassword: false,
          });
          setCountReload((prev) => prev + 1);
        })
        .catch((err: any) => {
          showMessage("error", err.response.data?.message, 2);
        });
    }
    // Yêu cầu mật khẩu -- các field private
    else if (fieldUserEdit.data && fieldUserEdit.requirePassword) {
      showMessage("loading", `${t("content:loading")}...`);
      userApi
        .editUserPrivate({
          [fieldUserEdit.field]: fieldUserEdit.data,
          oldPassword: currentPassword,
        })
        .then((res: any) => {
          showMessage("success", res.message, 2);
          setOpen(false);
          setCountReload((prev) => prev + 1);
          setFieldUserEdit({
            field: "",
            data: "",
            requirePassword: false,
          });
        })
        .catch((err: any) => {
          showMessage("error", err.response.data?.message, 2);
        });
    }
  };
  // chỉnh sửa avatar
  const handleEditAvatar = () => {
    showMessage("loading", `${t("content:loading")}...`);
    userApi
      .editUser(dataImage)
      .then((res: any) => {
        showMessage("success", res.message, 2);
        setModalImage(false);
        setCountReload((prev) => prev + 1);
      })
      .catch((err: any) => {
        showMessage("error", err.response.data?.message, 2);
      });
  };
  //show modal text
  const showModal = () => {
    setOpen(true);
  };
  //tắt modal
  const handleCancel = () => {
    setOpen(false);
    setModalImage(false);
    setImagePreview(null);
    setFieldUserEdit({
      field: "",
      data: "",
      requirePassword: false,
    });
  };

  return isLoading && !userInfo ? (
    <Skeleton />
  ) : (
    <div className="user__container">
      {contextHolder}
      <div className="basic__info info">
        <div className="info__content">
          <div className="title">
            <h2>{t("content:profileUser.title basic")}</h2>
            <p>{t("content:profileUser.sub title basic")}</p>
          </div>
          <div className=" wrapper" onClick={() => setModalImage(true)}>
            <span>{t("content:profileUser.avatar")}</span>
            <span>{t("content:profileUser.sub avatar")}</span>
            <div className="avatar">
              <img
                src={imagePreview?.preview || userInfo?.avatar}
                alt="avatar"
              />
              <div className="camera">
                <div className="camera__icon"></div>
              </div>
            </div>
          </div>
          <div
            className=" wrapper "
            onClick={() => {
              showModal();
              setFieldUserEdit({
                field: "fullName",
                data: userInfo?.fullName,
              });
            }}
          >
            <span>{t("content:profileUser.fullname")}</span>
            <span>{userInfo?.fullName}</span>
            <RightOutlined />
          </div>
          <div
            className=" wrapper"
            onClick={() => {
              showModal();
              setFieldUserEdit({
                field: "gender",
                data: userInfo?.gender,
              });
            }}
          >
            <span>{t("content:profileUser.gender")}</span>
            <span>
              {userInfo?.gender === "male"
                ? t("content:profileUser.male")
                : userInfo?.gender === "female"
                ? t("content:profileUser.female")
                : t("content:profileUser.other")}
            </span>
            <RightOutlined />
          </div>
          <div
            className=" wrapper"
            onClick={() => {
              showModal();
              setFieldUserEdit({
                field: "phone",
                data: userInfo?.phone,
              });
            }}
          >
            <span>{t("content:profileUser.phone")}</span>
            <span>{userInfo?.phone}</span>
            <RightOutlined />
          </div>
          <div
            className=" wrapper"
            onClick={() => {
              showModal();
              setFieldUserEdit({
                field: "dob",
                data: userInfo?.dob,
              });
            }}
          >
            <span>{t("content:profileUser.date of birth")}</span>
            <span>{moment(userInfo?.dob).format("DD MMMM, YYYY")}</span>
            <RightOutlined />
          </div>
        </div>
      </div>
      <div className="private__info info">
        <div className="info__content">
          <div className="title">
            <h2>{t("content:profileUser.title account")}</h2>
            <p>{t("content:profileUser.title account")}</p>
          </div>
        </div>
        <div
          className=" wrapper"
          onClick={() => {
            showModal();
            setFieldUserEdit({
              field: "email",
              data: userInfo?.email,
              requirePassword: true,
            });
          }}
        >
          <span>Email</span>
          <span>{userInfo?.email}</span>
          <RightOutlined />
        </div>
        <div
          className=" wrapper"
          onClick={() => {
            showModal();
            setFieldUserEdit({
              field: "username",
              data: userInfo?.username,
              requirePassword: true,
            });
          }}
        >
          <span>{t("content:profileUser.username")}</span>
          <span>{userInfo?.username}</span>
          <RightOutlined />
        </div>
        <div
          className=" wrapper"
          onClick={() => {
            showModal();
            setFieldUserEdit({
              field: "newPassword",
              data: "",
              requirePassword: true,
            });
          }}
        >
          <span>{t("content:profileUser.password")}</span>
          <span>*******</span>
          <RightOutlined />
        </div>
      </div>
      {/* modal các field text */}
      <Modal
        title={t("content:profileUser.edit title form")}
        okButtonProps={{ disabled: !fieldUserEdit.data }}
        open={open}
        onOk={handleEditUser}
        onCancel={handleCancel}
        okText={t("base:ok")}
        cancelText={t("base:cancel")}
      >
        <div style={{ padding: "13px 0" }}>
          {fieldUserEdit.field === "dob" && (
            <DatePicker
              style={{ width: "50%" }}
              value={dayjs(fieldUserEdit?.data || userInfo?.dob)}
              onChange={handleChangeDay}
              disabledDate={(current) => {
                return (
                  current && current > dayjs(Date.now()).subtract(1, "year")
                );
              }}
            />
          )}
          {fieldUserEdit.field !== "dob" &&
            fieldUserEdit.field !== "gender" && (
              <div className="form__content">
                {fieldUserEdit.requirePassword && (
                  <div className="form__password">
                    <span>{t("content:profileUser.current password")}</span>
                    <Input.Password
                      value={currentPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          !value.startsWith(" ") &&
                          !value.endsWith(" ") &&
                          /^.{0,18}$/.test(value)
                        ) {
                          setCurrentPassword(e.target.value);
                        }
                      }}
                      placeholder={t("content:profileUser.current password")}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </div>
                )}
                <TextArea
                  value={fieldUserEdit.data}
                  placeholder={
                    fieldUserEdit?.field === "newPassword"
                      ? `${t("content:profileUser.new")} ${t(
                          "content:profileUser.password"
                        )}...`
                      : `${t("content:profileUser.new")} ${
                          fieldUserEdit?.field
                        }...`
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      !value.startsWith(" ") &&
                      !value.endsWith("  ") &&
                      /^.{0,18}$/.test(value)
                    ) {
                      setFieldUserEdit({
                        ...fieldUserEdit,
                        data: e.target.value,
                      });
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                    }
                  }}
                  rows={4}
                />
              </div>
            )}
          {fieldUserEdit.field === "gender" && (
            <Select
              value={fieldUserEdit.data}
              defaultValue={userInfo.gender}
              style={{ width: 120 }}
              onChange={handleChangeGender}
              options={[
                { value: "other", label: t("content:profileUser.other") },
                { value: "male", label: t("content:profileUser.male") },
                { value: "female", label: t("content:profileUser.female") },
              ]}
            />
          )}
        </div>
      </Modal>
      {/* modal với field image */}
      <Modal
        title={t("content:profileUser.avatar")}
        open={modalImage}
        okButtonProps={{ disabled: !imagePreview }}
        onOk={handleEditAvatar}
        onCancel={handleCancel}
        okText={t("base:ok")}
        cancelText={t("base:cancel")}
      >
        <div className="modal__avatar">
          <div className="avatar__img">
            <img
              src={imagePreview?.preview || userInfo?.avatar}
              alt="ảnh đại diện"
            />
          </div>
          <div>
            <div className="avatar__upload">
              <Button icon={<UploadOutlined />}>
                <label htmlFor="imageUpload" className="">
                  {t("content:profileUser.choose photo")}
                </label>
              </Button>
              <input
                style={{ display: "none" }}
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImagePreview}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDetails;
