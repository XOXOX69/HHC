import Card from "@/UI/Card";
import Table from "@/UI/Table";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { loadSinglePurchaseReorder } from "../../redux/rtk/features/purchaseOrder/purchaseOrderSlice";
import NewPurchaseOrderInvoice from "../Invoice/NewPurchaseOrderInvoice";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";

export default function SinglePurchase() {
  const { id } = useParams("id");
  const dispatch = useDispatch();
  const { singlePurchase, loading } = useSelector(
    (state) => state.purchaseOrder
  );
  const [columnsToShow, setColumnsToShow] = useState([]);
  useEffect(() => {
    setColumnsToShow(columns);
    dispatch(loadSinglePurchaseReorder(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const columns = [
    {
      id: 1,
      title: "ID",
      dataIndex: "productId",
      key: "id",
    },

    {
      id: 2,
      title: "Name",
      dataIndex: "product",
      key: "name",
      render: (item) => (
        <Link to={`/admin/product/${item?.id}`}>{item.name} </Link>
      ),
    },
    {
      id: 4,
      title: "Sku",
      dataIndex: "product",
      key: "sku",
      render: (item) => item.sku,
    },

    {
      id: 5,
      title: "Quantity",
      dataIndex: "reorderProductQuantity",
      key: "productQuantity",
    },
    {
      id: 3,
      title: "Date",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("ll"),
    },
  ];
  const columnsToShowHandler = (val) => {
    setColumnsToShow(val);
  };

  const addKeys = (arr) => arr?.map((i) => ({ ...i, key: i.id }));

  return (
    <>
      <Card
        title={
          <h5 className='flex flex-col'>
            <span className='mr-left'>Purchase Order: {id}</span>
            <span className='text-sm'>
              PO Date: {moment(singlePurchase?.createdAt).format("ll")}
            </span>
          </h5>
        }
        extra={
          <div className='flex gap-2'>
            {singlePurchase && (
              <NewPurchaseOrderInvoice
                data={singlePurchase}
                title={"Purchase Order Invoice"}
              />
            )}
          </div>
        }
      >
        <div className='text-[18px] font-medium flex justify-center'>
          Purchase Order Product Information
        </div>
        {singlePurchase && (
          <div>
            <div className='flex justify-between my-3'>
              <ColVisibilityDropdown
                options={columns}
                columns={columns}
                columnsToShowHandler={columnsToShowHandler}
              />
            </div>
          </div>
        )}
        <div className=''>
          <Table
            scroll={{ x: true }}
            loading={loading}
            columns={columnsToShow}
            data={singlePurchase ? addKeys(singlePurchase?.productList) : []}
          />
        </div>
      </Card>
    </>
  );
}
