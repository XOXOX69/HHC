import Button from "@/UI/Button";
import CSV from "@/UI/CSV";
import Card from "@/UI/Card";
import { loadAllPurchaseReport } from "@/redux/rtk/features/purchase/purchaseSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReportTable from "../CommonUi/ReportTable";
import PurchaseReportPrint from "../Invoice/Report/PurchaseReportPrint";
import PurchaseReportFilter from "./PurchaseReportFilter";

export default function PurchaseReport() {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const [supplier, setSupplier] = useState(null);

  const { list, loading, information } = useSelector(
    (state) => state.purchases
  );
  const [pageConfig, setPageConfig] = useState({
    query: "report",
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const columns = [
    {
      id: 1,
      title: "ID",
      key: "id",
      render: ({ id }) => <Link to={`/admin/purchase/${id}`}>{id}</Link>,
    },
    {
      id: 2,
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("ll"),
    },
    {
      id: 3,
      title: "Supplier Name ",
      dataIndex: `supplier`,
      key: "supplierId",
      render: (supplier) => (
        <Link to={`/admin/supplier/${supplier?.id}`}>{supplier?.name}</Link>
      ),
    },
    {
      id: 4,
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      id: 5,
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },

    {
      id: 7,
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      id: 6,
      title: "Due Amount",
      dataIndex: "dueAmount",
      key: "dueAmount",
    },
  ];

  const column = [
    {
      id: 2,
      title: "Date",
      dataIndex: "date",
      key: "date",
      renderCsv: (date) => moment(date).format("ll"),
    },
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      renderCsv: (id) => id,
    },

    {
      id: 3,
      title: "Supplier Name ",
      dataIndex: `supplier`,
      key: "supplierId",
      renderCsv: (supplier) => supplier?.name,
    },
    {
      id: 3,
      title: "Product",
      dataIndex: `purchaseInvoiceProduct`,
      key: "purchaseInvoiceProduct",
      renderCsv: (purchaseInvoiceProduct) =>
        purchaseInvoiceProduct.map((p) => p.product.name),
    },
    {
      id: 4,
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      id: 5,
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },

    {
      id: 7,
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      id: 6,
      title: "Due Amount",
      dataIndex: "dueAmount",
      key: "dueAmount",
    },
  ];
  useEffect(() => {
    dispatch(loadAllPurchaseReport(pageConfig));
  }, [dispatch, pageConfig]);
  return (
    <div className='card card-custom mt-3 '>
      <div className='card-body'>
        <Card
          className='max-md:border-0 max-md:bg-white'
          bodyClass='max-md:p-0 '
          headClass='border-none'
          title={"Purchase Report"}
        >
          <PurchaseReportFilter
            setSupplier={setSupplier}
            setPageConfig={setPageConfig}
            pageConfig={pageConfig}
          />
          <div className='flex justify-between p-5 items-start '>
            <div>
              <Button
                onClick={() => setShowTable(true)}
                className='bg-green-500 text-white'
              >
                Generate Report
              </Button>
            </div>
            <div className='flex px-5 gap-2 items-center '>
              {!loading && list ? (
                <PurchaseReportPrint
                  data={list}
                  title={"Purchase Report"}
                  pageConfig={pageConfig}
                  type={"print"}
                  btnName='Print'
                  info={information}
                  supplier={supplier}
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
                <PurchaseReportPrint
                  data={list}
                  title={"Purchase Report"}
                  pageConfig={pageConfig}
                  info={information}
                  type={"download"}
                  btnName='Export PDF'
                  setSupplier={setSupplier}
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
                  title={"Purchase Report"}
                  className={"bg-primary   h-auto py-2 "}
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
