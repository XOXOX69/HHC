import Button from "@/UI/Button";
import { decodeHtmlEntity } from "@/utils/functions";
import invoiceGenerator from "@/utils/invoiceGenerator";
import useCurrency from "@/utils/useCurrency";
import moment from "moment";
import { useSelector } from "react-redux";

export default function ProductReportPrint({
  data,
  info,
  title,
  type,
  btnName,
}) {
  const { currencySymbol } = useCurrency() || {};
  const companyInfo = useSelector((state) => state?.setting?.data) || null;

  const currencyLocal = decodeHtmlEntity(currencySymbol);
  const bottomLeftContent = [];

  const bottomRightContent = [
    {
      label: "Total Product Quantity",
      value: `${
        info?.totalProductQuantity
          ? Number(info.totalProductQuantity).toFixed(2)
          : ""
      }`,
    },
    {
      label: "Total Purchase Price",
      value: `${currencyLocal}${
        info?.totalPurchasePrice
          ? Number(info.totalPurchasePrice).toFixed(2)
          : ""
      }`,
    },
    {
      label: "Total Sale Price",
      value: `${currencyLocal}${
        info?.totalSalePrice ? Number(info.totalSalePrice).toFixed(2) : ""
      }`,
    },
  ];
  const tableHead = [
    "id",
    "Name",
    "SKU",
    "Brand ",
    "SubCategory",
    "Color",
    "UoM",
    "QTY",
    "ReOrder QTY",
    "Vat",
    "Purchase Price",
    "Sale Price",
  ];
  const tableBody = data?.map((item) => [
    item?.id,
    item?.name,
    item?.sku,
    item?.productBrand?.name,
    item?.productSubCategory?.name,
    item?.productColor?.map((color) => color.color.name).join(",\n"),
    item?.uom?.name,
    item?.productQuantity,
    item?.reorderQuantity,
    item?.productVat ? item?.productVat?.percentage : "-",
    `${currencyLocal}${
      item?.productPurchasePrice ? item.productPurchasePrice : 0
    }`,
    `${currencyLocal}${item?.productSalePrice ? item.productSalePrice : 0}`,
  ]);

  const customerInfo = [];
  const TopRightInfo = [
    {
      value: `Report Date: ${moment().format("YYYY-MM-DD")}`,
    },
  ];
  const settings = {
    jsPDF: {
      orientation: "landscape",
    },
    tableFontSize: 8,
    infoTopFontSize: 10,
    bottomRightFontSize: 12,
    bottomLeftFontSize: 8,
    footerFontSize: 10,
    bottomMargin: 20,
  };
  return (
    <div className='flex gap-2'>
      <Button
        className='bg-primary flex  justify-center items-center px-4 py-2 text-white rounded'
        onClick={() =>
          invoiceGenerator(type, {
            title,
            TopRightInfo,
            companyInfo,
            customerInfo,
            bottomLeftContent,
            bottomRightContent,
            tableBody,
            tableHead,
            settings,
          })
        }
      >
        {btnName}
      </Button>
    </div>
  );
}
