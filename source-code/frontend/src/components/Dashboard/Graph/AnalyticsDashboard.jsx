import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import ReactApexChart from "react-apexcharts";
import { ShoppingCartOutlined, ShoppingOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);

  // Sample data - Replace with actual API data
  const [dashboardData, setDashboardData] = useState({
    totalSaleAmount: 91101211,
    totalSaleDue: 46714824,
    totalPurchaseAmount: 16018803,
    totalPurchaseDue: 7883185,
  });

  // Live chart data states
  const [totalSalesChartData, setTotalSalesChartData] = useState([30, 40, 35, 50, 49, 60, 70, 65, 75, 80, 85, 91]);
  const [saleDueChartData, setSaleDueChartData] = useState([47, 45, 54, 38, 56, 50, 48, 44, 52, 49, 46, 47]);
  const [purchaseChartData, setPurchaseChartData] = useState([15, 18, 16, 20, 17, 19, 16, 15, 17, 18, 16, 16]);
  const [purchaseDueChartData, setPurchaseDueChartData] = useState([8, 7, 9, 8, 7, 8, 9, 7, 8, 9, 8, 8]);

  // Live data update effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Total Sales Chart - simulate real-time data
      setTotalSalesChartData(prev => {
        const newData = [...prev.slice(1), prev[prev.length - 1] + (Math.random() * 10 - 5)];
        return newData;
      });

      // Update Sale Due Chart
      setSaleDueChartData(prev => {
        const newData = [...prev.slice(1), prev[prev.length - 1] + (Math.random() * 8 - 4)];
        return newData;
      });

      // Update Purchase Chart
      setPurchaseChartData(prev => {
        const newData = [...prev.slice(1), Math.max(10, prev[prev.length - 1] + (Math.random() * 6 - 3))];
        return newData;
      });

      // Update Purchase Due Chart
      setPurchaseDueChartData(prev => {
        const newData = [...prev.slice(1), Math.max(5, prev[prev.length - 1] + (Math.random() * 3 - 1.5))];
        return newData;
      });

      // Update dashboard amounts slightly
      setDashboardData(prev => ({
        totalSaleAmount: prev.totalSaleAmount + (Math.random() * 10000 - 5000),
        totalSaleDue: prev.totalSaleDue + (Math.random() * 8000 - 4000),
        totalPurchaseAmount: prev.totalPurchaseAmount + (Math.random() * 3000 - 1500),
        totalPurchaseDue: prev.totalPurchaseDue + (Math.random() * 2000 - 1000),
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Sales Donut Chart Configuration
  const salesDonutOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: ["Paid", "Due", "Return"],
    colors: ["#3B82F6", "#F59E0B", "#EF4444"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
  };

  const salesDonutSeries = [51251648, 46714824, 0];

  // Purchases Donut Chart Configuration
  const purchasesDonutOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: ["Paid", "Due", "Return"],
    colors: ["#10B981", "#F59E0B", "#EF4444"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
  };

  const purchasesDonutSeries = [8135618, 7883185, 0];

  // Sales vs Purchases Line Chart Configuration
  const lineChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#3B82F6", "#A855F7"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: [
        "Sep",
        "Dec",
        "Apr",
        "May",
        "Jul",
        "Jun",
        "Feb",
        "Oct",
        "Jan",
        "Aug",
        "Mar",
        "Nov",
      ],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (val) => `${(val / 1000000).toFixed(1)}M`,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
  };

  const lineChartSeries = [
    {
      name: "Sales",
      data: [
        12000000, 5000000, 8000000, 7500000, 6000000, 5500000, 11000000,
        9000000, 6500000, 8000000, 8500000, 7000000,
      ],
    },
    {
      name: "Purchases",
      data: [
        1500000, 1200000, 1800000, 1600000, 1400000, 1300000, 1700000, 1500000,
        1900000, 1400000, 1600000, 1500000,
      ],
    },
  ];

  // Transactions Bar Chart Configuration
  const barChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"],
    xaxis: {
      categories: [
        "Accounts Receivable",
        "Sales",
        "Tax",
        "Inventory",
        "Cost of Sales",
      ],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "11px",
        },
        rotate: -45,
        rotateAlways: true,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (val) => `${(val / 1000).toFixed(0)}k`,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
  };

  const barChartSeries = [
    {
      name: "Amount",
      data: [95000, 92000, 70000, 45000, 40000],
    },
  ];

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      // Fetch new data based on date range
      console.log("Date range changed:", dates);
    }
  };

  const formatCurrency = (value) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  // Mini trend line for stat cards
  const miniSparklineOptions = (color) => ({
    chart: {
      type: "line",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: [color],
    tooltip: {
      enabled: false,
    },
  });

  return (
    <div className="flex-1 p-4 min-h-0 overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Real-time overview of sales, finance, and operations
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Date Range
            </span>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              className="border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards with Graphs */}
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {/* Total Sale Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-white dark:from-blue-500/10 dark:via-transparent dark:to-gray-900" />
          <div className="relative flex flex-col p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Sale Amount
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(dashboardData.totalSaleAmount)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    <ArrowUpOutlined style={{ fontSize: '12px' }} />
                    12.5%
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              </div>
            </div>
            {/* Area Chart - Live */}
            <div className="h-24">
              <ReactApexChart
                options={{
                  chart: {
                    type: "area",
                    sparkline: { enabled: true },
                    toolbar: { show: false },
                    animations: {
                      enabled: true,
                      easing: "linear",
                      dynamicAnimation: {
                        enabled: true,
                        speed: 1000,
                      },
                    },
                  },
                  stroke: {
                    curve: "smooth",
                    width: 2,
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.4,
                      opacityTo: 0.1,
                    },
                  },
                  colors: ["#3B82F6"],
                  tooltip: {
                    enabled: true,
                    theme: "dark",
                    x: { show: false },
                    y: {
                      formatter: (val) => `$${(val / 1000).toFixed(1)}k`,
                    },
                  },
                }}
                series={[
                  {
                    name: "Sales",
                    data: totalSalesChartData,
                  },
                ]}
                type="area"
                height={96}
              />
            </div>
          </div>
        </div>

        {/* Total Sale Due */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-white dark:from-orange-500/10 dark:via-transparent dark:to-gray-900" />
          <div className="relative flex flex-col p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Sale Due
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(dashboardData.totalSaleDue)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    <ArrowUpOutlined style={{ fontSize: '12px' }} />
                    8.2%
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              </div>
            </div>
            {/* Line Chart - Live */}
            <div className="h-24">
              <ReactApexChart
                options={{
                  chart: {
                    type: "line",
                    sparkline: { enabled: true },
                    toolbar: { show: false },
                    animations: {
                      enabled: true,
                      easing: "linear",
                      dynamicAnimation: {
                        enabled: true,
                        speed: 1000,
                      },
                    },
                  },
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  colors: ["#F59E0B"],
                  tooltip: {
                    enabled: true,
                    theme: "dark",
                    x: { show: false },
                    y: {
                      formatter: (val) => `$${(val / 1000).toFixed(1)}k`,
                    },
                  },
                }}
                series={[
                  {
                    name: "Due",
                    data: saleDueChartData,
                  },
                ]}
                type="line"
                height={96}
              />
            </div>
          </div>
        </div>

        {/* Total Purchase Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-white dark:from-green-500/10 dark:via-transparent dark:to-gray-900" />
          <div className="relative flex flex-col p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Purchase Amount
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(dashboardData.totalPurchaseAmount)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                    <ArrowDownOutlined style={{ fontSize: '12px' }} />
                    3.1%
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                <ShoppingOutlined style={{ fontSize: '24px' }} />
              </div>
            </div>
            {/* Column Chart - Live */}
            <div className="h-24">
              <ReactApexChart
                options={{
                  chart: {
                    type: "bar",
                    sparkline: { enabled: true },
                    toolbar: { show: false },
                    animations: {
                      enabled: true,
                      easing: "easeinout",
                      dynamicAnimation: {
                        enabled: true,
                        speed: 1000,
                      },
                    },
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: "60%",
                      borderRadius: 2,
                    },
                  },
                  colors: ["#10B981"],
                  tooltip: {
                    enabled: true,
                    theme: "dark",
                    x: { show: false },
                    y: {
                      formatter: (val) => `$${(val / 1000).toFixed(1)}k`,
                    },
                  },
                }}
                series={[
                  {
                    name: "Purchases",
                    data: purchaseChartData,
                  },
                ]}
                type="bar"
                height={96}
              />
            </div>
          </div>
        </div>

        {/* Total Purchase Due */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-transparent to-white dark:from-red-500/10 dark:via-transparent dark:to-gray-900" />
          <div className="relative flex flex-col p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Purchase Due
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(dashboardData.totalPurchaseDue)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    <ArrowUpOutlined style={{ fontSize: '12px' }} />
                    5.4%
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <ShoppingOutlined style={{ fontSize: '24px' }} />
              </div>
            </div>
            {/* Area Chart with Gradient - Live */}
            <div className="h-24">
              <ReactApexChart
                options={{
                  chart: {
                    type: "area",
                    sparkline: { enabled: true },
                    toolbar: { show: false },
                    animations: {
                      enabled: true,
                      easing: "linear",
                      dynamicAnimation: {
                        enabled: true,
                        speed: 1000,
                      },
                    },
                  },
                  stroke: {
                    curve: "straight",
                    width: 2,
                  },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.5,
                      opacityTo: 0.1,
                    },
                  },
                  colors: ["#EF4444"],
                  tooltip: {
                    enabled: true,
                    theme: "dark",
                    x: { show: false },
                    y: {
                      formatter: (val) => `$${(val / 1000).toFixed(1)}k`,
                    },
                  },
                }}
                series={[
                  {
                    name: "Due",
                    data: purchaseDueChartData,
                  },
                ]}
                type="area"
                height={96}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Donut Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales (Paid / Due / Return)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Payment status breakdown
            </p>
          </div>
          <ReactApexChart
            options={salesDonutOptions}
            series={salesDonutSeries}
            type="donut"
            height={350}
          />
        </div>

        {/* Purchases Donut Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Purchases (Paid / Due / Return)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Payment status breakdown
            </p>
          </div>
          <ReactApexChart
            options={purchasesDonutOptions}
            series={purchasesDonutSeries}
            type="donut"
            height={350}
          />
        </div>
      </div>

      {/* Line Chart - Sales vs Purchases */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales vs Purchases (Monthly)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comparative monthly trends
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Trend
          </button>
        </div>
        <ReactApexChart
          options={lineChartOptions}
          series={lineChartSeries}
          type="line"
          height={350}
        />
      </div>

      {/* Bar Chart - Transactions by Account */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transactions by Account
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Account-wise transaction amounts
          </p>
        </div>
        <ReactApexChart
          options={barChartOptions}
          series={barChartSeries}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
