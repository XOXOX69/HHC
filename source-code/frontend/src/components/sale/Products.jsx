import Button from "@/UI/Button";
import useCurrency from "@/utils/useCurrency";
import { PlusOutlined } from "@ant-design/icons";
import { Form, InputNumber, Select } from "antd";
import toast from "react-hot-toast";
import { CiCircleRemove } from "react-icons/ci";
import Card from "../../UI/Card";
import SearchForm from "../../UI/Search";

export default function ProductAdd({
  form,
  productList,
  productLoading,
  totalCalculator,
  subTotal,
}) {
  const currency = useCurrency();
  const handleSetInitial = (product, serial) => {
    const productArray = form.getFieldValue("saleInvoiceProduct");
    const findProduct = productList.find((pro) => pro.id === product);
    if (findProduct.productQuantity === 0) {
      toast.error("Product is out of stock");
    }
    const newArray = productArray.map((product, index) => {
      if (index === serial) {
        const data = {
          ...product,
          productQuantity: findProduct.productQuantity ? 1 : 0,
          productSalePrice: findProduct.productSalePrice,
          productVat: findProduct.productVat
            ? findProduct.productVat.percentage
            : 0,
          productDiscount: findProduct.discount?.value
            ? parseInt(findProduct.discount?.value)
            : 0,
          discountType: findProduct.discount?.type || "flat",
        };

        return data;
      } else {
        return product;
      }
    });

    form.setFieldsValue({
      saleInvoiceProduct: newArray,
    });
    totalCalculator();
  };

  const render = (index) => {
    const findId = form
      .getFieldValue("saleInvoiceProduct")
      ?.find((_, i) => i === index)?.productId;
    const findProduct = productList?.find((item) => findId === item.id);

    let colors = null;

    if (
      Array.isArray(findProduct?.productColor) &&
      findProduct.productColor.length > 0
    ) {
      colors = (
        <div className='flex flex-wrap gap-1'>
          <span className='mr-1'>Color: </span>
          {findProduct.productColor.map((item, index) => (
            <span key={item.id}>
              {item.color?.name}
              {index !== findProduct.productColor.length - 1 && ","}
            </span>
          ))}
        </div>
      );
    }

    let stock = null;
    if (findProduct?.productQuantity) {
      stock = (
        <span>
          <span className='mr-1'>Stock: </span>
          <span>{findProduct.productQuantity}</span>
        </span>
      );
    }

    let uom = null;
    if (findProduct?.uom?.name) {
      uom = (
        <span>
          <span className='mr-1'>UoM: </span>
          <span>{`${findProduct?.uomValue}/${findProduct?.uom?.name}`}</span>
        </span>
      );
    }

    return { stock, colors, uom };
  };

  return (
    <Card
      className='h-[calc(100vh-100px)]'
      headClass=''
      bodyClass='p-0'
      title={
        <SearchForm
          className='w-[450px]'
          form={form}
          totalCalculator={totalCalculator}
        />
      }
    >
      <Form.List
        name='saleInvoiceProduct'
        rules={[
          {
            required: true,
            message: "Product is required",
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            <div className='max-h-[calc(100vh-220px)] overflow-auto'>
              <table className='w-full'>
                <thead
                  className={
                    "font-Popins text-black bg-tableHeaderBg border-gray-200 sticky top-0 z-10"
                  }
                >
                  <tr>
                    <th className='py-2 pl-2 text-left'>SL</th>
                    <th className='py-2 pl-2 text-left'>Product</th>
                    <th className='py-2 pl-2 text-left'>Quantity</th>
                    <th className='py-2 pl-2 text-left'>Price</th>
                    <th className='py-2 pl-2 text-left'>Discount</th>
                    <th className='py-2 pl-2 text-left'>Amount</th>
                    <th className='py-2 pl-2 text-left'>Tax%</th>
                    <th className='py-2 pl-2 text-left'>Tax</th>
                    <th className='py-2 pl-2 text-left'></th>
                  </tr>
                </thead>
                <tbody className='bg-tableBg'>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const indexedProduct = render(index);
                    return (
                      <tr
                        key={key}
                        className={`hover:bg-slate-900/10 py-1 ${
                          index === fields.length - 1 ? "" : "border-b"
                        }`}
                      >
                        <td className='py-2 pl-2  align-top'>{index + 1}</td>
                        <td className='py-2 pl-2 align-top'>
                          <Form.Item
                            {...restField}
                            name={[name, "productId"]}
                            className='mb-0 max-w-[250px]'
                            rules={[
                              {
                                required: true,
                                message: "Product is required",
                              },
                            ]}
                          >
                            <Select
                              placeholder='Select Product'
                              showSearch
                              loading={productLoading}
                              optionFilterProp='children'
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              onChange={(product) => {
                                handleSetInitial(product, index);
                              }}
                            >
                              {productList?.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <div className='px-2'>{indexedProduct.colors}</div>
                          <div className='px-2'>{indexedProduct.uom}</div>
                        </td>
                        <td className='py-2 pl-2 align-top'>
                          <Form.Item
                            {...restField}
                            name={[name, "productQuantity"]}
                            className='mb-0 max-w-[100px]'
                            rules={[
                              {
                                required: true,
                                message: "quantity is required",
                              },
                            ]}
                          >
                            <InputNumber
                              type='number'
                              style={{ width: "100%" }}
                              size={"small"}
                              placeholder='Quantity'
                              onChange={() => totalCalculator(index)}
                            />
                          </Form.Item>
                          <div>{indexedProduct.stock}</div>
                        </td>
                        <td className='py-2 pl-2 align-top'>
                          <Form.Item
                            {...restField}
                            name={[name, "productSalePrice"]}
                            className='mb-0 max-w-[150px]'
                            rules={[
                              {
                                required: true,
                                message: "Price is required",
                              },
                            ]}
                          >
                            <InputNumber
                              type='number'
                              size='small'
                              style={{ width: "100%" }}
                              placeholder='50000'
                              onChange={() => totalCalculator(index)}
                            />
                          </Form.Item>
                        </td>

                        <td className='py-2 pl-2 align-top'>
                          <div className='flex items-center'>
                            <Form.Item
                              {...restField}
                              name={[name, "productDiscount"]}
                              className='mb-0 max-w-[150px]'
                              rules={[
                                {
                                  required: true,
                                  message: "Discount is required",
                                },
                              ]}
                            >
                              <InputNumber
                                type='number'
                                className='discountType'
                                addonAfter={
                                  <Form.Item
                                    {...restField}
                                    name={[name, "discountType"]}
                                    noStyle
                                  >
                                    <Select
                                      size='small'
                                      style={{
                                        width: 50,
                                      }}
                                      defaultValue={"flat"}
                                      popupClassName='bg-white'
                                      onChange={() => totalCalculator(index)}
                                    >
                                      <Select.Option key='flat'>
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: currency?.currencySymbol,
                                          }}
                                        />
                                      </Select.Option>
                                      <Select.Option key='percentage'>
                                        %
                                      </Select.Option>
                                    </Select>
                                  </Form.Item>
                                }
                                placeholder='0'
                                style={{
                                  width: "100%",
                                }}
                                size={"small"}
                                onChange={() => totalCalculator(index)}
                              />
                            </Form.Item>
                          </div>
                        </td>
                        <td className='py-2 pl-2 align-top min-w-[80px]'>
                          <div className='font-weight-bold md:text-base xxs:text-xs'>
                            {subTotal[index]?.subPrice?.toFixed(2) || 0}
                          </div>
                        </td>
                        <td className='py-2 pl-2 align-top min-w-[80px]'>
                          <Form.Item
                            {...restField}
                            name={[name, "productVat"]}
                            className='mb-0 max-w-[100px]'
                            rules={[
                              {
                                required: true,
                                message: "Tax is required",
                              },
                            ]}
                          >
                            <InputNumber
                              type='number'
                              size='small'
                              style={{ width: "100%" }}
                              placeholder='50000'
                              onChange={() => totalCalculator(index)}
                            />
                          </Form.Item>
                        </td>
                        <td className='py-2 pl-2 align-top min-w-[80px]'>
                          <div className='font-weight-bold md:text-base xxs:text-xs'>
                            {subTotal[index]?.subVatAmount?.toFixed(2) || 0}
                          </div>
                        </td>
                        <td className='py-2 pl-2 align-top'>
                          <Form.Item>
                            <button
                              shape='circle'
                              className='flex justify-center items-center hover:bg-black/40 rounded-md'
                              onClick={() => {
                                remove(name);
                                totalCalculator(index);
                              }}
                            >
                              <CiCircleRemove size={25} />
                            </button>
                          </Form.Item>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {fields.length === 0 && (
              <div className='text-center py-10'>No product selected yet</div>
            )}
            <div className='flex items-center justify-center mt-2'>
              <Button
                onClick={() => add()}
                className='flex items-center justify-center w-48'
                block
                icon={<PlusOutlined />}
              >
                Add Product
              </Button>
            </div>
          </>
        )}
      </Form.List>
    </Card>
  );
}
