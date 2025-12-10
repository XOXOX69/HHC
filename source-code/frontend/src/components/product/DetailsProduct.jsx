import Card from "@/UI/Card";
import Menu from "@/UI/Menu";
import { groupByAttribute } from "@/utils/functions";
import { EditOutlined } from "@ant-design/icons";
import { Image, Popover } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiBarcode } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearProduct,
  deleteProduct,
  loadSingleProduct,
} from "../../redux/rtk/features/product/productSlice";
import useCurrency from "../../utils/useCurrency";
import CommonDelete from "../CommonUi/CommonDelete";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import Loader from "../loader/loader";
import GalleryImageSlider from "./GalleryImageSlider";
import GenerateBarcode from "./barcodeGenerator";

const DetailsProduct = () => {
  const { id } = useParams();

  //dispatch
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.product);
  const currency = useCurrency();

  useEffect(() => {
    dispatch(loadSingleProduct(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);
  const handleOnError = (e) => {
    e.target.src = "/images/default.jpg";
  };

  return (
    <>
      {product ? (
        <Card
          className='bg-white'
          title={
            <>
              <h1>{product?.name}</h1>
              {product?.status === "true" ? (
                <span className='px-2 py-[2px] font-normal text-sm bg-green-500 text-white rounded-full'>
                  Active
                </span>
              ) : (
                <span className='px-2 py-[2px] font-normal text-sm bg-gray-500 text-white rounded-full'>
                  Inactive
                </span>
              )}
            </>
          }
          extra={
            <Popover
              className='mr-1'
              content={
                <Menu
                  items={[
                    {
                      label: (
                        <UserPrivateComponent permission={"update-product"}>
                          <Link
                            to={`/admin/product/${product?.id}/update`}
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            <EditOutlined className=' p-1 rounded-md' />
                            Edit
                          </Link>
                        </UserPrivateComponent>
                      ),
                      key: "edit",
                    },
                    {
                      label: (
                        <CommonDelete
                          id={id}
                          title={"Hide"}
                          permission={"delete-product"}
                          deleteThunk={deleteProduct}
                          navigatePath={"/admin/product"}
                          className='bg-white text-black'
                        />
                      ),
                      key: "delete",
                    },
                    {
                      label: (
                        <Link
                          to={`/admin/print-barcode/${id}`}
                          className='flex items-center gap-2 rounded'
                        >
                          <CiBarcode className='text-[1rem]' />
                          Barcode print
                        </Link>
                      ),
                      key: "barcode",
                    },
                  ]}
                />
              }
              placement='bottomRight'
              arrow={false}
              trigger='click'
            >
              <BsThreeDotsVertical className='cursor-pointer text-base' />
            </Popover>
          }
        >
          <div className='my-4 xl:px-8'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='w-full md:w-1/2'>
                <div>
                  <h1 className='border-b pb-1 text-base font-medium text-gray-600'>
                    Specifications
                  </h1>
                  <ul className='flex flex-col gap-2 py-4'>
                    <li className='flex items-center'>
                      <span className='text-gray-400 font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        Brand
                      </span>
                      <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        <Link
                          to={`/admin/product-brand/${product?.productBrand?.id}`}
                        >
                          {product?.productBrand?.name}
                        </Link>
                      </span>
                    </li>
                    <li className='flex items-center'>
                      <span className='text-gray-400 font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        Category
                      </span>
                      <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        <Link
                          to={`/admin/product-category/${product?.productSubCategory?.productCategory?.id}`}
                        >
                          {product?.productSubCategory?.productCategory?.name}
                        </Link>
                      </span>
                    </li>
                    <li className='flex items-center'>
                      <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        Sub-category
                      </span>
                      <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        <Link
                          to={`/admin/product-subcategory/${product?.productSubCategoryId}`}
                        >
                          {product?.productSubCategory?.name}
                        </Link>
                      </span>
                    </li>
                    <li className='flex items-center'>
                      <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        UoM
                      </span>
                      <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        {product?.uom &&
                          `${product?.uomValue}${
                            product?.uom?.name ? `/${product.uom.name}` : ""
                          }`}
                      </span>
                    </li>
                    {product?.productProductAttributeValue &&
                      groupByAttribute(
                        product.productProductAttributeValue
                      ).map((item1, index) => {
                        return (
                          <li key={index} className='flex items-center'>
                            <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                              {
                                item1[0].productAttributeValue.productAttribute
                                  .name
                              }
                              :
                            </span>
                            <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%] flex gap-2'>
                              {item1.map((item, index) => (
                                <span key={index}>
                                  {item.productAttributeValue.name}
                                  {index !== item1.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>

                <div className='w-full'>
                  <h1 className='border-b pb-1 text-base font-medium text-gray-600'>
                    Product Pricing
                  </h1>

                  <ul className='flex flex-col gap-2 py-4'>
                    <li className='flex items-center'>
                      <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        Selling price
                      </span>
                      <span className='text-slate-600  font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: currency?.currencySymbol,
                          }}
                        />
                        {product?.productSalePrice}
                      </span>
                    </li>
                    <li className='flex items-center'>
                      <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        Purchase price
                      </span>
                      <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: currency?.currencySymbol,
                          }}
                        />
                        {product?.productPurchasePrice}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='w-full md:w-1/2'>
                <div className='flex flex-col items-center'>
                  <GenerateBarcode sku={product?.sku} />
                  <Image
                    className='fluid  max-w-[300px] aspect-square'
                    src={
                      product?.productThumbnailImageUrl || "/images/default.jpg"
                    }
                    onError={handleOnError}
                  />
                  <span className='mt-4'>
                    <span className='text-lg flex justify-start items-center gap-3'>
                      <span className='mr-2'>Colors:</span>
                      {product?.productColor?.map((item, index) => (
                        <span
                          key={index}
                          className='text-slate-600 text-base font-medium flex gap-1 items-center'
                        >
                          <span
                            style={{
                              backgroundColor: item.color?.colorCode,
                            }}
                            className='w-5 h-5 rounded-full inline-block'
                          ></span>
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-4 py-4'>
              <div className='w-full md:w-1/2'>
                <h1 className='border-b pb-1 text-base font-medium text-gray-600'>
                  Item Details
                </h1>

                <ul className='flex flex-col gap-2 py-4'>
                  <li className='flex items-center'>
                    <span className='text-gray-400 font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                      SKU
                    </span>
                    <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                      {product?.sku}
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                      Vat/Tax
                    </span>
                    <span className='text-slate-600  font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                      {product?.productVat?.percentage
                        ? product?.productVat?.percentage
                        : 0}
                      %
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <span className='text-gray-400 font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                      Discount
                    </span>
                    <span className='text-slate-600  font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                      {product?.discount?.value
                        ? `${product?.discount.value}${
                            product?.discount.type == "percentage"
                              ? "%"
                              : " flat"
                          } `
                        : "0%"}
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                      Date
                    </span>
                    <span className='text-slate-600  font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                      {moment(product?.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </li>
                </ul>
              </div>
              <div className='w-full md:w-1/2'>
                <div className='w-full'>
                  <h1 className='border-b pb-1 text-base font-medium text-gray-600'>
                    Stock Details
                  </h1>

                  <ul className='flex flex-col gap-2 py-4'>
                    <li className='flex items-center'>
                      <span className='text-gray-400  font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        Quantity
                      </span>
                      <span className='text-slate-600 font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        {product?.productQuantity}
                      </span>
                    </li>
                    <li className='flex items-center'>
                      <span className='text-gray-400 font-medium w-[35%] md:w-[30%] 2xl:w-[25%]'>
                        ReOrder Quantity
                      </span>
                      <span className='text-slate-600  font-medium w-[65%] md:w-[70%] 2xl:w-[75%]'>
                        {product?.reorderQuantity}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='w-full flex gap-2 md:gap-4  text-base font-medium my-3'>
              <div className='w-1/2'>
                <h1 className='font-medium border-b text-slate-600 py-2 mb-2'>
                  Gallery Images
                </h1>
                <GalleryImageSlider data={product?.galleryImage} />
              </div>
              <div className='flex-grow'>
                <h1 className='font-medium border-b text-slate-600 py-2'>
                  Product description
                </h1>
                <p
                  className='py-2'
                  dangerouslySetInnerHTML={{
                    __html: product?.description,
                  }}
                ></p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DetailsProduct;
