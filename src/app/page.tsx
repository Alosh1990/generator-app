"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaBlackGlass() {
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
    const saved = localStorage.getItem('rakba_black_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.s) setStockBefore(parsed.s);
      if(parsed.fr) setFuelRows(parsed.fr);
      if(parsed.kr) setKwRows(parsed.kr);
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('rakba_black_v3', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-[#020205] text-white p-4 relative overflow-hidden font-sans antialiased" dir="rtl">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 rounded-full blur-[100px] animate-bounce duration-[12s]"></div>
      </div>

      <style jsx global>{`
        /* تأثير الزجاج الأسود العميق */
        .black-glass {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }

        /* الحقول الزجاجية السوداء */
        input {
          background: rgba(10, 10, 15, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 14px !important;
          padding: 12px !important;
          color: #fff !important;
          text-align: center !important;
          font-weight: 700 !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5) !important;
          transition: all 0.3s ease !important;
        }

        input:focus {
          border-color: #3b82f6 !important;
          background: rgba(0, 0, 0, 1) !important;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(0,0,0,0.8) !important;
          outline: none !important;
        }

        .neon-text-blue { text-shadow: 0 0 15px rgba(59, 130, 246, 0.6); color: #60a5fa; }
        .neon-text-emerald { text-shadow: 0 0 15px rgba(16, 185, 129, 0.6); color: #34d399; }
        .neon-text-yellow { text-shadow: 0 0 15px rgba(245, 158, 11, 0.6); color: #fbbf24; }
      `}</style>

      <div className="max-w-[480px] mx-auto relative z-10 space-y-6 pb-16">
        
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white">رُكبة <span className="text-blue-500">PRO</span></h1>
            <p className="text-[10px] font-bold text-slate-600 tracking-[0.4em] uppercase">Black Edition v4.5</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات لليوم الجديد؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''}))))}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all active:scale-95"
          >
            MIGRATE ⏭️
          </button>
        </header>

        {/* الكارت الرئيسي (المتبقي) */}
        <div className="black-glass p-10 text-center relative border-t border-white/10">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">المتبقي الصافي (لتر)</p>
          <div className="text-8xl font-black tabular-nums neon-text-blue mb-10 tracking-tighter">
            {stats.current.toLocaleString()}
          </div>
          <div className="relative max-w-[220px] mx-auto">
            <span className="absolute -top-2 right-4 bg-[#020205] px-2 text-[9px] text-blue-500 font-bold uppercase z-20 tracking-tighter">الخزين الكلي</span>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} className="w-full text-2xl" />
          </div>
        </div>

        {/* ملخص الإجماليات */}
        <div className="grid grid-cols-2 gap-4">
          <div className="black-glass p-6 text-center border-r-2 border-emerald-500/50">
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">إجمالي الصرف</p>
            <p className="text-4xl font-black neon-text-emerald tabular-nums">{stats.totalFuel}</p>
          </div>
          <div className="black-glass p-6 text-center border-r-2 border-yellow-500/50">
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">إجمالي الـ KW</p>
            <p className="text-4xl font-black neon-text-yellow tabular-nums">{stats.totalKW}</p>
          </div>
        </div>

        {/* الجداول */}
        <div className="space-y-10">
          
          {/* قسم الكاز */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <span className="h-[1px] flex-1 bg-white/5"></span>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">محاسبة الوقود</h2>
              <span className="h-[1px] flex-1 bg-white/5"></span>
            </div>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="black-glass p-5 flex items-center gap-4 group hover:bg-white/[0.02]">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-black text-blue-500 italic shadow-inner">
                  {row.name.split(' ')[1]}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="text-xs opacity-50" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="text-xs border-emerald-500/20" />
                </div>
                <div className="w-16 text-center border-r border-white/5 pr-4">
                  <span className="text-[9px] font-bold text-emerald-500 block mb-1">الفرق</span>
                  <span className="text-2xl font-black neon-text-emerald tabular-nums">{stats.fDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* قسم الكهرباء */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <span className="h-[1px] flex-1 bg-white/5"></span>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">إنتاج الطاقة</h2>
              <span className="h-[1px] flex-1 bg-white/5"></span>
            </div>
            {kwRows.map((row, i) => (
              <div key={row.id} className="black-glass p-5 flex items-center gap-4 group hover:bg-white/[0.02]">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-black text-yellow-500 italic shadow-inner">
                  KW
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} className="text-xs opacity-50" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} className="text-xs border-blue-500/20" />
                </div>
                <div className="w-16 text-center border-r border-white/5 pr-4">
                  <span className="text-[9px] font-bold text-blue-400 block mb-1">الصافي</span>
                  <span className="text-2xl font-black neon-text-blue tabular-nums">{stats.kDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center py-8 opacity-20 text-[8px] font-black tracking-[1.5em] uppercase">Rakba Intelligence 2026</footer>
      </div>
    </div>
  );
}
