import Button from "@/UI/Button";
import CSV from "@/UI/CSV";
import Card from "@/UI/Card";
import { loadSupplierReport } from "@/redux/rtk/features/supplier/supplierSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReportTable from "../CommonUi/ReportTable";
import SupplierReportPrint from "../Invoice/Report/SupplierReportPrint";

export default function SupplierReport() {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const { list, loading, info } = useSelector((state) => state.suppliers);

  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/admin/supplier/${id}`}>{id}</Link>,
    },
    {
      id: 2,
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => (
        <Link to={`/admin/supplier/${id}`}>{name}</Link>
      ),
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
  const column = [
    {
      id: 1,
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      renderCSV: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
    },
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      id: 2,
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => (
        <Link to={`/admin/supplier/${id}`}>{name}</Link>
      ),
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
    dispatch(loadSupplierReport());
  }, [dispatch]);

  return (
    <div className='card card-custom mt-3 '>
      <div className='card-body'>
        <Card
          className='max-md:border-0 max-md:bg-white'
          bodyClass='max-md:p-0 '
          headClass='border-none'
          title={"Supplier Report"}
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
            <div className='flex  items-center gap-2 '>
              {!loading && list ? (
                <SupplierReportPrint
                  data={list}
                  info={info}
                  title={"Supplier Report"}
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
                <SupplierReportPrint
                  data={list}
                  info={info}
                  title={"Supplier Report"}
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
                  title={"Supplier Report"}
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
