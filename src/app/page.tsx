"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaFinalMobile() {
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
    const saved = localStorage.getItem('rakba_mobile_v17');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStockBefore(parsed.s || '');
      setFuelRows(parsed.fr || fuelRows);
      setKwRows(parsed.kr || kwRows);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_mobile_v17', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050608] text-white p-4 flex justify-center font-sans overflow-x-hidden" dir="rtl">
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        input { font-size: 16px !important; transition: all 0.2s; }
        input:focus { border-color: #3b82f6; box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); outline: none; }
        .glass { background: rgba(17, 20, 28, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
      `}</style>

      <div className="w-full max-w-md space-y-5 pb-10">
        
        {/* Header */}
        <header className="flex justify-between items-center py-2 animate-fade">
          <h1 className="text-2xl font-black text-blue-500 italic tracking-tighter">رُكبة <span className="text-white">PRO</span></h1>
          <button 
            onClick={() => confirm("ترحيل البيانات؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''})))}
            className="bg-blue-600 hover:bg-blue-500 text-[10px] px-4 py-2 rounded-xl font-bold transition-all active:scale-90"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* الكارت الرئيسي (الخزين الحالي) */}
        <div className="glass p-6 rounded-[2.5rem] text-center shadow-2xl animate-fade" style={{animationDelay: '0.1s'}}>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">الخزين الصافي حالياً</p>
          <div className="text-7xl font-black text-blue-400 tabular-nums mb-6 drop-shadow-lg">
            {stats.currentStock.toLocaleString()}
          </div>
          <div className="relative">
            <label className="absolute -top-2 right-3 bg-[#11141b] px-2 text-[8px] font-black text-blue-500 uppercase">قبل الصرف</label>
            <input 
              type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-center text-xl font-bold"
              placeholder="0"
            />
          </div>
        </div>

        {/* جداول البيانات */}
        <div className="space-y-6 animate-fade" style={{animationDelay: '0.2s'}}>
          {/* قسم الكاز */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-emerald-500 px-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> استهلاك الكاز
            </h2>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass p-3 rounded-2xl flex items-center gap-2">
                <span className="w-10 text-[9px] font-bold text-slate-400 uppercase italic">{row.name}</span>
                <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n);}} className="flex-1 bg-black/40 border border-white/5 p-2 rounded-xl text-center text-xs outline-none text-slate-400" />
                <input type="number" placeholder="يوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n);}} className="flex-1 bg-black border border-white/10 p-2 rounded-xl text-center text-xs font-bold outline-none" />
                <div className="w-14 text-center font-black text-emerald-400 text-xl tabular-nums">{stats.fDiffs[i]}</div>
              </div>
            ))}
          </div>

          {/* قسم الكيلو واط */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-blue-400 px-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> إنتاج الطاقة KW
            </h2>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass p-3 rounded-2xl flex items-center gap-2">
                <span className="w-10 text-[9px] font-bold text-slate-400 uppercase italic">{row.name}</span>
                <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n);}} className="flex-1 bg-black/40 border border-white/5 p-2 rounded-xl text-center text-xs outline-none text-slate-400" />
                <input type="number" placeholder="يوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n);}} className="flex-1 bg-black border border-white/10 p-2 rounded-xl text-center text-xs font-bold outline-none" />
                <div className="w-14 text-center font-black text-blue-400 text-xl tabular-nums">{stats.kDiffs[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* التوتل النهائي (Total) - ملون ومتحرك */}
        <div className="glass rounded-[2rem] p-5 grid grid-cols-2 gap-3 border-t-2 border-blue-500/30 shadow-2xl animate-fade" style={{animationDelay: '0.3s'}}>
           <div className="text-center bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
              <p className="text-[8px] font-black text-emerald-500 uppercase mb-1">إجمالي الكاز</p>
              <p className="text-2xl font-black text-emerald-400 tabular-nums">{stats.totalFuel.toLocaleString()}</p>
           </div>
           <div className="text-center bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
              <p className="text-[8px] font-black text-blue-500 uppercase mb-1">إجمالي الـ KW</p>
              <p className="text-2xl font-black text-blue-400 tabular-nums">{stats.totalKW.toLocaleString()}</p>
           </div>
           <div className="col-span-2 bg-white/5 p-3 rounded-xl flex justify-between items-center px-4">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">معدل الاستهلاك لليوم</span>
              <span className="text-sm font-black text-blue-300 italic">
                {(stats.totalKW / (stats.totalFuel || 1)).toFixed(2)} KW/L
              </span>
           </div>
        </div>

      </div>
    </div>
  );
}
