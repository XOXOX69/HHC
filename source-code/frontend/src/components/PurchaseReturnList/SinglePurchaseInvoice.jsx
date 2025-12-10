import Card from "@/UI/Card";
import Table from "@/UI/Table";
import { SolutionOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { loadSinglePurchaseReturnInvoice } from "../../redux/rtk/features/PurchaseReturnList/PurchaseReturnListSlice";
import NewPurchaseReturnInvoice from "../Invoice/NewPurchaseReturnInvoice";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";

export default function SinglePurchaseInvoice() {
  const dispatch = useDispatch();
  const { id } = useParams("id");
  const [columnsToShow, setColumnsToShow] = useState([]);
  const { returnPurchase, loading } = useSelector(
    (state) => state.purchaseReturn
  );
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
      key: "product",
      dataIndex: "product",
      render: (product) => (
        <Link to={`/admin/product/${product?.id}`}>{product?.name}</Link>
      ),
    },
    {
      id: 3,
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (createdAt) => moment(createdAt).format("ll"),
    },

    {
      id: 4,
      title: "Product Quantity",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },
    {
      id: 5,
      title: "Purcahse Price",
      dataIndex: "productUnitPurchasePrice",
      key: "productUnitPurchasePrice",
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
    dispatch(loadSinglePurchaseReturnInvoice(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnsToShowHandler = (val) => {
    setColumnsToShow(val);
  };

  const addKeys = (arr) => arr?.map((i) => ({ ...i, key: i.id }));

  return (
    <>
      <Card
        title={
          <h5 className='flex items-center'>
            <SolutionOutlined />
            <span className='mr-left'>ID : {id}</span>
          </h5>
        }
        extra={
          <div className='flex gap-2'>
            {returnPurchase && (
              <NewPurchaseReturnInvoice
                title={"Purchase return Invoice"}
                data={returnPurchase}
              />
            )}
          </div>
        }
      >
        <div className='text-[18px] font-medium flex justify-center'>
          Purchase Return Product Information
        </div>

        {returnPurchase && (
          <div>
            <div className='flex justify-between my-2'>
              <ColVisibilityDropdown
                options={columns}
                columns={columns}
                columnsToShowHandler={columnsToShowHandler}
              />

              <div className='flex justify-between'>
                <div className='bg-gray-100 px-2 py-1 rounded-sm m-1'>
                  Purchase Invoice Id: {returnPurchase?.purchaseInvoiceId}
                </div>
                <div className='bg-gray-100 px-2 py-1 rounded-sm m-1'>
                  Date: {moment(returnPurchase?.createdAt).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='mb-5 '>
          <Table
            scroll={{ x: true }}
            loading={!returnPurchase}
            columns={columnsToShow}
            data={
              returnPurchase
                ? addKeys(returnPurchase?.returnPurchaseInvoiceProduct)
                : []
            }
          />
        </div>
        <div className='font-bold text-[16px]'>
          Total Return Amount:{" "}
          {(returnPurchase?.totalAmount || 0) + (returnPurchase?.tax || 0)}
        </div>
        <h6 className=' m-0 max-w-[500px] py-2'>
          <span className='font-bold'>Return Note:</span>
          <span className='font-medium'> {returnPurchase?.note}</span>{" "}
        </h6>
      </Card>
    </>
  );
}
