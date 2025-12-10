import { DatePicker } from "antd";
import dayjs from "dayjs";
import { AiFillPrinter } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa";
import { FaMoneyBillTransfer, FaMoneyBillTrendUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
export default function QuickLink({ pageConfig, setPageConfig }) {
  const { RangePicker } = DatePicker;
  const onCalendarChange = (dates) => {
    if (!dates || dates.length < 2 || !dates[0] || !dates[1]) return;

    const startDate = dates[0].format("YYYY-MM-DD");
    const endDate = dates[1].format("YYYY-MM-DD");

    setPageConfig((prev) => {
      return {
        ...prev,
        startDate,
        endDate,
      };
    });
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50 shadow-xl dark:border-slate-800/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" aria-hidden></div>
      <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" aria-hidden></div>

      <div className="relative flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2 text-slate-900 dark:text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Control center
          </p>
          <h1 className="text-2xl font-semibold">Quick actions</h1>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
            Jump straight into the flows you use most. Adjust the date range to
            refresh dashboard insights instantly.
          </p>
        </div>
        <div className="relative flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Date range
          </span>
          <RangePicker
            className="range-picker w-full !border-slate-200/80 !bg-transparent !text-slate-900 dark:!border-slate-700 dark:!text-slate-100"
            onCalendarChange={onCalendarChange}
            defaultValue={[
              dayjs(pageConfig.startDate, "YYYY-MM-DD"),
              dayjs(pageConfig.endDate, "YYYY-MM-DD"),
            ]}
            allowClear={false}
          />
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-3 border-t border-slate-200/80 px-6 py-5 sm:grid-cols-4 dark:border-slate-800/80">
        <Link
          to="/admin/sale/add"
          className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/70 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FaMoneyBillTrendUp size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Create
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Sale
                </p>
              </div>
            </div>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-300">
              New
            </span>
          </div>
          <p className="text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-white">
            Build an invoice and collect payment in one go.
          </p>
        </Link>

        <Link
          to="/admin/purchase/add"
          className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/70 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
                <FaCartPlus size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Create
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Purchase
                </p>
              </div>
            </div>
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300">
              Add
            </span>
          </div>
          <p className="text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-white">
            Log supplier bills and track costs quickly.
          </p>
        </Link>

        <Link
          to="/admin/transaction/"
          className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/70 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
                <FaMoneyBillTransfer size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Create
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Transaction
                </p>
              </div>
            </div>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-300">
              Move
            </span>
          </div>
          <p className="text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-white">
            Transfer between accounts and reconcile balances.
          </p>
        </Link>

        <Link
          to="/admin/pos"
          className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/70 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
                <AiFillPrinter size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Launch
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  POS
                </p>
              </div>
            </div>
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-white">
            Open the register and serve walk-in customers.
          </p>
        </Link>
      </div>
    </div>
  );
}
