import { DatePicker, Tag, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../UI/Card";
import { loadAllGcashTransactions } from "../../redux/rtk/features/gcash/gcashSlice";
import TableComponent from "../CommonUi/TableComponent";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import UpdateGcashStatus from "./UpdateGcashStatus";
import useCurrency from "../../utils/useCurrency";

const { Option } = Select;

export default function GetAllGcashTransactions() {
  const dispatch = useDispatch();
  const currency = useCurrency();

  const { list, total, loading } = useSelector((state) => state.gcash);
  const [pageConfig, setPageConfig] = useState({
    page: 1,
    count: 10,
    status: "all",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "verified":
        return "blue";
      case "confirmed":
        return "green";
      case "failed":
        return "red";
      case "cancelled":
        return "gray";
      default:
        return "default";
    }
  };

  const columns = [
    {
      id: 1,
      title: "Reference No",
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      render: (referenceNumber) => (
        <span className="font-mono font-semibold text-blue-600">
          {referenceNumber}
        </span>
      ),
      renderCsv: (referenceNumber) => referenceNumber,
    },
    {
      id: 2,
      title: "Order ID",
      dataIndex: "cartOrderId",
      key: "cartOrderId",
      render: (cartOrderId) =>
        cartOrderId ? (
          <Link to={`/admin/order/${cartOrderId}`} className="text-blue-500 hover:underline">
            #{cartOrderId}
          </Link>
        ) : (
          "-"
        ),
      renderCsv: (cartOrderId) => cartOrderId || "-",
    },
    {
      id: 3,
      title: "Sender",
      dataIndex: "senderName",
      key: "senderName",
      render: (senderName, record) => (
        <div>
          <div>{senderName || "-"}</div>
          <div className="text-xs text-gray-500">{record.senderMobile}</div>
        </div>
      ),
      renderCsv: (senderName) => senderName || "-",
    },
    {
      id: 4,
      title: "GCash Number",
      dataIndex: "senderMobile",
      key: "senderMobile",
      render: (senderMobile) => (
        <span className="font-mono">{senderMobile}</span>
      ),
      renderCsv: (senderMobile) => senderMobile,
    },
    {
      id: 5,
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="font-semibold text-green-600">
          <span dangerouslySetInnerHTML={{ __html: currency?.currencySymbol }} />{" "}
          {parseFloat(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      renderCsv: (amount) => amount,
    },
    {
      id: 6,
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
      renderCsv: (status) => status,
    },
    {
      id: 7,
      title: "GCash Ref",
      dataIndex: "gcashReferenceNumber",
      key: "gcashReferenceNumber",
      render: (gcashReferenceNumber) =>
        gcashReferenceNumber ? (
          <span className="font-mono text-sm">{gcashReferenceNumber}</span>
        ) : (
          "-"
        ),
      renderCsv: (gcashReferenceNumber) => gcashReferenceNumber || "-",
    },
    {
      id: 8,
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm"),
      renderCsv: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      id: 9,
      title: "Action",
      key: "Action",
      render: (item) => (
        <div className="flex items-center gap-3">
          <UserPrivateComponent permission={"update-gcashTransaction"}>
            <UpdateGcashStatus data={item} />
          </UserPrivateComponent>
        </div>
      ),
      csvOff: true,
    },
  ];

  useEffect(() => {
    dispatch(loadAllGcashTransactions(pageConfig));
  }, [dispatch, pageConfig]);

  const onDateChange = (date) => {
    if (date) {
      const fromDate = date.format("YYYY-MM-DD");
      setPageConfig((prev) => ({
        ...prev,
        startDate: fromDate,
      }));
    } else {
      setPageConfig((prev) => {
        const { startDate, ...rest } = prev;
        return rest;
      });
    }
  };

  const onStatusChange = (value) => {
    setPageConfig((prev) => ({
      ...prev,
      status: value,
    }));
  };

  return (
    <>
      <Card
        className="max-md:border-0 max-md:bg-white"
        bodyClass="max-md:p-0"
        headClass="border-none"
        title={
          <div className="flex items-center gap-2">
            <img
              src="/images/gcash-logo.png"
              alt="GCash"
              className="h-8 w-8"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span>GCash Transactions</span>
          </div>
        }
        extra={
          <div className="flex gap-2 justify-end flex-wrap">
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={onStatusChange}
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="verified">Verified</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="failed">Failed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
            <DatePicker
              onChange={onDateChange}
              allowClear
              className="w-[150px]"
              defaultValue={dayjs(
                moment().endOf("month").format("YYYY-MM-DD"),
                "YYYY-MM-DD"
              )}
            />
          </div>
        }
      >
        <UserPrivateComponent permission={"readAll-gcashTransaction"}>
          <TableComponent
            columns={columns}
            list={list}
            total={total}
            loading={loading}
            setPageConfig={setPageConfig}
            title="GCash Transactions"
            csvFileName="gcash-transactions"
          />
        </UserPrivateComponent>
      </Card>
    </>
  );
}
