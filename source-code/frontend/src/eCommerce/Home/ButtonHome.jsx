import Button from "@/UI/Button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ButtonHome() {
  const [logoError, setLogoError] = useState(false);
  const { data } = useSelector((state) => state.setting);

  let logoRender = null;
  if (data?.logo && !logoError) {
    logoRender = (
      <img
        onError={() => setLogoError(true)}
        loading="lazy"
        className="h-12 w-12 rounded-lg object-contain"
        src={data?.logo}
        alt="Company logo"
      />
    );
  } else {
    logoRender = (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/15">
        OS
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a0f1a]">
        <div className="absolute inset-0 hero-glow opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bgImageForLogin opacity-40 mix-blend-screen" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full border border-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-14 top-6 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute left-12 bottom-10 h-52 w-52 rounded-full border border-white/5" aria-hidden="true" />

        <div className="absolute left-6 top-6 z-20">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-2 text-white ring-1 ring-white/10 backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              {logoRender}
            </div>
            <div className="text-sm font-semibold leading-tight">
              <p className="text-emerald-200">BIGSTOP</p>
              <p className="text-slate-100">OS Inventory</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-5 py-12">
          <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Modern POS UI
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">Welcome to BIGSTOP</h1>
                <p className="max-w-2xl text-base text-slate-200 md:text-lg">
                  {data?.tagLine || "Manage your inventory, sales, purchases, and teams from a single modern workspace."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                {["Profit & Loss", "POS Analysis", "Smart Checkout", "Inventory Sync"].map((item) => (
                  <span key={item} className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10 backdrop-blur">
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/admin/auth/login">
                  <Button
                    color="primary"
                    className="flex items-center gap-3 rounded-2xl border border-emerald-300/40 bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-300">
                    Admin Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    color="primary"
                    className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-200/60 hover:bg-white/15">
                    Customer Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative min-h-[460px]">
              <div className="floating-card absolute left-0 top-2 w-64 rounded-3xl bg-slate-900/80 p-5 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-lg">
                <div className="flex items-start justify-between text-sm font-semibold text-slate-200">
                  <div>Profit and Loss</div>
                  <span className="text-emerald-300">↗</span>
                </div>
                <div className="mt-4 text-4xl font-bold text-white">₱682.5</div>
                <div className="mt-6 h-16">
                  <svg viewBox="0 0 160 70" className="h-full w-full" aria-hidden="true">
                    <path d="M5 50 C35 60 55 15 80 30 C105 45 120 55 155 28" fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="floating-card floating-delay-1 absolute left-16 top-24 w-72 rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-center text-lg font-semibold">POS Sales Analysis</h3>
                <div className="mt-6 grid grid-cols-7 items-end gap-1 text-center text-[10px] text-slate-300">
                  {[15, 26, 18, 22, 30, 16, 20].map((value, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="mx-auto w-5 rounded-sm bg-white" style={{ height: `${value}px` }} />
                      <span className="block text-[9px] text-slate-400">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][idx]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="floating-card floating-delay-2 absolute right-0 bottom-2 w-72 rounded-3xl bg-slate-900/85 p-6 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-lg">
                <p className="text-sm font-semibold text-slate-200">Add Product</p>
                <div className="mt-4 rounded-xl bg-white/5 px-3 py-3 text-slate-200 ring-1 ring-white/10">₱23.99</div>
                <div className="mt-4 flex gap-3">
                  {[
                    { label: "List", color: "bg-emerald-400" },
                    { label: "Pay", color: "bg-amber-400" },
                    { label: "Analytics", color: "bg-sky-400" },
                  ].map(({ label, color }) => (
                    <div key={label} className={`flex h-9 w-9 items-center justify-center rounded-full ${color} text-slate-900 font-semibold`}>
                      {label[0]}
                    </div>
                  ))}
                </div>
                <Button
                  color="primary"
                  className="mt-5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                  Process Sale
                </Button>
                <div className="mt-3 text-center text-sm font-semibold text-slate-200">Quick Sale</div>
              </div>

              <div className="absolute inset-x-0 bottom-10 mx-auto h-28 w-11/12 rounded-[32px] bg-gradient-to-r from-white/5 via-white/10 to-white/5 blur-3xl" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
