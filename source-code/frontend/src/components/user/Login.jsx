import { Button, Card, Form, Input } from "antd";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/rtk/features/user/userSlice";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loadPermissionById } from "../../redux/rtk/features/auth/authSlice";
import { getSetting } from "./../../redux/rtk/features/setting/settingSlice";
import LoginTable from "../Card/LoginTable";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data, loading } = useSelector((state) => state?.setting) || {};
  const [imageError, setImageError] = useState();
  const [loader, setLoader] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  const onFinish = async (values) => {
    setLoader(true);
    const resp = await dispatch(addUser(values));
    if (resp.payload.message === "success") {
      setLoader(false);
      dispatch(getSetting());
      dispatch(loadPermissionById(resp.payload?.data?.roleId));
    } else {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));
  useEffect(() => {
    if (isLogged) {
      navigate("/admin");
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue({
        username: defaultValue[0].username || "",
        password: defaultValue[0].password || "",
      });
    }
  }, [defaultValue, form]);

  return (
    <div className="login-page flex justify-center items-center h-screen">
      <Card
        bordered={false}
        className="login-card w-full max-w-[24rem] mt-[30px] mx-auto"
      >
        {data && !loading && (
          <div
            className={`w-[180px] h-[70px] mx-auto flex items-center justify-center`}
          >
            {data?.logo && !imageError ? (
              <img
                className="login-logo text-white text-center mt-2 mb-1"
                alt="logo"
                src={data.logo}
                style={{ width: "180PX", height: "70px" }}
                onError={() => setImageError(true)}
              />
            ) : (
              <h2 className="login-logo text-center flex items-center justify-center gap-2 text-[30px]">
                OS
                <strong style={{ color: "#55F	", fontWeight: "bold" }}>
                  Inventory
                </strong>
              </h2>
            )}
          </div>
        )}
        {loading && (
          <div>
            {" "}
            <div className={`w-[180px] h-[70px] mx-auto flex flex-col gap-1 `}>
              <h1 className="bg-slate-200 h-4 rounded  w-full  animate-pulse"></h1>
              <h1 className="bg-slate-200 h-4 rounded w-full  animate-pulse"></h1>
              <h1 className="bg-slate-200 h-4 rounded  w-full animate-pulse"></h1>
            </div>
          </div>
        )}

        <h1 className="login-heading font-Popins font-bold text-xl text-center mt-3 pb-4 text-red-600">
          Welcome Back
        </h1>
        <Form
          name="basic"
          onFinish={onFinish}
          form={form}
          initialValues={{
            username: defaultValue[0]?.username || "",
            password: defaultValue[0]?.password || "",
          }}
          // style={{ marginLeft: "20px", marginRight: "20px" }}
          className="login-form"
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            className="mb-4"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}>
            <Input
              prefix={<UserOutlined className="ml-1" />}
              placeholder="Enter username"
            />
          </Form.Item>

          <Form.Item
            className="mb-2"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}>
            <Input.Password
              prefix={<LockOutlined className="ml-1" />}
              placeholder="Enter password"
            />
          </Form.Item>
          <Form.Item className="">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full rounded-md font-Popins"
              loading={loader}>
              Login
            </Button>
          </Form.Item>
        </Form>
        {import.meta.env.VITE_DEMO_LOGIN === "true" ? (
          <div className="py-4">
            <LoginTable setDefaultValue={setDefaultValue} />
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default Login;
