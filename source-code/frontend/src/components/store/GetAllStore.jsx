import { Badge, Button, Card, Modal, Popover, Table, Form, Input, Switch, message, Alert } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllStorePaginated,
  addStore,
  updateStore,
  deleteStore,
} from "../../redux/rtk/features/store/storeSlice";
import { EditOutlined, DeleteOutlined, PlusOutlined, ShopOutlined, LockOutlined } from "@ant-design/icons";
import CreateDrawer from "../CommonUi/CreateDrawer";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";

export default function GetAllStore() {
  const dispatch = useDispatch();
  const { list, loading, total } = useSelector((state) => state.store);
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    count: 10,
    status: "true",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [form] = Form.useForm();

  // Check if current user is viewing from "All Branches" (main store)
  const isMainStore = localStorage.getItem("isMainStore") === "true";
  const canManageBranches = isMainStore;

  useEffect(() => {
    dispatch(loadAllStorePaginated(pageConfig));
  }, [dispatch, pageConfig]);

  const handleTableChange = (pagination) => {
    setPageConfig({
      ...pageConfig,
      page: pagination.current,
      count: pagination.pageSize,
    });
  };

  const showModal = (store = null) => {
    setEditingStore(store);
    if (store) {
      form.setFieldsValue({
        ...store,
        status: store.status === true || store.status === "true",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingStore(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStore) {
        await dispatch(updateStore({ id: editingStore.id, values })).unwrap();
        message.success("Branch updated successfully!");
      } else {
        await dispatch(addStore(values)).unwrap();
        message.success("Branch created successfully!");
      }
      handleCancel();
      dispatch(loadAllStorePaginated(pageConfig));
    } catch (error) {
      console.error("Error saving store:", error);
      // error could be a string (from rejectWithValue) or an object
      const errorMsg = typeof error === 'string' ? error : (error?.message || "Unknown error");
      message.error("Failed to save branch: " + errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await dispatch(deleteStore(id)).unwrap();
        message.success("Branch deleted successfully!");
        dispatch(loadAllStorePaginated(pageConfig));
      } catch (error) {
        console.error("Error deleting store:", error);
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Store Code",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <span className="flex items-center gap-2">
          <ShopOutlined className="text-primary" />
          {name}
          {record.isMainStore && (
            <Badge count="Main" style={{ backgroundColor: "#52c41a" }} />
          )}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status ? "success" : "error"}
          text={status ? "Active" : "Inactive"}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          {canManageBranches ? (
            <>
              <UserPrivateComponent permission="update-store">
                <Button
                  size="small"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => showModal(record)}
                />
              </UserPrivateComponent>
              {!record.isMainStore && (
                <UserPrivateComponent permission="delete-store">
                  <Popover
                    content={
                      <div>
                        <p>Are you sure to delete this store?</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            size="small"
                            danger
                            onClick={() => handleDelete(record.id)}
                          >
                            Yes
                          </Button>
                        </div>
                      </div>
                    }
                    title="Delete Store"
                    trigger="click"
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popover>
                </UserPrivateComponent>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-xs">
              <LockOutlined /> View only
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <ShopOutlined /> Store / Branch Management
        </span>
      }
      extra={
        canManageBranches ? (
          <UserPrivateComponent permission="create-store">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add Store
            </Button>
          </UserPrivateComponent>
        ) : null
      }
    >
      {!canManageBranches && (
        <Alert
          message="Branch Management Restricted"
          description="You are currently viewing from an individual branch. To add, edit, or delete branches, please switch to 'All Branches' from the branch selector."
          type="warning"
          showIcon
          icon={<LockOutlined />}
          className="mb-4"
        />
      )}
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
        pagination={{
          current: pageConfig.page,
          pageSize: pageConfig.count,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} stores`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingStore ? "Edit Store" : "Add New Store"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: true,
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Store Name"
              rules={[{ required: true, message: "Please enter store name" }]}
            >
              <Input placeholder="Store Name" />
            </Form.Item>
            <Form.Item
              name="code"
              label="Store Code (Optional)"
              tooltip="Leave empty to auto-generate"
            >
              <Input placeholder="e.g. STORE-001 (auto-generated if empty)" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="email" label="Email">
              <Input type="email" placeholder="store@example.com" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="Phone Number" />
            </Form.Item>
          </div>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Store Address" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="city" label="City">
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Input placeholder="State" />
            </Form.Item>
            <Form.Item name="zipCode" label="Zip Code">
              <Input placeholder="Zip Code" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="country" label="Country">
              <Input placeholder="Country" />
            </Form.Item>
            <Form.Item name="taxNumber" label="Tax Number">
              <Input placeholder="Tax Number / VAT ID" />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Active" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingStore ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Card>
  );
}
