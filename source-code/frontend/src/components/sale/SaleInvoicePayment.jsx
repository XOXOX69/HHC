import { Button, DatePicker, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { addCustomerPayment } from "../../redux/rtk/features/customerPayment/customerPaymentSlice";
import { loadAllPurchase } from "@/redux/rtk/features/purchase/purchaseSlice";
import SalePayment from "./SalePayment";
import {
  loadAllSale,
  loadSingleSale,
} from "@/redux/rtk/features/sale/saleSlice";

const SaleInvoicePayment = ({ data, onClose, singlePage }) => {
  const { singleSaleInvoice,dueAmount} = data;
  const id = singleSaleInvoice?.id;
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  let [date, setDate] = useState(moment());
  const [loader, setLoader] = useState(false);
  const [newDue, setNewDue] = useState(0);
  const onFinish = async (values) => {
    setLoader(true);
    try {
      const data = {
        date: date,
        saleInvoiceNo: parseInt(values.saleInvoiceNo),
        ...values,
        paidAmount: values.paidAmount || [],
      };

      const resp = await dispatch(addCustomerPayment(data));

      if (resp.payload.message === "success") {
        setLoader(false);
        if (singlePage) {
          dispatch(loadSingleSale(id));
        } else {
          dispatch(
            loadAllSale({
              page: 1,
              count: 10,
              status: "true",
              startDate: moment().startOf("month").format("YYYY-MM-DD"),
              endDate: moment().endOf("month").format("YYYY-MM-DD"),
              user: "",
            })
          );
        }

        onClose();
      }
      setLoader(false);
      form.resetFields();
    } catch (error) {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
  };

  return (
    <>
      <Title level={4} className="text-center">
        Due Amount :{" "}
        <strong style={{ color: "red" }}>{dueAmount?.toFixed(3) || 0}</strong>
      </Title>
      {newDue ? (
        <p className="text-center text-lg font-semibold">
          Remaining Amount :{" "}
          <strong style={{ color: "red" }}>
            {(dueAmount - newDue).toFixed(2)}
          </strong>
        </p>
      ) : (
        ""
      )}
      <Form
        form={form}
        className="m-4 px-7"
        name="basic"
        layout="vertical"
        initialValues={{
          remember: true,
          saleInvoiceNo: id,
          discount: 0,
          paidAmount: [{}],
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="Date"
          rules={[
            {
              required: true,
              message: "Please input the date!",
            },
          ]}
          style={{ marginBottom: "10px" }}>
          <DatePicker
            onChange={(value) => setDate(value?._d)}
            defaultValue={dayjs()}
            label="date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please input Date",
              },
            ]}
          />
        </Form.Item>
        <div className="mt-5">
          <span>
            Paid Amount
            {dueAmount && (
              <button
                type="button"
                onClick={() => {
                  form.setFieldsValue({
                    paidAmount: [{ amount: dueAmount }],
                  });
                  setNewDue(0);
                }}
                className="ml-3 bg-blue-200 rounded px-1">
                Full Paid
              </button>
            )}
          </span>
          <SalePayment form={form} setNewDue={setNewDue} />
        </div>

        <Form.Item
          style={{ marginBottom: "10px", marginTop: "20px" }}
          label="Sale Invoice No"
          name="saleInvoiceNo"
          validateStatus="success">
          <Input disabled />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "10px" }}
          wrapperCol={{
            offset: 8,
            span: 16,
          }}>
          <Button
            className="mt-5"
            block
            type="primary"
            htmlType="submit"
            shape="round"
            loading={loader}>
            Pay Now
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SaleInvoicePayment;
