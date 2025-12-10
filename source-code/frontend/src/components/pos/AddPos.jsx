import { DatePicker, Form, Select } from "antd";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCustomer } from "../../redux/rtk/features/customer/customerSlice";
import Products from "./Products";

import dayjs from "dayjs";
import { loadAllVatTax } from "../../redux/rtk/features/vatTax/vatTaxSlice";
import BigDrawer from "../Drawer/BigDrawer";
import AddCust from "../customer/AddCustomer";

const AddPos = ({
  form,
  subTotal,
  setIsModalOpen,
  totalCalculator,
  setSelectedProduct,
  selectedProduct,
}) => {
  const { Option } = Select;

  const dispatch = useDispatch();
  const allCustomer = useSelector((state) => state.customers.list);

  const onFormSubmit = async () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(loadAllVatTax());
    dispatch(loadAllCustomer({ query: "all" }));
  }, [dispatch]);

  return (
    <Form
      form={form}
      className="m-lg-1"
      onFinish={onFormSubmit}
      name="dynamic_form_nest_item"
      layout="vertical"
      size="large"
      autoComplete="off"
      initialValues={{
        date: dayjs(),
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}>
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-3 lg:mb-5">
        <div className="w-full md:w-1/2">
          <Form.Item
            style={{ marginBottom: "-10px" }}
            label={
              <>
                Customer
                <BigDrawer className={""} title={"new Customer"}>
                  <AddCust drawer={true} />
                </BigDrawer>
              </>
            }
            className="w-full"
            name="customerId"
            rules={[
              {
                required: true,
                message: "Please Select a Customer!",
              },
            ]}>
            <Select
              className="w-full"
              loading={!allCustomer}
              showSearch
              placeholder="Select a customer "
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }>
              {allCustomer &&
                allCustomer.map((cust) => (
                  <Option key={cust.id} value={cust.id}>
                    {cust.username}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="w-full md:w-1/2">
          <Form.Item
            label="Date"
            name="date"
            className="w-full"
            style={{ marginBottom: "-10px" }}
            rules={[
              {
                required: true,
                message: "Please input Date!",
              },
            ]}
            required>
            <DatePicker />
          </Form.Item>
        </div>
      </div>

      <Products
        subTotal={subTotal}
        setSelectedProduct={setSelectedProduct}
        selectedProduct={selectedProduct}
        form={form}
        totalCalculator={totalCalculator}
      />
    </Form>
  );
};

export default AddPos;
