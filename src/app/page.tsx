"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaFinalSystem() {
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
    const saved = localStorage.getItem('rakba_v_final_stable');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.s) setStockBefore(parsed.s);
      if(parsed.fr) setFuelRows(parsed.fr);
      if(parsed.kr) setKwRows(parsed.kr);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v_final_stable', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-[#0a0b10] text-white p-3 font-sans selection:bg-blue-500/30" dir="rtl">
      <style jsx global>{`
        input { font-size: 16px !important; background: rgba(0,0,0,0.3) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px !important; color: white !important; text-align: center !important; width: 100% !important; padding: 8px 0 !important; outline: none !important; }
        input:focus { border-color: #3b82f6 !important; background: rgba(0,0,0,0.5) !important; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 15px; }
      `}</style>

      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center px-2">
          <h1 className="text-2xl font-black italic text-blue-500">رُكبة PRO</h1>
          <button 
            onClick={() => confirm("ترحيل؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''}))))}
            className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-bold shadow-lg active:scale-95 transition-all"
          >
            ترحيل البيانات ⏭️
          </button>
        </div>

        {/* الكارت الزجاجي للمتبقي */}
        <div className="glass text-center border-t border-white/10 shadow-2xl">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">الخزين المتبقي (L)</p>
          <h2 className="text-6xl font-black text-blue-400 tabular-nums my-2 tracking-tighter">
            {stats.current.toLocaleString()}
          </h2>
          <div className="mt-4 px-4">
            <p className="text-[9px] text-blue-500 font-bold mb-1">الخزين قبل الصرف</p>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} />
          </div>
        </div>

        {/* الإجماليات */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass border-r-4 border-emerald-500 text-center">
            <p className="text-[9px] text-emerald-500 font-bold uppercase mb-1">مجموع الكاز</p>
            <p className="text-2xl font-black text-emerald-400 tabular-nums">{stats.totalFuel}</p>
          </div>
          <div className="glass border-r-4 border-yellow-500 text-center">
            <p className="text-[9px] text-yellow-500 font-bold uppercase mb-1">مجموع الـ KW</p>
            <p className="text-2xl font-black text-yellow-400 tabular-nums">{stats.totalKW}</p>
          </div>
        </div>

        {/* جداول العدادات */}
        <div className="space-y-6">
          {/* جدول الكاز */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-500 px-2 uppercase tracking-widest italic">⛽ عدادات الكاز</h3>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass flex items-center gap-2 py-2 px-3 hover:bg-white/5 transition-all">
                <span className="text-[10px] font-bold w-12 text-blue-400">{row.name}</span>
                <div className="flex-1"><input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} /></div>
                <div className="flex-1"><input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} /></div>
                <span className="text-emerald-400 font-black w-12 text-center text-xl tabular-nums">{stats.fDiffs[i]}</span>
              </div>
            ))}
          </div>

          {/* جدول الكهرباء */}
          <div className="space-y-3 pb-6">
            <h3 className="text-[10px] font-black text-gray-500 px-2 uppercase tracking-widest italic">⚡ إنتاج الكيلو واط</h3>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass flex items-center gap-2 py-2 px-3 hover:bg-white/5 transition-all">
                <span className="text-[10px] font-bold w-12 text-yellow-500">{row.name}</span>
                <div className="flex-1"><input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} /></div>
                <div className="flex-1"><input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} /></div>
                <span className="text-yellow-400 font-black w-12 text-center text-xl tabular-nums">{stats.kDiffs[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
