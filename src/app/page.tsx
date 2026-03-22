"use client";
import React, { useState, useMemo } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("kwh");

  const [rowsKwh, setRowsKwh] = useState([
    { name: "Cat 1", y: "2661561", t: "2664809" },
    { name: "Cat 2", y: "2693445", t: "2697404" },
    { name: "Cat 3", y: "1541614", t: "1545662" },
  ]);

  const [rowsGas, setRowsGas] = useState([
    { name: "Cat 1", y: "732942", t: "733835" },
    { name: "Cat 2", y: "757151", t: "758214" },
    { name: "Cat 3", y: "664490", t: "665588" },
  ]);

  const [stockBeforeKwh, setStockBeforeKwh] = useState("26820");
  const [stockBeforeGas, setStockBeforeGas] = useState("26820");

  const statsKwh = useMemo(() => {
    const diffs = rowsKwh.map(r =>
      Math.max(0, (Number(r.t) || 0) - (Number(r.y) || 0))
    );
    const total = diffs.reduce((a, b) => a + b, 0);
    return {
      diffs,
      total,
      current: (Number(stockBeforeKwh) || 0) - total,
    };
  }, [rowsKwh, stockBeforeKwh]);

  const statsGas = useMemo(() => {
    const diffs = rowsGas.map(r =>
      Math.max(0, (Number(r.t) || 0) - (Number(r.y) || 0))
    );
    const total = diffs.reduce((a, b) => a + b, 0);
    return {
      diffs,
      total,
      current: (Number(stockBeforeGas) || 0) - total,
    };
  }, [rowsGas, stockBeforeGas]);

  const rows = activeTab === "kwh" ? rowsKwh : rowsGas;
  const setRows = activeTab === "kwh" ? setRowsKwh : setRowsGas;
  const stats = activeTab === "kwh" ? statsKwh : statsGas;
  const stockBefore = activeTab === "kwh" ? stockBeforeKwh : stockBeforeGas;
  const setStockBefore = activeTab === "kwh" ? setStockBeforeKwh : setStockBeforeGas;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070b12] p-4 text-white">
      <div className="w-full max-w-5xl p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_60px_rgba(0,255,255,0.3)]">
        <div className="bg-[#0b111c]/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10">

          {/* HEADER TABS */}
          <div className="flex gap-4 mb-6 cursor-pointer flex-wrap">
            <div
              onClick={() => setActiveTab("kwh")}
              className={`flex-1 text-center py-4 rounded-xl border ${
                activeTab === "kwh"
                  ? "border-cyan-400 bg-cyan-500/30 font-bold"
                  : "border-cyan-400/20 bg-cyan-500/10"
              } transition-all duration-200`}
            >
              جدول صرف الكيلو وات 📋
            </div>
            <div
              onClick={() => setActiveTab("gas")}
              className={`flex-1 text-center py-4 rounded-xl border ${
                activeTab === "gas"
                  ? "border-cyan-400 bg-cyan-500/30 font-bold"
                  : "border-cyan-400/20 bg-cyan-500/10"
              } transition-all duration-200`}
            >
              جدول صرف الكاز 📋
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-2xl overflow-x-auto border border-cyan-400/20">
            <div className="min-w-[400px]">

              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-4 text-center text-yellow-300 bg-black/40 py-3">
                <span>الفئة</span>
                <span>عداد الأمس</span>
                <span>عداد اليوم</span>
                <span>الصرف</span>
              </div>

              {/* Table Rows */}
              {rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center py-4 border-t border-white/5 bg-black/20 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0"
                >
                  <span className="text-yellow-200 font-semibold">{r.name}</span>
                  <input
                    type="number"
                    value={r.y}
                    onChange={(e) => {
                      const newRows = [...rows];
                      newRows[i].y = e.target.value;
                      setRows(newRows);
                    }}
                    className="bg-black/40 rounded p-3 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto"
                  />
                  <input
                    type="number"
                    value={r.t}
                    onChange={(e) => {
                      const newRows = [...rows];
                      newRows[i].t = e.target.value;
                      setRows(newRows);
                    }}
                    className="bg-black/40 rounded p-3 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-auto"
                  />
                  <span className="text-cyan-400 font-bold text-lg glow">{stats.diffs[i]}</span>
                </div>
              ))}

              {/* Total */}
              <div className="flex flex-col sm:flex-row justify-between px-6 py-4 bg-black/50 text-yellow-300 font-bold text-lg mt-2 rounded-lg sm:rounded-none">
                <span>المجموع</span>
                <span>{stats.total.toLocaleString()} {activeTab === "kwh" ? "kWh" : "لتر"}</span>
              </div>
            </div>
          </div>

          {/* STOCK - يظهر فقط عند جدول الكاز */}
          {activeTab === "gas" && (
            <div className="mt-6 p-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>الخزين قبل:</span>
                  <input
                    type="number"
                    value={stockBefore}
                    onChange={(e) => setStockBefore(e.target.value)}
                    className="bg-black/40 rounded p-3 w-32 text-center focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span>الخزين بعد:</span>
                  <span className="text-emerald-400 text-2xl font-black glow">{stats.current.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .glow {
          text-shadow: 0 0 6px cyan, 0 0 12px cyan;
        }
      `}</style>
    </main>
  );
}
