"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaApp() {
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
    const saved = localStorage.getItem('rakba_v_final_check');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.s) setStockBefore(parsed.s);
      if(parsed.fr) setFuelRows(parsed.fr);
      if(parsed.kr) setKwRows(parsed.kr);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v_final_check', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-3 font-sans" dir="rtl">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* المتبقي */}
        <div className="bg-[#111] border border-blue-900/30 p-6 rounded-[2rem] text-center shadow-xl">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">الخزين المتبقي</p>
          <h2 className="text-6xl font-black text-blue-400 mb-4">{stats.current.toLocaleString()}</h2>
          <div className="bg-black/50 p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-blue-500 block mb-1">الخزين قبل الصرف</span>
            <input 
              type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} 
              className="w-full bg-transparent text-center text-xl font-bold outline-none"
            />
          </div>
        </div>

        {/* الإجماليات */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-[#111] p-4 rounded-2xl border-r-4 border-emerald-500 shadow-lg">
            <p className="text-[9px] text-emerald-500 font-bold">إجمالي الكاز</p>
            <p className="text-2xl font-black">{stats.totalFuel}</p>
          </div>
          <div className="bg-[#111] p-4 rounded-2xl border-r-4 border-yellow-500 shadow-lg">
            <p className="text-[9px] text-yellow-500 font-bold">إجمالي الـ KW</p>
            <p className="text-2xl font-black">{stats.totalKW}</p>
          </div>
        </div>

        {/* العدادات */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-600 px-2 uppercase tracking-widest">⛽ عدادات الكاز</p>
          {fuelRows.map((row, i) => (
            <div key={row.id} className="bg-[#111] p-3 rounded-2xl flex items-center gap-2 border border-white/5">
              <span className="text-[10px] font-bold w-12 text-gray-400">{row.name}</span>
              <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="flex-1 bg-black/50 rounded-lg p-2 text-center text-sm outline-none border border-white/5" />
              <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="flex-1 bg-black rounded-lg p-2 text-center text-sm font-bold outline-none border border-blue-500/20" />
              <span className="text-emerald-400 font-bold w-10 text-center">{stats.fDiffs[i]}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => confirm("ترحيل؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''})))}
          className="w-full bg-blue-600 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
        >
          ترحيل البيانات ⏭️
        </button>

      </div>
    </div>
  );
}
