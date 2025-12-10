import { Tooltip } from "antd";
import { Fragment } from "react";
import { FaCoins } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { MdInventory2, MdOutlineInventory2 } from "react-icons/md";
import { abbreviateNumber } from "../../utils/nFormetter";
import useCurrency from "../../utils/useCurrency";
import { Link } from "react-router-dom";
export default function ProductCard({ card }) {
  const currency = useCurrency();
  return (
    <Fragment>
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-5 mb-5">
        <div className="ant-shadow w-full relative sm:p-2 dark:bg-[#2e2d35] flex sm:justify-center items-center md:p-6 p-2 bg-white rounded-lg dashboard-card-bg">
          <div className="sm:hidden inline-flex flex-shrink-0 items-center justify-center h-14 w-14 text-blue-600 bg-blue-100 rounded-lg mr-6">
            <MdInventory2 size={30} />
          </div>
          <div>
            <Tooltip
              title={<span className="text-lg">{card?.uniqueProduct}</span>}
            >
              <span className="block text-blue-600 text-2xl sm:text-3xl font-bold sm:text-center">
                <span />
                {card?.uniqueProduct
                  ? abbreviateNumber(card?.uniqueProduct)
                  : 0}
              </span>
            </Tooltip>
            <span className="uppercase sm:text-[14px] block font-semibold sm:font-bold sm:mt-2 dark:text-yellow-100 ">
              Unique Product
            </span>
          </div>
        </div>
        <div className="ant-shadow w-full relative sm:p-2 dark:bg-[#2e2d35] flex sm:justify-center items-center md:p-6 p-2 bg-white rounded-lg dashboard-card-bg">
          <div className="sm:hidden inline-flex flex-shrink-0 items-center justify-center h-14 w-14 text-violet-600 bg-violet-100 rounded-lg mr-6">
            <FaCoins size={30} />
          </div>
          <div>
            <Tooltip
              title={
                <span className="text-lg">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currency?.currencySymbol,
                    }}
                  />
                  {card?.inventorySalesValue.toFixed(3)}
                </span>
              }
            >
              <span className="block text-violet-600 text-2xl sm:text-3xl font-bold sm:text-center">
                {" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: currency?.currencySymbol,
                  }}
                />
                {card?.inventorySalesValue
                  ? abbreviateNumber(Number(card.inventorySalesValue))
                  : 0}
              </span>
              <span className="uppercase sm:text-[14px] block font-semibold sm:font-bold sm:mt-2  dark:text-yellow-100 ">
                Inventory Sale Value{" "}
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="ant-shadow w-full relative sm:p-2 dark:bg-[#2e2d35] flex sm:justify-center items-center md:p-6 p-2 bg-white rounded-lg dashboard-card-bg">
          <div className="sm:hidden inline-flex flex-shrink-0 items-center justify-center h-14 w-14 text-violet-500 bg-violet-100 rounded-lg mr-6">
            <FaMoneyBills size={30} />
          </div>
          <div>
            <Tooltip
              title={
                <span className="text-lg">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currency?.currencySymbol,
                    }}
                  />
                  {card?.inventoryPurchaseValue.toFixed(3)}
                </span>
              }
            >
              <span className="block text-violet-500 text-2xl sm:text-3xl font-bold sm:text-center">
                <span
                  dangerouslySetInnerHTML={{
                    __html: currency?.currencySymbol,
                  }}
                />
                {card?.inventoryPurchaseValue
                  ? abbreviateNumber(Number(card.inventoryPurchaseValue))
                  : 0}
              </span>

              <span className="uppercase sm:text-[14px] block font-semibold sm:font-bold sm:mt-2  dark:text-yellow-100 ">
                Inventory Purchase Value{" "}
              </span>
            </Tooltip>
          </div>
        </div>

        <div className="ant-shadow w-full relative sm:p-2 dark:bg-[#2e2d35] flex sm:justify-center items-center md:p-6 p-2 bg-white rounded-lg dashboard-card-bg">
          <Link to="/admin/product-sort-list">
            <div className="sm:hidden inline-flex flex-shrink-0 items-center justify-center h-14 w-14 text-blue-600 bg-blue-100 rounded-lg mr-6">
              <MdOutlineInventory2 size={30} />
            </div>
            <div>
              <Tooltip
                title={
                  <span className="text-lg">{card?.shortProductCount}</span>
                }
              >
                <span className="block text-blue-600 text-2xl sm:text-3xl font-bold sm:text-center">
                  <span />
                  {card?.shortProductCount
                    ? abbreviateNumber(card?.shortProductCount)
                    : 0}
                </span>
              </Tooltip>
              <span className="uppercase sm:text-[14px] block font-semibold sm:font-bold sm:mt-2 dark:text-yellow-100 ">
                {" "}
                Short Product{" "}
              </span>
            </div>
          </Link>
        </div>
      </section>
    </Fragment>
  );
}
