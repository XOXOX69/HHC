import { EditOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearCustomer,
  deleteCustomer,
  loadSingleCustomer,
} from "../../redux/rtk/features/customer/customerSlice";

import Card from "@/UI/Card";
import List from "@/UI/List";
import Tabs, { Tab } from "@/UI/Tabs";
import useCurrency from "@/utils/useCurrency";
import CustomerInvoiceList from "../Card/CustomerInvoiceList";
import CommonDelete from "../CommonUi/CommonDelete";
import Loader from "../loader/loader";
import CustomerReturnInvoiceList from "./ListCard/CustomerReturnInvoiceList";
import CustomerTransactionList from "./ListCard/CustomerTransactionList";

const DetailCustomer = () => {
  const { id } = useParams();
  const currency = useCurrency();

  //dispatch
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customers.customer);
  useEffect(() => {
    dispatch(loadSingleCustomer(id));
    return () => {
      dispatch(clearCustomer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {customer ? (
        <div className='flex gap-2 md:gap-4'>
          <Card className='w-2/3' bodyClass={"p-0"}>
            <div className='flex justify-between mx-2 py-2 border-b items-center'>
              <div className='flex gap-3'>
                <Link
                  to={`/admin/customer/${customer?.id}/update`}
                  state={{ data: customer }}
                >
                  <EditOutlined className='bg-primary text-white p-3 rounded' />
                </Link>
                <CommonDelete
                  permission={"delete-customer"}
                  deleteThunk={deleteCustomer}
                  id={id}
                  navigatePath={"/admin/customer"}
                  className='p-3'
                />
              </div>
            </div>
            <Tabs className='mt-4'>
              <Tab
                label={
                  <span>
                    Invoice{" "}
                    <span className='ml-2 rounded-full bg-slate-300 text-slate-700 px-1'>
                      {customer?.totalSaleInvoice}
                    </span>
                  </span>
                }
              >
                <CustomerInvoiceList
                  list={customer?.saleInvoice}
                  linkTo='/admin/sale'
                />
              </Tab>
              <Tab
                label={
                  <span>
                    Return Invoice{" "}
                    <span className='ml-2 rounded-full bg-slate-300 text-slate-700 px-1'>
                      {customer?.totalReturnSaleInvoice}
                    </span>
                  </span>
                }
              >
                <CustomerReturnInvoiceList list={customer?.returnSaleInvoice} />
              </Tab>
              <Tab label='Transactions'>
                <CustomerTransactionList list={customer?.allTransaction} />
              </Tab>
            </Tabs>
          </Card>
          <div className='w-1/3 flex flex-col gap-2 md:gap-4'>
            <Card title={"Customer Details"}>
              <List
                labelClassName='w-[30%]'
                list={[
                  {
                    label: "Name",
                    value: customer?.username,
                  },
                  {
                    label: "Phone",
                    value: customer?.phone,
                  },
                  {
                    label: "Email",
                    value: customer?.email,
                  },
                  {
                    label: "Address",
                    value: customer?.address,
                  },
                ]}
              />
            </Card>
            <Card>
              <List
                labelClassName='w-[30%]'
                list={[
                  {
                    label: "Total Amount",
                    value: customer?.totalAmount
                      ? Number(customer.totalAmount).toFixed(2)
                      : 0,
                  },
                  {
                    label: "Return Amount",
                    value: (
                      <div className="before:content-['-'] relative before:absolute before:text-red-500 before:font-bold before:-left-3 before:top-0">
                        {customer?.totalReturnAmount}
                      </div>
                    ),
                  },
                  {
                    label: "Paid Amount",
                    value: (
                      <div className="before:content-['-'] relative before:absolute before:text-red-500 before:font-bold before:-left-3 before:top-0">
                        {customer?.totalPaidAmount}
                      </div>
                    ),
                    className: "border-b pb-1",
                  },
                  {
                    label: "Due Amount",
                    value: customer?.dueAmount,
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DetailCustomer;
