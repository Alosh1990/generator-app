"use client";
import React, { useMemo } from "react";

export default function RakbaDevilUI() {

  const rows = [
    { name: "Cat 1", y: 2661561, t: 2664809 },
    { name: "Cat 2", y: 2693445, t: 2697404 },
    { name: "Cat 3", y: 1541614, t: 1545662 },
  ];

  const stockBefore = 26820;

  const stats = useMemo(() => {
    const diffs = rows.map(r => r.t - r.y);
    const total = diffs.reduce((a, b) => a + b, 0);
    return {
      diffs,
      total,
      current: stockBefore - total,
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b12] p-6 text-white">

      {/* FRAME */}
      <div className="w-full max-w-5xl p-[2px] rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_60px_rgba(0,255,255,0.3)]">

        <div className="bg-[#0b111c]/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">

          {/* HEADER */}
          <div className="flex justify-between mb-6 gap-4">
            <div className="flex-1 text-center py-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
              جدول صرف الكيلو واط 📋
            </div>
            <div className="flex-1 text-center py-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
              جدول صرف الكاز 📋
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-2xl overflow-hidden border border-cyan-400/20">

            {/* HEADER ROW */}
            <div className="grid grid-cols-4 text-center text-yellow-300 bg-black/40 py-3 border-b border-cyan-400/20">
              <span>الفئة</span>
              <span>عداد الأمس</span>
              <span>عداد اليوم</span>
              <span>الصرف</span>
            </div>

            {/* DATA */}
            {rows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-4 text-center py-4 border-b border-white/5 hover:bg-cyan-500/5 transition"
              >
                <span className="text-yellow-200">{r.name}</span>
                <span className="text-blue-300">{r.y.toLocaleString()}</span>
                <span className="text-blue-300">{r.t.toLocaleString()}</span>
                <span className="text-cyan-400 font-bold text-lg glow">
                  {stats.diffs[i]}
                </span>
              </div>
            ))}

            {/* TOTAL */}
            <div className="flex justify-between px-6 py-4 bg-black/50 text-yellow-300 font-bold text-lg">
              <span>المجموع</span>
              <span>{stats.total.toLocaleString()} kWh</span>
            </div>

          </div>

          {/* STOCK */}
          <div className="mt-6 p-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 shadow-[0_0_30px_rgba(0,255,255,0.2)]">

            <p className="text-lg">
              الخزين قبل الصرف:
              <span className="text-yellow-300 font-bold ml-2">
                {stockBefore.toLocaleString()}
              </span>
              لتر
            </p>

            <p className="text-xl mt-3">
              الخزين بعد الصرف:
              <span className="text-emerald-400 text-2xl font-black ml-2 glow">
                {stats.current.toLocaleString()}
              </span>
              لتر 👍
            </p>

          </div>

        </div>
      </div>

      {/* EFFECTS */}
      <style jsx>{`
        .glow {
          text-shadow: 0 0 10px rgba(0,255,255,0.8),
                       0 0 20px rgba(0,255,255,0.5);
        }
      `}</style>

    </div>
  );
}
