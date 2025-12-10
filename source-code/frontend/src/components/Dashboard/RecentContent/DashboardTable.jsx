import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Table from "../../../UI/Table";

export default function DashboardTable({
  loading,
  list,
  columns,
  title,
  slug,
  total,
}) {
  return (
    <div className='recent flex h-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-scaleIn'>
      <div className='flex items-center justify-between gap-3 border-b border-slate-100/80 px-4 py-3 dark:border-slate-800 transition-colors duration-300'>
        <div className='space-y-1'>
          <h3 className='font-semibold text-slate-900 dark:text-white'>{title}</h3>
          <p className='text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400'>
            Latest activity
          </p>
        </div>
        <Link
          className='inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-blue-200 hover:text-blue-700 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-blue-200 dark:hover:border-blue-500/60'
          to={`/admin/${slug}`}
        >
          View all {total ? `(${total})` : ""}
          <HiOutlineArrowNarrowRight className='text-sm transition-transform duration-300 group-hover:translate-x-1' />
        </Link>
      </div>
      <div className='flex-1 p-3'>
        <Table
          headClass={"!bg-transparent text-slate-500 dark:text-slate-300"}
          className='!bg-transparent text-slate-900 dark:text-slate-100'
          columns={columns}
          data={list}
          loading={loading}
        />
      </div>
    </div>
  );
}
