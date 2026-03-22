"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaMobileReady() {
  const [mounted, setMounted] = useState(false);
  const [stockBefore, setStockBefore] = useState(''); 
  
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
    const saved = localStorage.getItem('rakba_v16_mobile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStockBefore(parsed.s || '');
      setFuelRows(parsed.fr || fuelRows);
      setKwRows(parsed.kr || kwRows);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v16_mobile', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
    }
  }, [stockBefore, fuelRows, kwRows, mounted]);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (parseFloat(r.today) || 0) - (parseFloat(r.yest) || 0)));
    const kDiffs = kwRows.map(r => Math.max(0, (parseFloat(r.today) || 0) - (parseFloat(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);
    const currentStock = (parseFloat(stockBefore) || 0) - totalFuel;
    return { fDiffs, kDiffs, totalFuel, totalKW, currentStock };
  }, [stockBefore, fuelRows, kwRows]);

  const handleMigrate = () => {
    if (window.confirm("ترحيل البيانات لليوم الجديد؟")) {
      setFuelRows(fuelRows.map(r => ({ ...r, yest: r.today, today: '' })));
      setKwRows(kwRows.map(r => ({ ...r, yest: r.today, today: '' })));
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050608] text-white p-3 flex justify-center font-sans overflow-x-hidden" dir="rtl">
      <style jsx global>{`
        /* منع الزووم التلقائي في الآيفون والاندرويد */
        input { font-size: 16px !important; } 
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .glass { background: rgba(13, 17, 23, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.05); }
        .neo-input { background: #000; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
        .neo-input:focus { border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); outline: none; }
      `}</style>

      <div className="w-full max-w-[450px] space-y-4 pb-10">
        
        {/* Header */}
        <header className="flex justify-between items-center py-2 px-1 border-b border-white/5">
          <h1 className="text-2xl font-black text-blue-500 italic tracking-tighter">رُكبة <span className="text-white text-xl">PRO</span></h1>
          <button onClick={handleMigrate} className="bg-blue-600 active:scale-90 px-4 py-2 rounded-xl font-bold text-[10px] transition-all">ترحيل ⏭️</button>
        </header>

        {/* الكارت الرئيسي */}
        <div className="glass p-6 rounded-[2rem] shadow-2xl text-center">
          <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">المتبقي في الخزان</p>
          <div className="text-6xl font-black text-blue-400 tabular-nums tracking-tighter mb-4">
            {stats.currentStock.toLocaleString()}
          </div>
          <div className="relative">
            <label className="text-[8px] font-black text-blue-500 absolute -top-1.5 right-3 bg-[#0d1117] px-2 uppercase tracking-widest">الخزين الكلي قبل الصرف</label>
            <input 
              type="number" value={stockBefore} onChange={(e) => setStockBefore(e.target.value)}
              className="w-full neo-input p-3 rounded-xl text-center text-xl font-black text-white"
              placeholder="0"
            />
          </div>
        </div>

        {/* الجداول - تصميم عمودي للموبايل */}
        <div className="space-y-6">
          
          {/* الكاز */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-emerald-400 px-2 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> استهلاك الكاز
            </h2>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass p-3 rounded-2xl flex items-center gap-2 shadow-lg">
                <span className="w-10 text-[9px] font-black text-slate-500 italic uppercase leading-tight">{row.name}</span>
                <input type="number" placeholder="أمس" value={row.yest} onChange={(e) => { const n = [...fuelRows]; n[i].yest = e.target.value; setFuelRows(n); }} className="flex-1 neo-input p-2.5 rounded-lg text-center text-sm text-slate-400" />
                <input type="number" placeholder="اليوم" value={row.today} onChange={(e) => { const n = [...fuelRows]; n[i].today = e.target.value; setFuelRows(n); }} className="flex-1 neo-input p-2.5 rounded-lg text-center text-sm font-bold text-white shadow-inner" />
                <div className="w-12 text-center font-black text-emerald-400 text-lg tabular-nums">{stats.fDiffs[i].toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* الكيلو واط */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-blue-400 px-2 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> إنتاج الكيلو واط
            </h2>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass p-3 rounded-2xl flex items-center gap-2 shadow-lg">
                <span className="w-10 text-[9px] font-black text-slate-500 italic uppercase leading-tight">{row.name}</span>
                <input type="number" placeholder="أمس" value={row.yest} onChange={(e) => { const n = [...kwRows]; n[i].yest = e.target.value; setKwRows(n); }} className="flex-1 neo-input p-2.5 rounded-lg text-center text-sm text-slate-400" />
                <input type="number" placeholder="اليوم" value={row.today} onChange={(e) => { const n = [...kwRows]; n[i].today = e.target.value; setKwRows(n); }} className="flex-1 neo-input p-2.5 rounded-lg text-center text-sm font-bold text-white shadow-inner" />
                <div className="w-12 text-center font-black text-blue-400 text-lg tabular-nums">{stats.kDiffs[i].toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* التوتل النهائي */}
        <div className="glass rounded-[2rem] p-4 border-t-2 border-blue-500/20 shadow-2xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl text-center">
              <p className="text-[8px] font-bold text-emerald-500 uppercase">مجموع الكاز</p>
              <p className="text-xl font-black text-emerald-400 tabular-nums">{stats.totalFuel.toLocaleString()} <span className="text-[8px]">L</span></p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-2xl text-center">
              <p className="text-[8px] font-bold text-blue-500 uppercase">مجموع الـ KW</p>
              <p className="text-xl font-black text-blue-400 tabular-nums">{stats.totalKW.toLocaleString()} <span className="text-[8px]">K</span></p>
            </div>
          </div>
          <div className="mt-3 bg-white/5 p-2.5 rounded-xl flex justify-between items-center px-4">
            <span className="text-[9px] font-bold text-slate-500 uppercase">كفاءة المحرك</span>
            <span className="text-xs font-black text-blue-300 italic">
              {(stats.totalKW / (stats.totalFuel || 1)).toFixed(2)} KW/L
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
