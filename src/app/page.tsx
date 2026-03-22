"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaDynamicPro() {
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

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('rakba_dynamic_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.s) setStockBefore(parsed.s);
      if(parsed.fr) setFuelRows(parsed.fr);
      if(parsed.kr) setKwRows(parsed.kr);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_dynamic_v2', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
    }
  }, [stockBefore, fuelRows, kwRows, mounted]);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const kDiffs = kwRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);
    return { fDiffs, kDiffs, totalFuel, totalKW, current: (Number(stockBefore) || 0) - totalFuel };
  }, [stockBefore, fuelRows, kwRows]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* طبقات الخلفية المتحركة (Dynamic Background Layers) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-emerald-600/20 to-blue-500/10 rounded-full blur-[100px] animate-bounce duration-[15s]"></div>
        <div className="absolute top-[30%] left-[20%] w-32 h-32 bg-yellow-500/5 rounded-full blur-[50px] animate-ping duration-[7s]"></div>
      </div>

      <style jsx global>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-panel:hover {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 8px 40px 0 rgba(59, 130, 246, 0.15);
          transform: translateY(-5px) scale(1.01);
        }
        input {
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 15px !important;
          padding: 12px !important;
          color: white !important;
          text-align: center !important;
          font-weight: 800 !important;
          transition: all 0.3s ease !important;
        }
        input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
          background: rgba(0, 0, 0, 0.7) !important;
          outline: none !important;
        }
        .text-gradient-blue {
          background: linear-gradient(to bottom right, #60a5fa, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .neon-border-blue { border-right: 5px solid #3b82f6; }
        .neon-border-green { border-right: 5px solid #10b981; }
        .neon-border-yellow { border-right: 5px solid #f59e0b; }
      `}</style>

      <div className="max-w-[500px] mx-auto relative z-10 space-y-6 pb-12">
        
        {/* Header الفخم */}
        <header className="flex justify-between items-center py-4 px-2">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-gradient-blue">رُكبة PRO</h1>
            <p className="text-[10px] font-bold text-blue-400/60 tracking-[0.4em] uppercase">Control System v4.0</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''}))))}
            className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-3 rounded-2xl text-[11px] font-black shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-90 transition-all"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* الكارت الرئيسي المتبقي */}
        <div className="glass-panel p-10 text-center relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">المتبقي في الخزان (لتر)</p>
          <div className="text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] mb-8">
            {stats.current.toLocaleString()}
          </div>
          <div className="max-w-[240px] mx-auto relative group">
            <span className="absolute -top-2 right-4 bg-[#03050a] px-2 text-[10px] text-blue-400 font-bold uppercase z-20">الخزين الكلي</span>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} className="w-full text-2xl text-blue-300" />
          </div>
        </div>

        {/* إحصائيات سريعة ملونة */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-6 neon-border-green">
             <p className="text-emerald-500 text-[10px] font-black uppercase mb-1 tracking-widest">إجمالي الكاز</p>
             <p className="text-4xl font-black tabular-nums text-white">{stats.totalFuel.toLocaleString()}</p>
          </div>
          <div className="glass-panel p-6 neon-border-yellow">
             <p className="text-yellow-500 text-[10px] font-black uppercase mb-1 tracking-widest">إجمالي الـ KW</p>
             <p className="text-4xl font-black tabular-nums text-white">{stats.totalKW.toLocaleString()}</p>
          </div>
        </div>

        {/* جداول البيانات بنظام الإطارات الملونة */}
        <div className="space-y-8">
          
          {/* قسم الكاز */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-blue-400 px-3 uppercase tracking-[0.5em] flex items-center gap-2">
               <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></span> عدادات الكاز
            </h3>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass-panel p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center font-black text-white italic text-sm shadow-lg shadow-blue-900/40">
                  {row.name.split(' ')[1]}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="text-sm opacity-60" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="text-sm border-emerald-500/30" />
                </div>
                <div className="w-16 text-center border-r border-white/5 pr-4 flex flex-col items-center">
                  <span className="text-[10px] font-black text-emerald-500 uppercase">الفرق</span>
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">{stats.fDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* قسم الكيلو واط */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-yellow-500 px-3 uppercase tracking-[0.5em] flex items-center gap-2">
               <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]"></span> عدادات الطاقة
            </h3>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass-panel p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-700 flex items-center justify-center font-black text-white italic text-sm shadow-lg shadow-yellow-900/40 text-center">
                  KW
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} className="text-sm opacity-60" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} className="text-sm border-blue-500/30" />
                </div>
                <div className="w-16 text-center border-r border-white/5 pr-4 flex flex-col items-center">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">الإنتاج</span>
                  <span className="text-2xl font-black text-blue-300 tabular-nums">{stats.kDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center py-10 opacity-30 text-[9px] font-black tracking-[1em] uppercase text-blue-200">
          Professional Enterprise Solution
        </footer>
      </div>
    </div>
  );
}
