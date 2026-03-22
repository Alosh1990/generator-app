"use client";
import React, { useState, useMemo } from "react";

export default function RakbaFuturistic() {
  const [stockBefore, setStockBefore] = useState(26820);

  const rows = [
    { name: "Cat 1", y: 2661561, t: 2664809 },
    { name: "Cat 2", y: 2693445, t: 2697404 },
    { name: "Cat 3", y: 1541614, t: 1545662 },
  ];

  const stats = useMemo(() => {
    const diffs = rows.map(r => r.t - r.y);
    const total = diffs.reduce((a, b) => a + b, 0);
    return {
      diffs,
      total,
      current: stockBefore - total,
    };
  }, [stockBefore]);

  return (
    <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center p-6 text-white">

      <div className="relative w-full max-w-4xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 animate-borderGlow">

        <div className="bg-[#0b0f17]/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-[0_0_40px_rgba(0,200,255,0.2)]">

          {/* HEADER */}
          <div className="flex justify-between mb-6">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-cyan-400/20 shadow-[0_0_10px_cyan]">
              جدول صرف الكيلو واط 📋
            </div>

            <div className="px-4 py-2 rounded-xl bg-white/5 border border-cyan-400/20 shadow-[0_0_10px_cyan]">
              جدول صرف الكاز 📋
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-2xl border border-cyan-400/20 overflow-hidden">

            {/* HEAD */}
            <div className="grid grid-cols-4 text-center text-yellow-300 py-3 border-b border-cyan-400/20">
              <span>الفئة</span>
              <span>عداد الأمس</span>
              <span>عداد اليوم</span>
              <span>الصرف</span>
            </div>

            {/* ROWS */}
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-4 text-center py-4 border-b border-white/5 hover:bg-white/5 transition">

                <span className="text-yellow-200">{r.name}</span>
                <span className="text-blue-300">{r.y}</span>
                <span className="text-blue-300">{r.t}</span>
                <span className="text-cyan-400 font-bold animate-pulse">
                  {stats.diffs[i]}
                </span>
              </div>
            ))}

            {/* TOTAL */}
            <div className="flex justify-between px-4 py-4 text-yellow-300 font-bold bg-black/30">
              <span>المجموع</span>
              <span>{stats.total.toLocaleString()} kWh</span>
            </div>

          </div>

          {/* STOCK */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.2)]">

            <p className="text-lg">
              الخزين قبل الصرف: <span className="text-yellow-300">{stockBefore.toLocaleString()}</span> لتر
            </p>

            <p className="text-xl mt-2">
              الخزين بعد الصرف:
              <span className="text-emerald-400 font-black text-2xl ml-2 animate-pulse">
                {stats.current.toLocaleString()}
              </span>
              لتر 👍
            </p>

          </div>

        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes borderGlow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .animate-borderGlow {
          animation: borderGlow 6s linear infinite;
        }
      `}</style>

    </div>
  );
}
