import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { loadChartData } from "../../../redux/rtk/features/dashboard/dashboardSlice";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LiveCharts = ({ information }) => {
  const dispatch = useDispatch();
  const { chartData, chartLoading } = useSelector((state) => state.dashboard);

  // Local state for real-time updates
  const [realtimeData, setRealtimeData] = useState(Array(20).fill(0));

  // Fetch chart data from backend
  useEffect(() => {
    dispatch(loadChartData());

    // Refresh chart data every 10 seconds for live analytics
    const refreshInterval = setInterval(() => {
      dispatch(loadChartData());
    }, 10000);

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  // Update realtime data based on backend data
  useEffect(() => {
    if (chartData?.recentActivity) {
      setRealtimeData(chartData.recentActivity);
    }
  }, [chartData]);

  // Monthly labels from backend or default
  const monthlyLabels = chartData?.months || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const realtimeLabels = Array.from({ length: 20 }, (_, i) => `${i + 1}h`);

  // Sales vs Purchases Line Chart Data
  const salesPurchaseChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Sales",
        data: chartData?.salesData || Array(12).fill(0),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Purchases",
        data: chartData?.purchaseData || Array(12).fill(0),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const salesPurchaseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ₱${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => `₱${(value / 1000).toFixed(0)}k`,
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: "easeInOutQuart",
    },
  };

  // Real-time Activity Chart
  const realtimeChartData = {
    labels: realtimeLabels,
    datasets: [
      {
        label: "Live Activity",
        data: realtimeData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const realtimeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        callbacks: {
          label: (context) => `Transactions: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    animation: {
      duration: 500,
    },
  };

  // Revenue Distribution Doughnut Chart
  const revenueDistributionData = {
    labels: ["Paid", "Due"],
    datasets: [
      {
        data: [
          chartData?.revenueDistribution?.paid || 0,
          chartData?.revenueDistribution?.due || 0,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const revenueDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ₱${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  // Monthly Revenue Bar Chart
  const barLabels = chartData?.last6MonthsLabels || ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const barData = chartData?.last6MonthsRevenue || Array(6).fill(0);

  const monthlyBarChartData = {
    labels: barLabels,
    datasets: [
      {
        label: "Revenue",
        data: barData,
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(14, 165, 233, 0.7)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(168, 85, 247)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(14, 165, 233)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const monthlyBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        callbacks: {
          label: (context) => `Revenue: ₱${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => `₱${(value / 1000).toFixed(0)}k`,
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 800,
    },
  };

  // Loading skeleton
  const ChartSkeleton = () => (
    <div className="h-[280px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-slate-400 dark:text-slate-500">Loading chart...</span>
    </div>
  );

  return (
    <div className="mt-6 animate-fadeIn">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Analytics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time data from your business • Auto-refreshes every 10 seconds
        </p>
      </div>

      {/* Today's Stats */}
      {chartData?.todayStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Today's Sales</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              ₱{chartData.todayStats.salesTotalAmount?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400">{chartData.todayStats.salesCount || 0} transactions</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">Today's Purchases</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              ₱{chartData.todayStats.purchasesTotalAmount?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-purple-500 dark:text-purple-400">{chartData.todayStats.purchasesCount || 0} orders</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
            <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">Total Paid</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              ₱{chartData.revenueDistribution?.paid?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-green-500 dark:text-green-400">Collected revenue</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase">Total Due</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              ₱{chartData.revenueDistribution?.due?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-amber-500 dark:text-amber-400">Outstanding amount</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Purchases Line Chart */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-500/5 dark:via-transparent dark:to-purple-500/5" aria-hidden></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Sales vs Purchases
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last 12 months comparison
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            </div>
            <div className="h-[280px]">
              {chartLoading ? <ChartSkeleton /> : <Line data={salesPurchaseChartData} options={salesPurchaseChartOptions} />}
            </div>
          </div>
        </div>

        {/* Revenue Distribution Doughnut */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:from-purple-500/5 dark:via-transparent dark:to-pink-500/5" aria-hidden></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Payment Status
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Paid vs Due amounts
                </p>
              </div>
            </div>
            <div className="h-[280px] flex items-center justify-center">
              {chartLoading ? <ChartSkeleton /> : <Doughnut data={revenueDistributionData} options={revenueDistributionOptions} />}
            </div>
          </div>
        </div>

        {/* Real-time Activity Chart */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-teal-50/50 dark:from-green-500/5 dark:via-transparent dark:to-teal-500/5" aria-hidden></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Real-time Activity
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hourly transaction feed
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Streaming
              </span>
            </div>
            <div className="h-[200px]">
              <Line data={realtimeChartData} options={realtimeChartOptions} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Current:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {realtimeData[realtimeData.length - 1]} transactions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Avg:</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {Math.floor(realtimeData.reduce((a, b) => a + b, 0) / realtimeData.length)} t/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Bar Chart */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50 dark:from-amber-500/5 dark:via-transparent dark:to-orange-500/5" aria-hidden></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Monthly Revenue
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last 6 months (Paid)
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Updated
              </span>
            </div>
            <div className="h-[240px]">
              {chartLoading ? <ChartSkeleton /> : <Bar data={monthlyBarChartData} options={monthlyBarChartOptions} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCharts;
