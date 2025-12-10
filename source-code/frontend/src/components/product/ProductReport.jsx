import Button from "@/UI/Button";
import CSV from "@/UI/CSV";
import Card from "@/UI/Card";
import { loadProductReport } from "@/redux/rtk/features/product/productSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReportTable from "../CommonUi/ReportTable";
import ProductReportPrint from "../Invoice/Report/ProductReportPrint";

export default function ProductReport() {
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);
  const {
    report: list,
    info,
    loading,
  } = useSelector((state) => state.products);

  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "50px",
      render: (id) => <Link to={`/admin/product/${id}`}>{id}</Link>,
    },

    {
      id: 4,
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => <Link to={`/admin/product/${id}`}>{name}</Link>,
      width: "150px",
      tdClass: "whitespace-nowrap",
    },
    {
      id: 10,
      title: "Brand",
      dataIndex: "productBrand",
      key: "productBrand",
      render: (productBrand) => productBrand?.name,
    },
    {
      id: 9,
      title: "Sub Category",
      dataIndex: "productSubCategory",
      key: "productSubCategory",
      render: (productSubCategory) => productSubCategory?.name,
    },
    {
      id: 3,
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },

    {
      id: 7,
      title: "Purchase price",
      dataIndex: "productPurchasePrice",
      key: "productPurchasePrice",
      responsive: ["md"],
    },
    {
      id: 3,
      title: "Vat",
      dataIndex: "productVat",
      key: "productVat",
      render: (productVat) => (
        <span>{productVat ? `${productVat?.percentage}%` : "0%"}</span>
      ),
    },
    {
      id: 8,
      title: "Sale price",
      dataIndex: "productSalePrice",
      key: "productSalePrice",
      responsive: ["md"],
    },
    {
      id: 6,
      title: "Quantity",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },
    {
      id: 5,
      title: "UoM",
      key: "uomValue",
      render: ({ uom, uomValue }) =>
        `${uomValue || ""}${uom?.name ? `/${uom.name}` : ""}`,
    },

    {
      id: 12,
      title: "Reorder QTY",
      dataIndex: "reorderQuantity",
      key: "reorderQuantity",
    },
  ];

  // column for CSV
  const column = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
      renderCsv: (id) => id,
    },
    {
      id: 1,
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      renderCsv: (sku) => sku,
    },
    {
      id: 10,
      title: "Brand",
      dataIndex: "productBrand",
      key: "productBrand",
      renderCsv: (productBrand) => productBrand?.name,
    },
    {
      id: 9,
      title: "Sub Category",
      dataIndex: "productSubCategory",
      key: "productSubCategory",
      renderCsv: (productSubCategory) => productSubCategory?.name,
    },
    {
      id: 12,
      title: "Color",
      dataIndex: "productColor",
      key: "color",
      renderCsv: (productColor) =>
        productColor.length > 0
          ? productColor.map((color) => color.color.name)
          : "-",
    },
    {
      id: 5,
      title: "UoM",
      key: "uomValue",
      renderCsv: ({ uom, uomValue }) =>
        `${uomValue || ""}${uom?.name ? `/${uom.name}` : ""}`,
    },
    {
      id: 6,
      title: "Quantity",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },

    {
      id: 12,
      title: "Reorder QTY",
      dataIndex: "reorderQuantity",
      key: "reorderQuantity",
    },
    {
      id: 3,
      title: "Vat",
      dataIndex: "productVat",
      key: "productVat",
      renderCsv: (productVat) =>
        `${productVat?.percentage ? productVat?.percentage : 0}%`,
    },
    {
      id: 7,
      title: "Purchase price",
      dataIndex: "productPurchasePrice",
      key: "productPurchasePrice",
      responsive: ["md"],
    },
    {
      id: 8,
      title: "Sale price",
      dataIndex: "productSalePrice",
      key: "productSalePrice",
      responsive: ["md"],
    },
  ];
  useEffect(() => {
    dispatch(loadProductReport());
  }, [dispatch]);

  return (
    <div className='card card-custom mt-3 '>
      <div className='card-body'>
        <Card
          className='max-md:border-0 max-md:bg-white'
          bodyClass='max-md:p-0 '
          headClass='border-none'
          title={"Inventory Report"}
        >
          <div className='flex py-5  items-start justify-between '>
            <div>
              <Button
                onClick={() => setShowTable(true)}
                className=' bg-green-500 text-white inline-block'
              >
                Generate Report
              </Button>
            </div>
            <div className='flex  items-start gap-2'>
              {!loading && list ? (
                <ProductReportPrint
                  data={list}
                  info={info}
                  title={"INVENTORY REPORT"}
                  type={"print"}
                  btnName='Print'
                />
              ) : (
                <div>
                  <Button
                    loading={loading || !list}
                    className='bg-primary text-white w-[100px]'
                  >
                    Print
                  </Button>
                </div>
              )}
              {!loading && list ? (
                <ProductReportPrint
                  data={list}
                  info={info}
                  title={"INVENTORY REPORT"}
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
                  title={"Inventory Report"}
                  className={"bg-primary  text-base w-[120px] h-auto py-2 "}
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
