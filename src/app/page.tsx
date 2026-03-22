"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function RakbaPro() {
  const [mounted, setMounted] = useState(false);

  const [stockBefore, setStockBefore] = useState("26820");

  const [fuelRows, setFuelRows] = useState([
    { id: 1, name: "Cat 1", yest: "732942", today: "733835" },
    { id: 2, name: "Cat 2", yest: "757151", today: "758214" },
    { id: 3, name: "Cat 3", yest: "664490", today: "665588" },
  ]);

  const [kwRows, setKwRows] = useState([
    { id: 1, name: "Cat 1", yest: "2661561", today: "2664809" },
    { id: 2, name: "Cat 2", yest: "2693445", today: "2697404" },
    { id: 3, name: "Cat 3", yest: "1541614", today: "1545662" },
  ]);

  // تحميل البيانات
  useEffect(() => {
    const saved = localStorage.getItem("rakba-data");
    if (saved) {
      const data = JSON.parse(saved);
      setFuelRows(data.fuelRows);
      setKwRows(data.kwRows);
      setStockBefore(data.stockBefore);
    }
    setMounted(true);
  }, []);

  // حفظ تلقائي
  useEffect(() => {
    localStorage.setItem(
      "rakba-data",
      JSON.stringify({ fuelRows, kwRows, stockBefore })
    );
  }, [fuelRows, kwRows, stockBefore]);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(
      (r) => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0))
    );
    const kDiffs = kwRows.map(
      (r) => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0))
    );

    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);

    return {
      fDiffs,
      kDiffs,
      totalFuel,
      totalKW,
      current: (Number(stockBefore) || 0) - totalFuel,
    };
  }, [stockBefore, fuelRows, kwRows]);

  if (!mounted) return null;

  const glass =
    "backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg rounded-2xl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glass} p-4 flex justify-between items-center`}
        >
          <h1 className="text-2xl font-black">🚀 Rakba PRO</h1>
          <button
            onClick={() => window.print()}
            className="text-xs bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20"
          >
            PDF
          </button>
        </motion.div>

        {/* SUMMARY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className={`${glass} p-4`}>
            <p className="text-zinc-400 text-sm">صرف الكاز</p>
            <p className="text-2xl font-black text-blue-400">
              {stats.totalFuel}
            </p>
          </div>

          <div className={`${glass} p-4`}>
            <p className="text-zinc-400 text-sm">صرف الكهرباء</p>
            <p className="text-2xl font-black text-yellow-400">
              {stats.totalKW.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* FUEL TABLE */}
        <motion.div className={`${glass} p-4`}>
          <h2 className="mb-3 font-bold">⛽ الكاز</h2>

          {fuelRows.map((row, i) => (
            <motion.div
              key={row.id}
              layout
              className="grid grid-cols-4 gap-2 mb-3 items-center"
            >
              <span className="text-zinc-400">{row.name}</span>

              <input
                type="number"
                value={row.yest}
                onChange={(e) => {
                  const n = [...fuelRows];
                  n[i].yest = e.target.value;
                  setFuelRows(n);
                }}
                className="bg-black/40 p-2 rounded text-center"
              />

              <input
                type="number"
                value={row.today}
                onChange={(e) => {
                  const n = [...fuelRows];
                  n[i].today = e.target.value;
                  setFuelRows(n);
                }}
                className="bg-black/40 p-2 rounded text-center"
              />

              <span className="font-black text-blue-400">
                {stats.fDiffs[i]}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* KW TABLE */}
        <motion.div className={`${glass} p-4`}>
          <h2 className="mb-3 font-bold">⚡ الكهرباء</h2>

          {kwRows.map((row, i) => (
            <motion.div
              key={row.id}
              layout
              className="grid grid-cols-4 gap-2 mb-3 items-center"
            >
              <span className="text-zinc-400">{row.name}</span>

              <input
                type="number"
                value={row.yest}
                onChange={(e) => {
                  const n = [...kwRows];
                  n[i].yest = e.target.value;
                  setKwRows(n);
                }}
                className="bg-black/40 p-2 rounded text-center"
              />

              <input
                type="number"
                value={row.today}
                onChange={(e) => {
                  const n = [...kwRows];
                  n[i].today = e.target.value;
                  setKwRows(n);
                }}
                className="bg-black/40 p-2 rounded text-center"
              />

              <span className="font-black text-yellow-400">
                {stats.kDiffs[i]}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* STOCK */}
        <motion.div className={`${glass} p-4 space-y-3`}>
          <div className="flex justify-between items-center">
            <span>الخزين قبل</span>
            <input
              type="number"
              value={stockBefore}
              onChange={(e) => setStockBefore(e.target.value)}
              className="bg-black/40 p-2 rounded w-32 text-center"
            />
          </div>

          <div className="flex justify-between items-center">
            <span>الخزين بعد</span>
            <span className="text-2xl font-black text-emerald-400">
              {stats.current.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* ACTION */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (confirm("ترحيل اليوم؟")) {
              setFuelRows(
                fuelRows.map((r) => ({ ...r, yest: r.today, today: "" }))
              );
              setKwRows(
                kwRows.map((r) => ({ ...r, yest: r.today, today: "" }))
              );
              setStockBefore(stats.current.toString());
            }
          }}
          className="w-full bg-white text-black py-4 rounded-2xl font-black"
        >
          ⏭️ يوم جديد
        </motion.button>

      </div>
    </div>
  );
}
