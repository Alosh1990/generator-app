"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaLivingParallax() {
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
    const saved = localStorage.getItem('rakba_parallax_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.s) setStockBefore(parsed.s);
      if(parsed.fr) setFuelRows(parsed.fr);
      if(parsed.kr) setKwRows(parsed.kr);
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('rakba_parallax_v1', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
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
    <div className="min-h-screen bg-[#020408] text-white p-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* خلفية البارالاكس المتحركة (Parallax Background Shapes) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-bounce duration-[10s]"></div>

      <style jsx global>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-panel:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px -12px rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }
        input {
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 10px !important;
          color: white !important;
          text-align: center !important;
          transition: all 0.3s ease !important;
        }
        input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4) !important;
          background: rgba(0, 0, 0, 0.6) !important;
          outline: none !important;
        }
        .neon-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>

      <div className="max-w-[500px] mx-auto relative z-10 space-y-6 pb-12">
        
        {/* Header - مستوحى من Living Parallax */}
        <header className="flex justify-between items-center py-4 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-black tracking-tighter neon-text uppercase italic">
              <span className="text-blue-500">Rakba</span> <span className="text-white">PRO</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase">Enterprise Analytics</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''}))))}
            className="bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-xl active:scale-90 transition-all hover:brightness-110"
          >
            MIGRATE ⏭️
          </button>
        </header>

        {/* الكارت الرئيسي (Living Card) */}
        <section className="glass-panel p-8 rounded-[2.5rem] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Remaining Fuel</p>
          <div className="text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl mb-6">
            {stats.current.toLocaleString()}
          </div>
          <div className="max-w-[200px] mx-auto">
            <label className="text-[9px] font-bold text-blue-400 block mb-1 uppercase">Initial Stock</label>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} className="w-full text-xl font-bold" />
          </div>
        </section>

        {/* إحصائيات ملونة (Visual Metrics) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-[2rem] border-r-4 border-emerald-500">
             <div className="text-emerald-500 text-[10px] font-black uppercase mb-1 tracking-tighter">Total Fuel Spent</div>
             <div className="text-3xl font-black tabular-nums">{stats.totalFuel.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-5 rounded-[2rem] border-r-4 border-blue-500">
             <div className="text-blue-500 text-[10px] font-black uppercase mb-1 tracking-tighter">Total Power (KW)</div>
             <div className="text-3xl font-black tabular-nums">{stats.totalKW.toLocaleString()}</div>
          </div>
        </div>

        {/* جداول البيانات التفاعلية */}
        <div className="space-y-6">
          {/* قسم الكاز */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 px-3 uppercase tracking-[0.3em]">⛽ Fuel Consumption</h3>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass-panel p-4 rounded-3xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-black text-blue-400 italic text-xs border border-blue-500/20">{row.name.split(' ')[1]}</div>
                <div className="flex-1"><input type="number" placeholder="Yest" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} /></div>
                <div className="flex-1"><input type="number" placeholder="Today" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="border-emerald-500/30 !text-white font-bold" /></div>
                <div className="w-14 text-center font-black text-2xl text-emerald-400 tabular-nums">{stats.fDiffs[i]}</div>
              </div>
            ))}
          </div>

          {/* قسم الكهرباء */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 px-3 uppercase tracking-[0.3em]">⚡ Power Analytics</h3>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass-panel p-4 rounded-3xl flex items-center gap-3 border-yellow-500/10">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center font-black text-yellow-400 italic text-xs border border-yellow-500/20">{row.name.split(' ')[1]}</div>
                <div className="flex-1"><input type="number" placeholder="Yest" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} /></div>
                <div className="flex-1"><input type="number" placeholder="Today" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} /></div>
                <div className="w-14 text-center font-black text-2xl text-blue-400 tabular-nums">{stats.kDiffs[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center py-6 opacity-20 text-[8px] font-black tracking-[1.5em] uppercase">SYSTEM SECURED</footer>
      </div>
    </div>
  );
}
