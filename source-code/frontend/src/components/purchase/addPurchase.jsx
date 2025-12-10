import { Button, DatePicker, Form, Input, Select } from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../redux/rtk/features/product/productSlice";
import { loadSuppliers } from "../../redux/rtk/features/supplier/supplierSlice";
import Products from "./Products";

import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { addPurchase } from "../../redux/rtk/features/purchase/purchaseSlice";
import BigDrawer from "../Drawer/BigDrawer";
import AddSup from "../suppliers/addSup";
import Payments from "./Payments";

const AddPurchase = () => {
  const { Option } = Select;
  const [loader, setLoader] = useState(false);
  const [subTotal, setSubTotal] = useState([]);
  const [due, setDue] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSuppliers({ status: true, page: 1, count: 10 }));
    dispatch(loadProduct({ query: "all" }));
  }, [dispatch]);

  const allSuppliers = useSelector((state) => state.suppliers.list);
  const { list: productList, loading: productLoading } = useSelector(
    (state) => state.products
  );

  // Form Function
  const [form] = Form.useForm();

  const onFormSubmit = async (values) => {
    try {
      const mergedObject = values.purchaseInvoiceProduct.reduce(
        (accumulator, currentObject) => {
          const productId = currentObject.productId;
          if (!accumulator[productId]) {
            accumulator[productId] = { ...currentObject };
          } else {
            accumulator[productId].productQuantity +=
              currentObject.productQuantity;
          }
          return accumulator;
        },
        {}
      );

      const mergedArray = Object.values(mergedObject);
      const newArray = mergedArray.map((product) => {
        return {
          ...product,
          productId: product.productId,
          productQuantity: product.productQuantity,
          productUnitPurchasePrice: product.productPurchasePrice,
          productUnitSalePrice: product.productSalePrice,
          tax: product.tax,
        };
      });

      const data = {
        ...values,
        purchaseInvoiceProduct: newArray,
        paidAmount: values.paidAmount || [],
      };
      const resp = await dispatch(addPurchase(data));
      if (resp.payload.message === "success") {
        form.resetFields();
        setLoader(false);
        navigate(`/admin/purchase/${resp.payload.data.id}`);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  // total calculate
  const totalCalculator = () => {
    const productArray = form.getFieldValue("purchaseInvoiceProduct");

    const subTotal =
      productArray?.reduce((subTotal, current) => {
        const quantity = current?.productQuantity || 0;
        const price = current?.productPurchasePrice || 0;
        const vat = current?.tax || 0;
        const subPrice = price * quantity;
        const totalVat = (vat / 100) * subPrice;
        return [...subTotal, { subPrice, totalVat }];
      }, []) || [];

    setSubTotal(subTotal);

    const total = subTotal?.reduce((acc, item) => acc + item.subPrice, 0);
    const totalTaxAmount = subTotal?.reduce(
      (acc, item) => acc + item.totalVat,
      0
    );
    const totalPayable = total + totalTaxAmount;
    const paidAmountArray = form.getFieldValue("paidAmount") || [];
    const paidAmount = paidAmountArray?.reduce((acc, item) => {
      return acc + (item.amount ? parseInt(item.amount) : 0);
    }, 0);
    const due = totalPayable - paidAmount;
    setDue(due);
  };

  const supplier = allSuppliers?.find((item) => item.id === selectedSupplier);
  const total = subTotal?.reduce((acc, item) => acc + item.subPrice, 0);
  const totalTaxAmount = subTotal?.reduce(
    (acc, item) => acc + item.totalVat,
    0
  );
  const totalPayable = total + totalTaxAmount;

  return (
    <Form
      form={form}
      className='w-full '
      name='dynamic_form_nest_item'
      onFinish={onFormSubmit}
      onFinishFailed={() => {
        setLoader(false);
      }}
      layout='vertical'
      size='large'
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      autoComplete='off'
      initialValues={{
        paidAmount: 0,
        discount: 0,
        date: dayjs(),
        purchaseInvoiceProduct: [{}],
      }}
    >
      <div className='flex gap-4 2xl:h-[calc(100vh-100px)] min-h-[500px]'>
        <div className='w-[70%] 2xl:w-[75%]'>
          <Products
            totalCalculator={totalCalculator}
            subTotal={subTotal}
            form={form}
            productList={productList}
            productLoading={productLoading}
          />
        </div>
        <div className='flex flex-col w-[30%] 2xl:w-[25%]'>
          <div className='flex-grow'>
            <div className='w-full'>
              <Form.Item
                label={
                  <>
                    Supplier{" "}
                    <BigDrawer className='' title='Add New Supplier'>
                      <AddSup drawer={true} />
                    </BigDrawer>
                  </>
                }
                name='supplierId'
                className='w-full mb-0'
                rules={[
                  {
                    required: true,
                    message: "Please Select a supplier!",
                  },
                ]}
              >
                <Select
                  className='w-full'
                  loading={!allSuppliers}
                  onChange={(id) => setSelectedSupplier(id)}
                  showSearch
                  placeholder='Select a supplier '
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {allSuppliers &&
                    allSuppliers.map((sup) => (
                      <Option key={sup.id} value={sup.id}>
                        {sup.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              {supplier && (
                <div className='flex justify-between py-1 px-4'>
                  <span>
                    <span>Address: </span>
                    <span>{supplier?.address}</span>{" "}
                  </span>
                  <span>
                    <span>Phone: </span>
                    <span>{supplier?.phone}</span>{" "}
                  </span>
                </div>
              )}
            </div>

            <Form.Item
              name='date'
              label='Date'
              className='w-full mb-0'
              layout='horizental'
              required
              rules={[
                {
                  required: true,
                  message: "Please input Date!",
                },
              ]}
            >
              <DatePicker
                size='small'
                format={"YYYY-MM-DD"}
                className='date-picker'
              />
            </Form.Item>

            <Form.Item
              className='w-full mb-0'
              name='supplierMemoNo'
              label='Supplier Memo'
            >
              <Input className='w-full' placeholder='Memo no ' />
            </Form.Item>

            <Form.Item className='w-full mb-0' name='note' label='Note'>
              <Input className='w-full' placeholder='Note' />
            </Form.Item>
          </div>
          <div className='py-2'>
            <div className=' flex justify-between'>
              <strong>Total amount: </strong>
              <strong>{total.toFixed(2)}</strong>
            </div>

            <div className='py-1 flex justify-between items-center'>
              <span>Total tax amount: </span>
              <span>{totalTaxAmount.toFixed(2)}</span>
            </div>
            <div className='py-1 flex justify-between items-center'>
              <strong>Total Payable: </strong>
              <strong>{totalPayable.toFixed(2)}</strong>
            </div>

            <div className='py-1 mb-4 flex justify-between'>
              <strong>Due Amount:</strong>
              <strong>{due.toFixed(2)}</strong>
            </div>
            <div className='flex justify-between mb-2'>
              <span className=''>Paid Amount: </span>
              <div className='w-[65%] flex items-center justify-between gap-2'>
                <Payments totalCalculator={totalCalculator} />
              </div>
            </div>
            <Form.Item style={{ marginTop: "15px" }}>
              <Button
                block
                type='primary'
                htmlType='submit'
                loading={loader}
                onClick={() => setLoader(true)}
              >
                Create Purchase
              </Button>
            </Form.Item>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default AddPurchase;
