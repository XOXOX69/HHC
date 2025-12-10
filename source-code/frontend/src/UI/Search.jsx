import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductList,
  loadProductSearch,
} from "../redux/rtk/features/product/productSearchSlice";
import { cn } from "../utils/functions";
export default function SearchForm({
  className,
  form,
  totalCalculator,
  setSelectedProduct,
}) {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeoutRef = useRef(null);

  const { list } = useSelector((state) => state.productSearch);

  const handleSelect = (product) => {
    const productArray = form.getFieldValue("saleInvoiceProduct") || [];

    const isExist = productArray.find((item) => item.productId === product.id);

    if (isExist) {
      const newArray = productArray.map((item) => {
        if (product.id === item.productId) {
          return {
            ...item,
            productQuantity: item.productQuantity
              ? item.productQuantity + 1
              : 1,
          };
        }
        return item;
      });

      form.setFieldsValue({
        saleInvoiceProduct: newArray,
      });
    } else {
      // localState
      setSelectedProduct && setSelectedProduct((prev) => [...prev, product]);
      form.setFieldsValue({
        saleInvoiceProduct: [
          ...productArray,
          {
            productId: product.id,
            productName: product.name,
            productQuantity: setSelectedProduct ? 1 : 0,
            productSalePrice: product.productSalePrice,
            productVat: product.productVat ? product.productVat?.percentage : 0,
            productDiscount: product.discount?.value
              ? parseInt(product.discount?.value)
              : 0,
            discountType: product.discount?.type || "flat",
          },
        ],
      });
    }
    totalCalculator();
  };

  const onChange = async (e) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSearchTerm(e.target.value);
    debounceTimeoutRef.current = setTimeout(async () => {
      if (e.target.value !== "") {
        const resp = await dispatch(
          loadProductSearch({
            query: "search",
            key: e.target.value,
            count: 7,
          })
        );

        if (resp.payload?.data?.getAllProduct?.length === 1) {
          handleSelect(resp.payload?.data?.getAllProduct[0]);
          handleClear();
        }
      } else {
        dispatch(clearProductList());
      }
    }, 500);
  };

  const handleClear = () => {
    if (searchTerm !== "") {
      setSearchTerm("");
      dispatch(clearProductList());
    }
  };

  useEffect(() => {
    return () => {
      handleClear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={cn("relative w-full ", {
        [className]: className,
      })}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          className={`w-full py-2 px-5 rounded-lg outline-0 ${
            list?.length > 0 && "rounded-b-none"
          }`}
          placeholder="Search Product"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="text-black/50 absolute  right-8 h-full pl-2 pr-4 z-10 ">
            <MdClear size={25} />
          </button>
        )}
        <button
          type="button"
          className="text-gray-400 absolute  right-0 h-full pl-2 pr-4 z-10 ">
          <IoSearchOutline size={25} />
        </button>
      </div>
      {list?.length > 0 && (
        <div
          className={`absolute bg-white shadow-md z-20 w-full rounded-b-lg max-h-80 md:max-h-[600px] overflow-y-auto `}>
          {list.map((item) => (
            <LiveSearchCard
              onSelect={handleSelect}
              key={item.id}
              product={item}
              handleClear={handleClear}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LiveSearchCard({ product, onSelect, handleClear }) {
  const { name, productQuantity } = product;

  return (
    <div
      onClick={() => {
        onSelect(product);
        handleClear();
      }}
      className="flex justify-between items-center gap-2 py-1 w-full px-5 hover:bg-slate-950/10 text-sm">
      <div className="flex items-center gap-3 justify-start">
        <h1 className="font-medium text-gray-700">{name}</h1>
      </div>

      <div className="">
        {productQuantity > 0 ? (
          <span
            className={`bg-green-500/10 text-green-700 rounded px-2 flex gap-2`}>
            Stock: <span>{productQuantity}</span>
          </span>
        ) : (
          <span className={`bg-red-500/10 text-red-700 rounded px-2`}>
            Stock out
          </span>
        )}
      </div>
    </div>
  );
}
