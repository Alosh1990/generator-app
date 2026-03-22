"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaProductionV2() {
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
    // تم تغيير مفتاح التخزين لضمان تحديث البيانات عند المستخدم
    const saved = localStorage.getItem('rakba_v3_final');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStockBefore(parsed.s || '26820');
      setFuelRows(parsed.fr || fuelRows);
      setKwRows(parsed.kr || kwRows);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v3_final', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-[#050608] text-white p-2 flex justify-center font-sans overflow-x-hidden" dir="rtl">
      <style jsx global>{`
        /* منع مشاكل الموبايل */
        input { font-size: 16px !important; background: #111 !important; border: 1px solid #333 !important; border-radius: 10px !important; padding: 6px !important; color: white !important; text-align: center !important; width: 100% !important; }
        input:focus { border-color: #3b82f6 !important; outline: none; }
        .glass { background: rgba(17, 20, 28, 0.95); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 15px; }
      `}</style>

      <div className="w-full max-w-md space-y-3">
        
        {/* الخزين المتبقي - كبير وواضح */}
        <div className="glass text-center border-b-4 border-blue-600 shadow-2xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">الخزين المتبقي حالياً</p>
          <h2 className="text-6xl font-black text-cyan-400 tabular-nums my-1">{stats.currentStock.toLocaleString()}</h2>
          <div className="mt-4 space-y-1">
            <span className="text-[10px] text-blue-500 font-bold">الخزين الكلي قبل الصرف</span>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} />
          </div>
        </div>

        {/* التوتل - بجانب بعضهم */}
        <div className="grid grid-cols-2 gap-2">
          <div className="glass border-r-4 border-emerald-500 text-center">
            <p className="text-[9px] text-emerald-500 font-bold">مجموع الكاز</p>
            <p className="text-2xl font-black text-emerald-400 tabular-nums">{stats.totalFuel}</p>
          </div>
          <div className="glass border-r-4 border-yellow-500 text-center">
            <p className="text-[9px] text-yellow-500 font-bold">مجموع الـ KW</p>
            <p className="text-2xl font-black text-yellow-400 tabular-nums">{stats.totalKW}</p>
          </div>
        </div>

        {/* الجداول - تصميم سطر واحد للموبايل */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-gray-500 mr-2 uppercase tracking-widest">⛽ استهلاك الكاز</h3>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass flex items-center gap-2 py-2 px-3">
                <span className="text-[10px] font-bold w-12 text-blue-400">{row.name}</span>
                <div className="flex-1"><input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} /></div>
                <div className="flex-1"><input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} /></div>
                <span className="text-emerald-400 font-black w-10 text-center text-lg">{stats.fDiffs[i]}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-gray-500 mr-2 uppercase tracking-widest">⚡ إنتاج الكيلو واط</h3>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass flex items-center gap-2 py-2 px-3">
                <span className="text-[10px] font-bold w-12 text-yellow-500">{row.name}</span>
                <div className="flex-1"><input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} /></div>
                <div className="flex-1"><input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} /></div>
                <span className="text-yellow-400 font-black w-10 text-center text-lg">{stats.kDiffs[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => confirm("ترحيل البيانات لليوم الجديد؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''})))}
          className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-900/20 active:scale-95 transition-all mt-4"
        >
          ترحيل البيانات ⏭️
        </button>

      </div>
    </div>
  );
}
