"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaSystem() {
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
    const saved = localStorage.getItem('rakba_v_100');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.s) setStockBefore(parsed.s);
        if (parsed.fr) setFuelRows(parsed.fr);
        if (parsed.kr) setKwRows(parsed.kr);
      } catch (e) {
        console.error("Error loading data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v_100', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-blue-500" dir="rtl">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* بطاقة الخزين الرئيسية */}
        <div className="bg-[#111] border border-blue-900/20 p-6 rounded-[2.5rem] text-center shadow-2xl">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">الخزين المتبقي (L)</p>
          <h2 className="text-7xl font-black text-blue-400 tabular-nums my-2 tracking-tighter">
            {stats.current.toLocaleString()}
          </h2>
          <div className="mt-6">
            <span className="text-[10px] text-blue-500 font-black block mb-2 uppercase italic">الخزين الكلي قبل الصرف</span>
            <input 
              type="number" 
              value={stockBefore} 
              onChange={(e) => setStockBefore(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-center text-2xl font-bold focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* الإجماليات */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111] p-4 rounded-3xl border-r-4 border-emerald-500">
            <p className="text-[9px] text-emerald-500 font-bold uppercase mb-1">إجمالي الكاز</p>
            <p className="text-2xl font-black tabular-nums">{stats.totalFuel.toLocaleString()}</p>
          </div>
          <div className="bg-[#111] p-4 rounded-3xl border-r-4 border-yellow-500">
            <p className="text-[9px] text-yellow-500 font-bold uppercase mb-1">إجمالي الـ KW</p>
            <p className="text-2xl font-black tabular-nums">{stats.totalKW.toLocaleString()}</p>
          </div>
        </div>

        {/* جداول المولدات */}
        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-black text-gray-600 px-2 uppercase tracking-[0.2em]">⛽ عدادات الاستهلاك اليومي</p>
          {fuelRows.map((row, i) => (
            <div key={row.id} className="bg-[#111] p-3 rounded-2xl flex items-center gap-2 border border-white/5">
              <span className="text-[10px] font-black w-10 text-gray-500 italic">{row.name}</span>
              <input 
                type="number" 
                placeholder="أمس" 
                value={row.yest} 
                onChange={(e) => { const n = [...fuelRows]; n[i].yest = e.target.value; setFuelRows(n); }} 
                className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 text-center text-sm outline-none" 
              />
              <input 
                type="number" 
                placeholder="اليوم" 
                value={row.today} 
                onChange={(e) => { const n = [...fuelRows]; n[i].today = e.target.value; setFuelRows(n); }} 
                className="flex-1 bg-black border border-blue-500/20 rounded-xl p-3 text-center text-sm font-bold outline-none" 
              />
              <span className="text-emerald-400 font-black w-12 text-center text-xl tabular-nums">{stats.fDiffs[i]}</span>
            </div>
          ))}
        </div>

        {/* زر الترحيل */}
        <button 
          onClick={() => {
            if(window.confirm("هل تريد ترحيل القراءات لليوم الجديد؟")) {
              setFuelRows(fuelRows.map(r => ({ ...r, yest: r.today, today: '' })));
              setKwRows(kwRows.map(r => ({ ...r, yest: r.today, today: '' })));
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all mt-6 border-b-4 border-blue-800"
        >
          ترحيل البيانات ليوم جديد ⏭️
        </button>

      </div>
    </div>
  );
}
