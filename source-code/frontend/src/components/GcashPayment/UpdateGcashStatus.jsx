import { Button, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import {
  confirmGcashPayment,
  loadAllGcashTransactions,
} from "../../redux/rtk/features/gcash/gcashSlice";

const { Option } = Select;
const { TextArea } = Input;

export default function UpdateGcashStatus({ data }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    form.setFieldsValue({
      status: data.status,
      adminNote: data.adminNote || "",
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await dispatch(
        confirmGcashPayment({
          id: data.id,
          values: {
            status: values.status,
            adminNote: values.adminNote,
          },
        })
      );

      if (response.payload?.data?.message?.includes('success') || response.payload?.message === 'success') {
        message.success("GCash transaction status updated successfully");
        dispatch(loadAllGcashTransactions({ page: 1, count: 10, status: "all" }));
        handleCancel();
      } else {
        message.error(response.payload?.message || "Failed to update status");
      }
    } catch (error) {
      message.error("Failed to update GCash transaction status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="small"
        icon={<EditOutlined />}
        onClick={showModal}
        className="bg-blue-500"
      >
        Update
      </Button>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span>Update GCash Transaction</span>
            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(data.status)}`}>
              {data.status}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Reference No:</span>
              <span className="ml-2 font-mono font-semibold text-blue-600">
                {data.referenceNumber}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Amount:</span>
              <span className="ml-2 font-semibold text-green-600">
                ₱{parseFloat(data.amount).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500">GCash Number:</span>
              <span className="ml-2 font-mono">{data.gcashNumber}</span>
            </div>
            {data.customerReference && (
              <div>
                <span className="text-gray-500">Customer Ref:</span>
                <span className="ml-2 font-mono">{data.customerReference}</span>
              </div>
            )}
            {data.customer && (
              <div className="col-span-2">
                <span className="text-gray-500">Customer:</span>
                <span className="ml-2">{data.customer.username}</span>
              </div>
            )}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: data.status,
            adminNote: data.adminNote || "",
          }}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Option value="pending">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Pending
                </span>
              </Option>
              <Option value="verified">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Verified
                </span>
              </Option>
              <Option value="confirmed">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Confirmed
                </span>
              </Option>
              <Option value="failed">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Failed
                </span>
              </Option>
              <Option value="cancelled">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Cancelled
                </span>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="adminNote"
            label="Admin Note (Optional)"
          >
            <TextArea
              rows={3}
              placeholder="Add a note about this transaction..."
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-500"
            >
              Update Status
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
