"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaUltraProFixed() {
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
    const saved = localStorage.getItem('rakba_ultra_v16');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStockBefore(parsed.s || '');
      setFuelRows(parsed.fr || fuelRows);
      setKwRows(parsed.kr || kwRows);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_ultra_v16', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
    }
  }, [stockBefore, fuelRows, kwRows, mounted]);

  // --- الحسابات المصلحة لضمان عمل التوتل ---
  const stats = useMemo(() => {
    // حساب فروقات الكاز لكل مولدة
    const fDiffs = fuelRows.map(r => {
      const diff = (parseFloat(r.today) || 0) - (parseFloat(r.yest) || 0);
      return diff > 0 ? diff : 0;
    });

    // حساب فروقات الكيلو واط لكل مولدة
    const kDiffs = kwRows.map(r => {
      const diff = (parseFloat(r.today) || 0) - (parseFloat(r.yest) || 0);
      return diff > 0 ? diff : 0;
    });

    // المجموع الإجمالي (Total)
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);
    
    // الخزين المتبقي
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
    <div className="min-h-screen bg-[#050608] text-white p-4 flex justify-center font-sans selection:bg-blue-500/30 overflow-x-hidden" dir="rtl">
      <style jsx global>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-up { animation: slideUp 0.5s ease-out forwards; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .glass { background: rgba(13, 17, 23, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05); }
        .neo-input { transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1); background: black; }
        .neo-input:focus { border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
      `}</style>

      <div className="w-full max-w-[480px] space-y-6 pb-20">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/10 pb-4 animate-up">
          <div>
            <h1 className="text-4xl font-black text-blue-500 italic tracking-tighter">رُكبة <span className="text-white">PRO</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Industrial System v16</p>
          </div>
          <button onClick={handleMigrate} className="bg-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] shadow-lg active:scale-90 transition-all">ترحيل ⏭️</button>
        </header>

        {/* الكارت الرئيسي - المتبقي */}
        <div className="glass p-8 rounded-[3rem] shadow-2xl text-center animate-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">المتبقي حالياً في الخزان</p>
          <div className="text-8xl font-black text-blue-400 mb-8 tracking-tighter tabular-nums">
            {stats.currentStock.toLocaleString()}
          </div>
          <div className="relative pt-2">
            <label className="text-[9px] font-black text-blue-500 absolute -top-1 right-4 bg-[#0d1117] px-2 uppercase tracking-widest">الخزين قبل الصرف</label>
            <input 
              type="number" value={stockBefore} onChange={(e) => setStockBefore(e.target.value)}
              className="w-full neo-input p-5 rounded-2xl text-center text-2xl font-black text-white outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* جداول المحاسبة */}
        <div className="space-y-10 animate-up" style={{ animationDelay: '0.2s' }}>
          
          {/* الكاز */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-emerald-400 px-2 uppercase tracking-widest">⛽ جدول استهلاك الكاز</h2>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass p-4 rounded-[2rem] flex items-center gap-3">
                <span className="w-12 text-[10px] font-black text-slate-500 italic uppercase">{row.name}</span>
                <input type="number" placeholder="أمس" value={row.yest} onChange={(e) => { const n = [...fuelRows]; n[i].yest = e.target.value; setFuelRows(n); }} className="w-full neo-input p-3 rounded-xl text-center text-sm outline-none tabular-nums text-slate-400" />
                <input type="number" placeholder="يوم" value={row.today} onChange={(e) => { const n = [...fuelRows]; n[i].today = e.target.value; setFuelRows(n); }} className="w-full neo-input p-3 rounded-xl text-center text-sm font-black text-white outline-none tabular-nums" />
                <div className="w-20 text-center font-black text-emerald-400 text-2xl tabular-nums">{stats.fDiffs[i].toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* الكيلو واط */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-blue-400 px-2 uppercase tracking-widest">⚡ جدول الكيلو واط</h2>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass p-4 rounded-[2rem] flex items-center gap-3">
                <span className="w-12 text-[10px] font-black text-slate-500 italic uppercase">{row.name}</span>
                <input type="number" placeholder="أمس" value={row.yest} onChange={(e) => { const n = [...kwRows]; n[i].yest = e.target.value; setKwRows(n); }} className="w-full neo-input p-3 rounded-xl text-center text-sm outline-none tabular-nums text-slate-400" />
                <input type="number" placeholder="يوم" value={row.today} onChange={(e) => { const n = [...kwRows]; n[i].today = e.target.value; setKwRows(n); }} className="w-full neo-input p-3 rounded-xl text-center text-sm font-black text-white outline-none tabular-nums" />
                <div className="w-20 text-center font-black text-blue-400 text-2xl tabular-nums">{stats.kDiffs[i].toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ملخص الـ TOTAL (المصلح) */}
        <div className="glass rounded-[2.5rem] p-6 border-t-4 border-blue-500/30 animate-up shadow-2xl" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">الإحصائيات الإجمالية (TOTAL)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* توتل الكاز */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] text-center">
              <p className="text-[9px] font-bold text-emerald-500 uppercase mb-2">إجمالي صرف الكاز</p>
              <p className="text-4xl font-black text-emerald-400 tabular-nums">
                {stats.totalFuel.toLocaleString()}
                <span className="text-xs ml-1 opacity-50">L</span>
              </p>
            </div>

            {/* توتل الكيلو واط */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[2rem] text-center">
              <p className="text-[9px] font-bold text-blue-500 uppercase mb-2">إجمالي الكيلو واط</p>
              <p className="text-4xl font-black text-blue-400 tabular-nums">
                {stats.totalKW.toLocaleString()}
                <span className="text-xs ml-1 opacity-50">K</span>
              </p>
            </div>
          </div>

          <div className="mt-6 bg-black/40 p-4 rounded-2xl flex justify-between items-center px-6 border border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase italic">معدل الإنتاج</span>
            <span className="text-lg font-black text-white tabular-nums italic">
              {(stats.totalKW / (stats.totalFuel || 1)).toFixed(2)} <span className="text-[10px] text-blue-400">KW/L</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
