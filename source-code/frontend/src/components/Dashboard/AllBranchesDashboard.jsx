import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Statistic, Table, Spin, Tag, Progress } from "antd";
import {
  ShopOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SwapOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  loadAllBranchesDashboard,
  loadBranchComparison,
} from "../../redux/rtk/features/allBranches/allBranchesSlice";

const AllBranchesDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, branchComparison, loading } = useSelector(
    (state) => state.allBranches
  );

  useEffect(() => {
    dispatch(loadAllBranchesDashboard());
    dispatch(loadBranchComparison());
  }, [dispatch]);

  const branchColumns = [
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <ShopOutlined className="text-primary" />
          <span className="font-medium">{text}</span>
          {record.branchId === "main" && (
            <Tag color="green">Main</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      render: (value) => (
        <span className="text-green-600 font-medium">
          ${Number(value || 0).toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: "Purchases",
      dataIndex: "purchases",
      key: "purchases",
      render: (value) => (
        <span className="text-blue-600 font-medium">
          ${Number(value || 0).toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.purchases - b.purchases,
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      sorter: (a, b) => a.products - b.products,
    },
    {
      title: "Customers",
      dataIndex: "customers",
      key: "customers",
      sorter: (a, b) => a.customers - b.customers,
    },
    {
      title: "Transactions",
      dataIndex: "transactions",
      key: "transactions",
      sorter: (a, b) => a.transactions - b.transactions,
    },
    {
      title: "Sales Share",
      key: "share",
      render: (_, record) => {
        const totalSales = dashboardStats?.totalSales || 1;
        const percentage = ((record.sales / totalSales) * 100).toFixed(1);
        return (
          <Progress
            percent={parseFloat(percentage)}
            size="small"
            strokeColor="#52c41a"
          />
        );
      },
    },
  ];

  if (loading && !dashboardStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading all branches data..." />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShopOutlined className="text-purple-600" />
          All Branches Overview
        </h1>
        <p className="text-gray-500">
          Aggregated data from {dashboardStats?.branchCount || 0} branches
        </p>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md border-l-4 border-l-green-500">
            <Statistic
              title="Total Sales"
              value={dashboardStats?.totalSales || 0}
              precision={2}
              prefix={<DollarOutlined className="text-green-500" />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md border-l-4 border-l-blue-500">
            <Statistic
              title="Total Purchases"
              value={dashboardStats?.totalPurchases || 0}
              precision={2}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md border-l-4 border-l-orange-500">
            <Statistic
              title="Total Products"
              value={dashboardStats?.totalProducts || 0}
              prefix={<RiseOutlined className="text-orange-500" />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md border-l-4 border-l-purple-500">
            <Statistic
              title="Total Customers"
              value={dashboardStats?.totalCustomers || 0}
              prefix={<TeamOutlined className="text-purple-500" />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Branch Count Card */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-1">Active Branches</p>
                <h2 className="text-3xl font-bold text-white">
                  {dashboardStats?.branchCount || 0}
                </h2>
              </div>
              <ShopOutlined className="text-5xl text-white/50" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-1">Total Transactions</p>
                <h2 className="text-3xl font-bold text-white">
                  {dashboardStats?.totalTransactions || 0}
                </h2>
              </div>
              <SwapOutlined className="text-5xl text-white/50" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-1">Avg Sales/Branch</p>
                <h2 className="text-3xl font-bold text-white">
                  ${((dashboardStats?.totalSales || 0) / (dashboardStats?.branchCount || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h2>
              </div>
              <DollarOutlined className="text-5xl text-white/50" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Branch Comparison Table */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <ShopOutlined /> Branch Performance Comparison
          </span>
        }
        className="shadow-md"
      >
        <Table
          columns={branchColumns}
          dataSource={dashboardStats?.branchStats || []}
          rowKey="branchId"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default AllBranchesDashboard;
