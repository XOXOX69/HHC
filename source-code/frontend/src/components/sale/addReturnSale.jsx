import Button from "@/UI/Button";
import { Card, DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadSingleSale } from "../../redux/rtk/features/sale/saleSlice";
import SaleProductListCard from "../Card/saleInvoice/SaleProductListCard";
import Loader from "../loader/loader";
import Payments from "./Payments";
import { addReturnSale } from "./returnSale.api";

const AddReturnSale = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);

  const [loading, setLoading] = useState(false);

  //dispatch
  const dispatch = useDispatch();
  const sale = useSelector((state) => state.sales.sale);
  const { singleSaleInvoice, returnSaleInvoice } = sale ? sale : {};
  const [list, setList] = useState([]);
  const [date, setDate] = useState(moment());

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(loadSingleSale(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleSaleInvoice) {
      const list = singleSaleInvoice.saleInvoiceProduct.map((item) => {
        // const returnItem = returnSaleInvoice?.map((rItem) =>
        // 	rItem.returnSaleInvoiceProduct.find(
        // 		(pItem) => pItem.productId === item.productId
        // 	)
        // )[0];

        const returnItem = returnSaleInvoice
          ?.map((rItem) =>
            rItem.returnSaleInvoiceProduct.find(
              (pItem) => pItem.productId === item.productId
            )
          )
          .reduce(
            (acc, item) => {
              if (item) {
                return {
                  productQuantity: acc.productQuantity + item.productQuantity,
                };
              } else {
                return acc;
              }
            },
            { productQuantity: 0 }
          );

        const itemCopy = { ...item };

        if (returnItem) {
          itemCopy.returnQuantity = 0;
          itemCopy.productQuantity =
            item.productQuantity - returnItem.productQuantity;
        } else {
          itemCopy.returnQuantity = 0;
          itemCopy.remainQuantity = item.productQuantity;
        }
        return itemCopy;
      });
      setList(list);
    }
  }, [singleSaleInvoice]);

  const submitHandler = async ({ note, paidAmount }) => {
    try {
      setLoading(true);
      const payload = {
        saleInvoiceId: id,
        note,
        instantReturnAmount: paidAmount || [],
        date: moment(date._d).format(),

        returnSaleInvoiceProduct: Object.entries(formData).map(
          ([id, { value }]) => {
            return {
              saleInvoiceProductId: parseInt(id),
              productQuantity: value,
            };
          }
        ),
      };

      const resp = await addReturnSale(payload);

      if (resp?.message === "success") {
        navigate(-1);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }

    setLoading(false);
  };

  const updateHandler = useCallback(
    ({ id, value }) => {
      const item = list.find((item) => item.id === id);
      if (item) {
        formData[id] = { value };
        item.returnQuantity = value;
        item.remainQuantity = item.productQuantity - value;
        setList([...list]);
        setFormData({ ...formData });
      }
    },

    [formData, list]
  );

  const totalReturnQuantity = () => {
    return list.reduce((acc, item) => {
      return acc + item.returnQuantity * item.productUnitSalePrice;
    }, 0);
  };

  // set total return amount to state from totalReturnQuantity
  useEffect(() => {
    setTotalReturnAmount(totalReturnQuantity());
  }, [list]);

  return (
    <div>
      <div className="mr-top">
        {singleSaleInvoice ? (
          <Fragment key={singleSaleInvoice.id}>
            <Card bordered={false} className="criclebox h-full m-3">
              <div className=" flex justify-between ">
                <h5 className="text-xl">
                  <span className="mr-left">
                    Invoice : {singleSaleInvoice.id}
                  </span>
                </h5>
              </div>
              <div className="">
                <SaleProductListCard
                  formData={formData}
                  updateReturn={true}
                  returnOnChange={updateHandler}
                  list={list}
                />
                <div className="flex justify-between card-body my-4">
                  <div className="mb-auto">
                    <p
                      className="mr-left hidden"
                      style={{
                        backgroundColor: "#FDCCCC",
                        padding: "10px",
                        paddingRight: "20px",
                        borderRadius: "2px",
                      }}>
                      Total Return Amount :
                      <strong>
                        {"  "}
                        {totalReturnAmount ? totalReturnAmount : 0}
                      </strong>
                    </p>
                  </div>
                  <div className="max-w-[400px] min-w-[400px]">
                    <Form
                      labelAlign="right"
                      initialValues={{
                        date: dayjs(),
                      }}
                      form={form}
                      onFinish={submitHandler}
                      autoComplete="off">
                      <div className="flex justify-between mb-2">
                        <span className="">Date: </span>
                        <div className="w-[65%]">
                          <Form.Item name="date" className="mb-0">
                            <DatePicker
                              onChange={(date) => setDate(date._d)}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="">Note: </span>
                        <div className="w-[65%]">
                          <Form.Item name="note" className="mb-0">
                            <Input.TextArea placeholder="Note" />
                          </Form.Item>
                        </div>
                      </div>

                      <div className="flex justify-between  mb-2 mt-3">
                        <span className="">Total Return Amount: </span>
                        <div className=" font-semibold gap-2">
                          {totalReturnAmount}
                        </div>
                      </div>

                      <div className="flex justify-between mb-2">
                        <span className="">Paid Amount: </span>
                        <div className="w-[65%] flex items-center justify-between gap-2">
                          <Payments />
                        </div>
                      </div>

                      <Form.Item style={{ marginTop: "20px" }} className="mb-2">
                        <Button
                          type="submit"
                          className="bg-red-500 text-white hover:bg-red-600"
                          block
                          loading={loading}>
                          Make Return
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default AddReturnSale;
