import { Card, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../UI/Pagination";
import SearchForm from "../../UI/Search";
import { loadProduct } from "../../redux/rtk/features/product/productSlice";
import { loadAllProductSubCategory } from "../../redux/rtk/features/productSubCategory/productSubCategorySlice";
import { stringShorter } from "../../utils/functions";

export default function ProductsForSale({
  form: MainForm,
  totalCalculator,
  setSelectedProduct,
}) {
  const dispatch = useDispatch();

  const [pageConfig, setPageConfig] = useState({
    page: 1,
    count: 10,
    status: "true",
  });
  const {
    list,
    total: totalProd,
    loading,
  } = useSelector((state) => state.products);

  const { list: subCategoryList, loading: subLoading } =
    useSelector((state) => state.productSubCategories) || {};

  const fetchData = (page, count) => {
    setPageConfig((prev) => {
      return { ...prev, page, count };
    });
  };
  useEffect(() => {
    dispatch(loadProduct(pageConfig));
    dispatch(loadAllProductSubCategory({ page: 1, count: 100, status: true }));
  }, [dispatch, pageConfig]);

  const handleSelectedProds = (item) => {
    const productArray = MainForm.getFieldValue("saleInvoiceProduct") || [];
    const findProduct = productArray.find((pro) => pro.productId === item.id);
    if (!findProduct) {
      // localState
      setSelectedProduct((prev) => [...prev, item]);
      // form
      MainForm.setFieldsValue({
        saleInvoiceProduct: [
          ...productArray,
          {
            productId: item.id,
            productSalePrice: item.productSalePrice,
            productQuantity: item.productQuantity ? 1 : 0,
            productName: item.name,
            productVat: item.productVat ? item.productVat?.percentage : 0,
            productDiscount: item.discount?.value
              ? parseInt(item.discount?.value)
              : 0,
            discountType: item.discount?.type || "flat",
          },
        ],
      });
      // calculating and updating in ui
      totalCalculator();
    } else if (findProduct) {
      // if there is product and if its clicked quantity will be increased
      const updatedProducts = productArray?.map((pro) => {
        if (pro.productId === item.id) {
          return {
            ...pro,
            productQuantity: pro.productQuantity + 1,
          };
        }
        return pro;
      });

      MainForm.setFieldsValue({
        saleInvoiceProduct: updatedProducts,
      });
    }
    // calculating and updating in ui
    totalCalculator();
  };

  const handleChange = (value, name) => {
    setPageConfig((prev) => {
      return {
        ...prev,
        [name]: value,
        page: 1,
      };
    });
  };

  const Products = ({ item, index }) => {
    const handleOnError = (e) => {
      e.target.src = "/images/default.jpg";
    };
    return (
      <Card
        style={{
          width: "100%",
          border: "none",
          height: "120px",
        }}
        bodyStyle={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "120px",
        }}
        className="relative  bg-white hover:bg-white hover:shadow-md duration-150 overflow-hidden cursor-pointer"
        onClick={() => {
          handleSelectedProds(item);
        }}>
        <div className="flex items-center gap-2">
          <div className="w-[80px] h-[44px] relative">
            <img
              alt="example"
              className="absolute object-cover w-full h-full"
              src={item.productThumbnailImageUrl || ""}
              onError={handleOnError}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="flex-grow-1">
            <p className="font-bold mb-0">{stringShorter(item.name, 20)}</p>
            <p className="mb-0" style={{ fontSize: "12px" }}>
              Price : {item.productSalePrice}
            </p>
            <p
              className={`${
                item.productQuantity ? "bg-violet-600" : "bg-red-600"
              } text-white p-1 absolute top-0 left-0`}
              style={{ fontSize: "12px" }}>
              QTY: {item.productQuantity || 0}
            </p>
            <p style={{ fontSize: "12px" }}>
              {" "}
              SKU : {stringShorter(item.sku, 10)}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col max-h-[200px] lg:max-h-[calc(100vh-180px)] overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-around items-center gap-3 pb-3 lg:pb-0">
        <SearchForm
          className="w-full mt-4 mx-2"
          form={MainForm}
          totalCalculator={totalCalculator}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
      <div className="hidden lg:grid flex-grow  grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-2 mt-5">
        {list
          ? list.map((item, index) => (
              <Products key={index} index={index} item={item} />
            ))
          : loading && (
              <div className="w-100 flex justify-center items-center">
                <Spin size="large" />
              </div>
            )}
      </div>

      <div className="hidden lg:block">
        {totalProd >= 11 && (
          <div className="mt-4">
            <Pagination onChange={fetchData} total={totalProd} />
          </div>
        )}
      </div>
    </div>
  );
}
