import { Tooltip } from "antd";
import { BiCartAdd, BiCartDownload } from "react-icons/bi";
import { FaMoneyBills } from "react-icons/fa6";
import { abbreviateNumber } from "../../../utils/nFormetter";
import useCurrency from "../../../utils/useCurrency";

const NewDashboardCard = ({ information }) => {
  const currency = useCurrency();
  return (
    <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mt-5 mb-5 animate-fadeIn">
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 card-animate" style={{animationDelay: '0.1s'}}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-white dark:from-blue-500/10 dark:via-transparent dark:to-slate-900 transition-opacity duration-300"
          aria-hidden
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-500/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:via-blue-500/5 group-hover:to-blue-600/10 transition-all duration-500" aria-hidden></div>
        <div className="relative flex flex-col gap-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Total Sales
              </p>
              <Tooltip
                title={
                  <span className="text-lg">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: currency?.currencySymbol,
                      }}
                    />
                    {information?.totalSaleAmount?.toFixed(3)}
                  </span>
                }
              >
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currency?.currencySymbol,
                    }}
                  />
                  {information?.totalSaleAmount
                    ? abbreviateNumber(Number(information?.totalSaleAmount))
                    : 0}
                </div>
              </Tooltip>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-[12px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                  #{
                    information?.totalSaleInvoice
                      ? abbreviateNumber(information?.totalSaleInvoice)
                      : 0
                  }{' '}
                  invoices
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Updated live
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <BiCartDownload size={26} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 card-animate" style={{animationDelay: '0.2s'}}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-white dark:from-purple-500/10 dark:via-transparent dark:to-slate-900 transition-opacity duration-300"
          aria-hidden
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-500/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:via-purple-500/5 group-hover:to-purple-600/10 transition-all duration-500" aria-hidden></div>
        <div className="relative flex flex-col gap-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Sale Due
              </p>
              <Tooltip
                title={
                  <span className="text-lg">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: currency?.currencySymbol,
                      }}
                    />
                    {information?.totalSaleDue?.toFixed(3)}
                  </span>
                }
              >
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currency?.currencySymbol,
                    }}
                  />
                  {information?.totalSaleDue
                    ? abbreviateNumber(Number(information?.totalSaleDue))
                    : 0}
                </div>
              </Tooltip>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-[12px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-200">
                  Outstanding
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Requires follow-up
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <FaMoneyBills size={26} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 card-animate" style={{animationDelay: '0.3s'}}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-sky-50 via-transparent to-white dark:from-sky-500/10 dark:via-transparent dark:to-slate-900 transition-opacity duration-300"
          aria-hidden
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/0 via-sky-500/0 to-sky-600/0 group-hover:from-sky-400/5 group-hover:via-sky-500/5 group-hover:to-sky-600/10 transition-all duration-500" aria-hidden></div>
        <div className="relative flex flex-col gap-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Total Purchases
              </p>
              <Tooltip
                title={
                  <span className="text-lg">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: currency?.currencySymbol,
                      }}
                    />
                    {information?.totalPurchaseAmount?.toFixed(3)}
                  </span>
                }
              >
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currency?.currencySymbol,
                    }}
                  />
                  {information?.totalPurchaseAmount
                    ? abbreviateNumber(information?.totalPurchaseAmount)
                    : 0}
                </div>
              </Tooltip>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-[12px] font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                  #{
                    information?.totalPurchaseInvoice
                      ? abbreviateNumber(information?.totalPurchaseInvoice)
                      : 0
                  } orders
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Supplier spend
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <BiCartAdd size={26} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-900 card-animate" style={{animationDelay: '0.4s'}}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-white dark:from-purple-500/10 dark:via-transparent dark:to-slate-900 transition-opacity duration-300"
          aria-hidden
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-500/0 to-purple-600/0 group-hover:from-purple-400/5 group-hover:via-purple-500/5 group-hover:to-purple-600/10 transition-all duration-500" aria-hidden></div>
        <div className="relative flex flex-col gap-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Purchase Due
              </p>
              <Tooltip
                title={
                  <span className="text-lg">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: currency?.currencySymbol,
                      }}
                    />
                    {information?.totalPurchaseDue?.toFixed(3)}
                  </span>
                }
              >
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currency?.currencySymbol,
                    }}
                  />
                  {information?.totalPurchaseDue
                    ? abbreviateNumber(information?.totalPurchaseDue)
                    : 0}
                </div>
              </Tooltip>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-[12px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-200">
                  Pending
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Pay suppliers on time
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <FaMoneyBills size={26} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewDashboardCard;
