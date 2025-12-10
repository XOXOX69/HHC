import { EditOutlined, PlusOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { loadAllAccount } from "../../redux/rtk/features/account/accountSlice";
import {
  loadAllPaymentMethodPaginated,
  updatePaymentMethod,
} from "../../redux/rtk/features/paymentMethod/paymentMethodSlice";

export default function UpdatePaymentMethod({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [Instruction, setInstruction] = useState("");
  const [methodType, setMethodType] = useState(data.methodType || "manual");

  const [logoFileList, setLogoFileList] = useState([]);
  const [qrCodeFileList, setQrCodeFileList] = useState([]);
  const { list, loading } = useSelector((state) => state.accounts);

  const isGcashType = methodType === 'gcash' || methodType === 'maya';

  const onFinish = async (values) => {
    try {
      let formData = new FormData();
      if (data.id !== 1) {
        formData.append("methodName", values.methodName);
        formData.append("methodType", methodType);
        formData.append("subAccountId", values.subAccountId);
        formData.append("ownerAccount", values.ownerAccount);
        formData.append("instruction", Instruction);
        formData.append("isOnlinePayment", isGcashType);
      }
      formData.append("_method", "PUT");
      
      if (logoFileList[0]?.originFileObj) {
        formData.append("images[]", logoFileList[0].originFileObj);
      }
      if (qrCodeFileList[0]?.originFileObj) {
        formData.append("images[]", qrCodeFileList[0].originFileObj);
      }

      const resp = await dispatch(
        updatePaymentMethod({ values: formData, id: data.id })
      );
      if (resp.payload.message === "success") {
        setLogoFileList([]);
        setQrCodeFileList([]);
        dispatch(
          loadAllPaymentMethodPaginated({ status: "true", page: 1, count: 10 })
        );
        setLoader(false);
        handleCancel();
      }
    } catch (err) {
      setLoader(false);
    }
  };
  const onFinishFailed = () => {};
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogoChange = ({ fileList }) => {
    setLogoFileList(fileList);
  };
  const handleQrCodeChange = ({ fileList }) => {
    setQrCodeFileList(fileList);
  };
  const handleMethodType = (val) => {
    setMethodType(val);
  };
  useEffect(() => {
    if (!list) {
      dispatch(loadAllAccount());
    }
  }, [dispatch, list]);
  const prodDescriptionHandler = (val) => {
    setInstruction(val);
  };
  const textEditorFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
  ];
  const textEditorModule = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };
  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          showModal();
        }}
      >
        <EditOutlined className="bg-gray-600 p-1 text-white rounded-md" />
        Edit
      </div>
      <Modal
        title="Update Payment Method"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            className="sm:mx-10"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{ ...data }}
          >
            {data.id !== 1 && (
              <>
                {" "}
                <Form.Item
                  style={{ marginBottom: "15px" }}
                  label="Method Name"
                  name="methodName"
                  rules={[
                    {
                      required: true,
                      message: "Please input method name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                
                <Form.Item
                  style={{ marginBottom: "15px" }}
                  label="Payment Type"
                  name="methodType"
                >
                  <Select
                    defaultValue={data.methodType || "manual"}
                    onChange={handleMethodType}
                    options={[
                      { value: 'manual', label: 'Manual Payment' },
                      { value: 'gcash', label: 'GCash' },
                      { value: 'maya', label: 'Maya/PayMaya' },
                      { value: 'bank', label: 'Bank Transfer' },
                      { value: 'cod', label: 'Cash on Delivery' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: "15px" }}
                  label="Owner Account"
                  name="ownerAccount"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input owner account!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>{" "}
                <Form.Item
                  style={{ marginBottom: "15px" }}
                  label="Sub Account"
                  name="subAccountId"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please input sub account!",
                    },
                  ]}
                >
                  <Select
                    name="subAccountId"
                    loading={loading}
                    showSearch
                    placeholder="Select Sub Account"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {list &&
                      list.map((account) => (
                        <Select.Option key={account.id} value={account.id}>
                          {account.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Upload Logo "
              valuePropName="Logo"
              required={true}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                name="image"
                fileList={logoFileList}
                maxCount={1}
                onChange={handleLogoChange}
                accept="image/png, image/jpg, image/jpeg"
              >
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              </Upload>
            </Form.Item>
            
            {isGcashType && (
              <Form.Item label="Upload QR Code" valuePropName="qrCode">
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  name="qrCode"
                  fileList={qrCodeFileList}
                  maxCount={1}
                  onChange={handleQrCodeChange}
                  accept="image/png, image/jpg, image/jpeg"
                >
                  <div>
                    <QrcodeOutlined style={{ fontSize: 24 }} />
                    <div style={{ marginTop: 8 }}>QR Code</div>
                  </div>
                </Upload>
                {data.qrCodeImage && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Current QR Code:</p>
                    <img
                      src={`${import.meta.env.VITE_APP_API}/files/${data.qrCodeImage}`}
                      alt="Current QR"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </Form.Item>
            )}

            {data.id !== 1 && (
              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Instruction"
                name="instruction"
                rules={[
                  {
                    required: true,
                    message: "Please input instruction !",
                  },
                ]}
              >
                <ReactQuill
                  value={Instruction}
                  onChange={prodDescriptionHandler}
                  modules={textEditorModule}
                  formats={textEditorFormats}
                />
              </Form.Item>
            )}
            <Form.Item
              style={{ marginBottom: "15px" }}
              className="flex justify-center mt-[24px]"
            >
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                loading={loader}
                onClick={() => {
                  setLoader(true);
                }}
              >
                Update payment Method
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}
