"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function MobileOptimizer() {
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
    const saved = localStorage.getItem('rakba_v5_prod');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStockBefore(parsed.s || '26820');
      setFuelRows(parsed.fr || fuelRows);
      setKwRows(parsed.kr || kwRows);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v5_prod', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-[#050608] text-white p-2 font-sans" dir="rtl">
      <style jsx global>{`
        input { font-size: 16px !important; background: #111 !important; border: 1px solid #333 !important; border-radius: 8px !important; color: white !important; text-align: center !important; width: 100% !important; padding: 6px 0 !important; }
        .glass { background: rgba(20, 25, 35, 0.95); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 15px; margin-bottom: 12px; }
      `}</style>

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="text-xl font-black text-blue-500 italic">رُكبة PRO</h1>
          <button onClick={() => confirm("ترحيل؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''})))} className="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold">ترحيل</button>
        </div>

        {/* الكارت الرئيسي */}
        <div className="glass text-center border-b-4 border-blue-500 shadow-xl">
          <p className="text-[10px] text-gray-400 mb-1">الخزين المتبقي</p>
          <h2 className="text-5xl font-black text-cyan-400 tabular-nums mb-4">{stats.currentStock.toLocaleString()}</h2>
          <div className="px-6">
            <p className="text-[9px] text-blue-500 mb-1">الخزين الكلي قبل الصرف</p>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} />
          </div>
        </div>

        {/* الإجماليات */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="glass !mb-0 border-r-4 border-emerald-500 text-center">
            <p className="text-[9px] text-emerald-500 font-bold uppercase">مجموع الكاز</p>
            <p className="text-2xl font-black text-emerald-400">{stats.totalFuel}</p>
          </div>
          <div className="glass !mb-0 border-r-4 border-yellow-500 text-center">
            <p className="text-[9px] text-yellow-500 font-bold uppercase">مجموع الـ KW</p>
            <p className="text-2xl font-black text-yellow-400">{stats.totalKW}</p>
          </div>
        </div>

        {/* جداول البيانات - تصميم مضغوط جداً للموبايل */}
        <div className="space-y-4 mt-4">
          <h3 className="text-[10px] font-bold text-gray-500 mr-2 uppercase tracking-widest">⛽ عدادات الكاز</h3>
          {fuelRows.map((row, i) => (
            <div key={row.id} className="glass !mb-2 flex items-center gap-2 py-2 px-3">
              <span className="text-[10px] font-bold w-12 text-blue-400 italic">{row.name}</span>
              <div className="flex-1"><input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} /></div>
              <div className="flex-1"><input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} /></div>
              <span className="text-emerald-400 font-black w-10 text-center text-lg">{stats.fDiffs[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
