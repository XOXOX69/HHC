import Card from "@/UI/Card";
import Table from "@/UI/Table";
import { SolutionOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { loadSingleSaleReturn } from "../../redux/rtk/features/SaleReturnList/SaleReturnListSlice";
import NewSaleReturnInvoice from "../Invoice/NewSaleReturnInvoice";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";

export default function SingleSaleInvoice() {
  const dispatch = useDispatch();
  const { id } = useParams("id");
  const [columnsToShow, setColumnsToShow] = useState([]);

  const { returnSale, loading } = useSelector((state) => state.saleReturn);
  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      id: 2,
      title: "Product Name",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <Link to={`/admin/product/${product?.id}`}>{product?.name}</Link>
      ),
    },
    {
      id: 3,
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => moment(date).format("ll"),
    },

    {
      id: 4,
      title: "Product Quantity",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },
    {
      id: 5,
      title: "Sale Price",
      dataIndex: "productFinalAmount",
      key: "productUnitSalePrice",
    },
    {
      id: 5,
      title: "Total Tax",
      dataIndex: "taxAmount",
      key: "taxAmount",
    },
  ];
  useEffect(() => {
    setColumnsToShow(columns);
    dispatch(loadSingleSaleReturn(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnsToShowHandler = (val) => {
    setColumnsToShow(val);
  };

  const addKeys = (arr) => arr?.map((i) => ({ ...i, key: i.id }));

  return (
    <>
      <Card
        className='header-solid h-full'
        bordered={false}
        title={
          <h5 className='flex items-center'>
            <SolutionOutlined />
            <span className='mr-left'>ID : {id}</span>
          </h5>
        }
        bodyStyle={{ paddingTop: "0" }}
        extra={
          <div className='flex gap-2'>
            {returnSale && (
              <NewSaleReturnInvoice
                title={"Sale Return Invoice"}
                data={returnSale}
              />
            )}
          </div>
        }
      >
        <div className='text-[18px] font-medium flex justify-center'>
          Sale Return Product Information
        </div>
        {returnSale && (
          <div>
            <div className='flex justify-between my-3'>
              <ColVisibilityDropdown
                options={columns}
                columns={columns}
                columnsToShowHandler={columnsToShowHandler}
              />

              <div className='flex justify-between'>
                <div className='bg-gray-100 px-2 py-1 rounded-sm m-1'>
                  Sale Invoice Id: {returnSale?.saleInvoiceId}
                </div>
                <div className='bg-gray-100 px-2 py-1 rounded-sm m-1'>
                  Date: {moment(returnSale?.createdAt).format("ll")}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='mb-5'>
          <Table
            scroll={{ x: true }}
            loading={!returnSale}
            columns={columnsToShow}
            data={
              returnSale ? addKeys(returnSale?.returnSaleInvoiceProduct) : []
            }
          />
        </div>

        <div className='font-bold text-[16px]'>
          Total Return Amount:{" "}
          {returnSale?.totalAmount + (returnSale?.tax || 0)}
        </div>
        <h6 className=' m-0 max-w-[500px] py-2'>
          <span className='font-bold'>Return Note:</span>
          <span className='font-medium'> {returnSale?.note}</span>{" "}
        </h6>
      </Card>
    </>
  );
}
