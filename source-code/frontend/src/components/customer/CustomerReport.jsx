import Button from "@/UI/Button";
import CSV from "@/UI/CSV";
import Card from "@/UI/Card";
import { loadCustomerReport } from "@/redux/rtk/features/customer/customerSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReportTable from "../CommonUi/ReportTable";
import CustomerReportPrint from "../Invoice/Report/CustomerReportPrint";

export default function CustomerReport() {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const { list, loading, info } = useSelector((state) => state.customers);

  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/admin/customer/${id}`}>{id}</Link>,
    },
    {
      id: 2,
      title: "username",
      dataIndex: "username",
      key: "name",
      render: (name, { id }) => (
        <Link to={`/admin/customer/${id}`}>{name}</Link>
      ),
    },
    {
      id: 3,
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      id: 3,
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      id: 4,
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
    },
  ];

  // columns for csv
  const column = [
    {
      id: 1,
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      renderCsv: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
    },
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      renderCsv: (id) => id,
    },
    {
      id: 2,
      title: "username",
      dataIndex: "username",
      key: "name",
      renderCsv: (name) => name,
    },
    {
      id: 3,
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      id: 3,
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      id: 4,
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
    },
    {
      id: 4,
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      responsive: ["md"],
    },
    {
      id: 4,
      title: "Paid",
      dataIndex: "totalPaidAmount",
      key: "totalPaidAmount",
      responsive: ["md"],
    },
    {
      id: 4,
      title: "Due",
      dataIndex: "dueAmount",
      key: "dueAmount",
      responsive: ["md"],
    },
    {
      id: 4,
      title: "Return",
      dataIndex: "totalReturnAmount",
      key: "totalReturnAmount",
      responsive: ["md"],
    },
  ];
  useEffect(() => {
    dispatch(loadCustomerReport());
  }, [dispatch]);

  return (
    <div className='card card-custom mt-3 '>
      <div className='card-body'>
        <Card
          className='max-md:border-0 max-md:bg-white'
          bodyClass='max-md:p-0 '
          headClass='border-none'
          title={"Customer Report"}
        >
          <div className='flex justify-between py-5 items-start '>
            <div>
              <Button
                onClick={() => setShowTable(true)}
                className='bg-green-500 text-white'
              >
                Generate Report
              </Button>
            </div>
            <div className='flex gap-2 items-center '>
              {!loading && list ? (
                <CustomerReportPrint
                  data={list}
                  info={info}
                  title={"Customer Report"}
                  type={"print"}
                  btnName='Print'
                />
              ) : (
                <div>
                  <Button
                    loading={loading || !list}
                    className='bg-primary text-white'
                  >
                    Print
                  </Button>
                </div>
              )}
              {!loading && list ? (
                <CustomerReportPrint
                  data={list}
                  info={info}
                  title={"Customer Report"}
                  type={"download"}
                  btnName='Export PDF'
                />
              ) : (
                <div>
                  <Button
                    loading={loading || !list}
                    className='bg-primary text-white'
                  >
                    Export PDF
                  </Button>
                </div>
              )}

              <div>
                <CSV
                  list={list}
                  columns={column}
                  title={"Customer Report"}
                  className={"bg-primary"}
                  btnName={"Export CSV"}
                />
              </div>
            </div>
          </div>

          {showTable && (
            <ReportTable list={list} columns={columns} loading={loading} />
          )}
        </Card>
      </div>
    </div>
  );
}
