"use client";
import React, { useState, useEffect, useMemo } from 'react';

// --- الأيقونات الهندسية ---
const GeneratorIcon = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 12V22H22V12L12 2Z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 17V20M12 17V20M17 17V20" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="2" stroke="#60a5fa" strokeWidth="1.5"/>
  </svg>
);

const GasIcon = () => (
  <svg className="w-6 h-6 text-emerald-400 mb-1" viewBox="0 0 24 24" fill="currentColor"><path d="M18.8 14.5C18.8 17 16.8 19 14.2 19C11.6 19 9.6 17 9.6 14.5C9.6 11.8 12.8 8.1 13.7 7.1C14 6.8 14.4 6.8 14.7 7.1C15.6 8.1 18.8 11.8 18.8 14.5ZM7.7 7.7L7.7 20L19.2 20C19.8 20 20.2 19.6 20.2 19L20.2 9C20.2 8.4 19.8 8 19.2 8H8V7.7ZM6.7 6.7V2H3.7V6.7H6.7ZM5.2 21.7C6 21.7 6.7 21 6.7 20.2V7.7H3.7V20.2C3.7 21 4.4 21.7 5.2 21.7Z"/></svg>
);

const BoltIcon = () => (
  <svg className="w-6 h-6 text-yellow-400 mb-1" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14H11V21L20 10H13Z"/></svg>
);

export default function RakbaUltraV3() {
  const [mounted, setMounted] = useState(false);
  const [stockBefore, setStockBefore] = useState('26820'); 
  const [fuelRows, setFuelRows] = useState([
    { id: 1, name: 'CAT 1', yest: '', today: '' },
    { id: 2, name: 'CAT 2', yest: '', today: '' },
    { id: 3, name: 'CAT 3', yest: '', today: '' },
  ]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('rakba_ultra_final_fix');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if(parsed.s) setStockBefore(parsed.s);
        if(parsed.fr) setFuelRows(parsed.fr);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('rakba_ultra_final_fix', JSON.stringify({ s: stockBefore, fr: fuelRows }));
  }, [stockBefore, fuelRows, mounted]);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    return { fDiffs, totalFuel, current: (Number(stockBefore) || 0) - totalFuel };
  }, [stockBefore, fuelRows]);

  const handleMigration = () => {
    if (window.confirm("هل تريد ترحيل البيانات لليوم الجديد؟")) {
      const updated = fuelRows.map(r => ({ ...r, yest: r.today, today: '' }));
      setFuelRows(updated);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#05060a] text-white p-4 font-sans overflow-x-hidden" dir="rtl">
      <style jsx global>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 2.5rem; }
        .neo-input { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; transition: 0.3s; }
        .neo-input:focus { border-color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); outline: none; }
      `}</style>

      <div className="max-w-[460px] mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <header className="flex justify-between items-center px-2">
          <div>
            <h1 className="text-3xl font-black italic text-blue-500 tracking-tighter">رُكبة <span className="text-white">PRO</span></h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Industrial Dashboard</p>
          </div>
          <button 
            onClick={handleMigration} 
            className="bg-blue-600 shadow-lg shadow-blue-900/40 text-[10px] px-6 py-2.5 rounded-2xl font-black active:scale-90 transition-all"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* الكارت الرئيسي */}
        <div className="glass p-8 shadow-2xl relative overflow-hidden text-center border-t-2 border-white/10">
          <p className="text-[10px] font-black text-slate-400 mb-2 tracking-[0.3em]">المتبقي في الخزان (لتر)</p>
          <div className="text-7xl font-black text-white mb-6 tracking-tighter tabular-nums drop-shadow-xl">
            {stats.current.toLocaleString()}
          </div>
          <div className="relative max-w-[280px] mx-auto">
            <span className="absolute -top-2 right-4 bg-[#05060a] px-2 text-[8px] text-blue-500 font-bold">الخزين الكلي قبل الصرف</span>
            <input 
              type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)}
              className="w-full neo-input p-4 text-center text-2xl font-bold text-blue-300"
            />
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-5 flex flex-col items-center border-r-4 border-emerald-500 shadow-xl">
            <GasIcon />
            <p className="text-[9px] text-emerald-500 font-bold mb-1 uppercase tracking-widest">إجمالي الصرف</p>
            <p className="text-3xl font-black tabular-nums text-emerald-400">{stats.totalFuel.toLocaleString()}</p>
          </div>
          <div className="glass p-5 flex flex-col items-center border-r-4 border-yellow-500 shadow-xl opacity-80">
            <BoltIcon />
            <p className="text-[9px] text-yellow-500 font-bold mb-1 uppercase tracking-widest">الطاقة المستهلكة</p>
            <p className="text-3xl font-black tabular-nums text-yellow-400">0</p>
          </div>
        </div>

        {/* الجداول */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xs font-black text-slate-500 px-3 uppercase tracking-[0.4em] flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> عدادات الاستهلاك
          </h2>
          
          {fuelRows.map((row, i) => (
            <div key={row.id} className="glass p-5 flex items-center gap-4 hover:bg-white/5 transition-all group">
              <div className="flex flex-col items-center gap-1 border-l border-white/5 pl-4 w-16">
                <GeneratorIcon />
                <span className="text-[10px] font-black text-blue-400 italic tracking-tighter">{row.name}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 text-right">
                  <label className="text-[8px] text-slate-600 pr-1">أمس</label>
                  <input 
                    type="number" value={row.yest} 
                    onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} 
                    className="neo-input p-3 text-xs text-slate-400 font-bold" 
                  />
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <label className="text-[8px] text-emerald-500 pr-1">اليوم</label>
                  <input 
                    type="number" value={row.today} 
                    onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} 
                    className="neo-input p-3 text-xs font-black text-white" 
                  />
                </div>
              </div>

              <div className="w-14 text-center border-r border-white/5 pr-4 group-hover:border-emerald-500/30 transition-all">
                <span className="text-[8px] text-emerald-500 font-bold uppercase block mb-1 tracking-tighter">الفرق</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">{stats.fDiffs[i].toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center pt-8 opacity-20 text-[8px] font-bold tracking-[1em] uppercase">Security Level: Enterprise</footer>
      </div>
    </div>
  );
}
