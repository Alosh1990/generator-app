"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaUltimate() {
  const [mounted, setMounted] = useState(false);
  const [stockBefore, setStockBefore] = useState('26820'); 
  const [fuelRows, setFuelRows] = useState([
    { id: 1, name: 'CAT 1', yest: '', today: '' },
    { id: 2, name: 'CAT 2', yest: '', today: '' },
    { id: 3, name: 'CAT 3', yest: '', today: '' },
  ]);
  const [kwRows, setKwRows] = useState([
    { id: 1, name: 'CAT 1', yest: '', today: '' },
    { id: 2, name: 'CAT 2', yest: '', today: '' },
    { id: 3, name: 'CAT 3', yest: '', today: '' },
  ]);

  useEffect(() => { setMounted(true); }, []);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const kDiffs = kwRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);
    return { fDiffs, kDiffs, totalFuel, totalKW, current: (Number(stockBefore) || 0) - totalFuel };
  }, [stockBefore, fuelRows, kwRows]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 p-4 relative overflow-hidden font-sans selection:bg-blue-500/30" dir="rtl">
      
      {/* Dynamic Background Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-bounce duration-[10s]"></div>
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(15, 15, 20, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .input-glass {
          background: rgba(0, 0, 0, 0.5) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          color: #fff !important;
          text-align: center !important;
          transition: 0.3s all ease;
          outline: none !important;
        }
        .input-glass:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2) !important;
        }
        .neon-glow-blue { text-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        .neon-glow-green { text-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
      `}</style>

      <div className="max-w-[460px] mx-auto relative z-10 space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center px-2 py-4">
          <h1 className="text-3xl font-black tracking-tighter italic text-white group cursor-default">
            رُكبة <span className="text-blue-500 group-hover:text-blue-400 transition-colors">PRO</span>
          </h1>
          <button onClick={() => confirm("ترحيل؟") && window.location.reload()} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95">
            MIGRATE ⏭️
          </button>
        </div>

        {/* Main Display - Glass Black */}
        <div className="glass-card p-10 text-center border-t border-white/10">
          <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">الرصيد المتبقي</span>
          <div className="text-8xl font-black text-white my-6 tracking-tighter tabular-nums neon-glow-blue">
            {stats.current.toLocaleString()}
          </div>
          <div className="relative mt-8">
            <span className="absolute -top-2 right-4 bg-[#050508] px-2 text-[9px] text-blue-500 font-bold uppercase tracking-widest z-10">الخزين الكلي</span>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} className="input-glass w-full p-4 text-2xl font-bold" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5 border-r-4 border-emerald-500/40">
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">صرف الكاز</p>
            <p className="text-3xl font-black text-emerald-400 tabular-nums">{stats.totalFuel}</p>
          </div>
          <div className="glass-card p-5 border-r-4 border-yellow-500/40">
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">إنتاج الـ KW</p>
            <p className="text-3xl font-black text-yellow-400 tabular-nums">{stats.totalKW}</p>
          </div>
        </div>

        {/* Dynamic Tables */}
        <div className="space-y-8">
          {/* Fuel Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-600 px-3 uppercase tracking-widest">⛽ عدادات المولدات</h3>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass-card p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-blue-500 italic text-xs">{row.name.split(' ')[1]}</div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="input-glass p-2 text-sm opacity-60" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="input-glass p-2 text-sm font-bold" />
                </div>
                <div className="w-14 text-center">
                  <span className="text-2xl font-black text-emerald-400 tabular-nums neon-glow-green">{stats.fDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* KW Section */}
          <div className="space-y-3 pb-10">
            <h3 className="text-[10px] font-black text-slate-600 px-3 uppercase tracking-widest">⚡ إنتاج الطاقة</h3>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass-card p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors border-r-2 border-yellow-500/20">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-yellow-500 italic text-xs">KW</div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} className="input-glass p-2 text-sm opacity-60" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} className="input-glass p-2 text-sm font-bold" />
                </div>
                <div className="w-14 text-center">
                  <span className="text-2xl font-black text-blue-400 tabular-nums">{stats.kDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
