"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorStablePro3D() {
  const [mounted, setMounted] = useState(false);
  const [fuelRows, setFuelRows] = useState([
    { name: 'CAT 1', yesterday: '', today: '' },
    { name: 'CAT 2', yesterday: '', today: '' },
    { name: 'CAT 3', yesterday: '', today: '' },
  ]);
  const [kwRows, setKwRows] = useState([
    { name: 'CAT 1', yesterday: '', today: '' },
    { name: 'CAT 2', yesterday: '', today: '' },
    { name: 'CAT 3', yesterday: '', today: '' },
  ]);
  const [initialStock, setInitialStock] = useState('');

  useEffect(() => {
    setMounted(true);
    try {
      const savedFuel = localStorage.getItem('fuel_stable_v1');
      const savedKW = localStorage.getItem('kw_stable_v1');
      const savedStock = localStorage.getItem('stock_stable_v1');
      if (savedFuel) setFuelRows(JSON.parse(savedFuel));
      if (savedKW) setKwRows(JSON.parse(savedKW));
      if (savedStock) setInitialStock(savedStock);
    } catch (e) { console.error("Error loading data", e); }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuel_stable_v1', JSON.stringify(fuelRows));
      localStorage.setItem('kw_stable_v1', JSON.stringify(kwRows));
      localStorage.setItem('stock_stable_v1', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const updateValue = (type: 'fuel' | 'kw', index: number, field: 'yesterday' | 'today', val: string) => {
    const data = type === 'fuel' ? [...fuelRows] : [...kwRows];
    data[index][field] = val;
    type === 'fuel' ? setFuelRows(data) : setKwRows(data);
  };

  const totals = useMemo(() => {
    const fSums = fuelRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const kSums = kwRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const totalF = fSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const totalK = kSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const stockNum = parseFloat(initialStock) || 0;
    const remaining = stockNum - totalF;
    
    return { 
      fSums, 
      kSums, 
      totalF: totalF || 0, 
      totalK: totalK || 0, 
      remaining: remaining || 0 
    };
  }, [fuelRows, kwRows, initialStock]);

  if (!mounted) return null;

  const safeFormat = (num: number) => {
    return (num || 0).toLocaleString('en-US');
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-200 p-4 font-sans overflow-x-hidden selection:bg-blue-500/30" dir="rtl">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 space-y-6">
        
        {/* Header */}
        <header className="glass-card p-6 rounded-[2.5rem] flex justify-between items-center shadow-3d border border-white/5">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic">نظام المولدات Pro</h1>
            <p className="text-[9px] text-slate-600 font-bold tracking-widest mt-1 uppercase">Operational Dashboard</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات للغد؟") && (
              setInitialStock(totals.remaining.toString()),
              setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' }))),
              setKwRows(kwRows.map(r => ({ ...r, yesterday: r.today, today: '' })))
            )}
            className="bg-[#0f1117] border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black shadow-3d active:scale-95 transition-transform"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* Fuel Section */}
        <section className="glass-card rounded-[2.5rem] p-5 shadow-3d border border-blue-500/10 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
            <h2 className="text-sm font-black text-blue-300 uppercase tracking-tighter">قراءات الوقود (Ltr)</h2>
          </div>
          {fuelRows.map((row, idx) => (
            <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3 shadow-inner-3d transition-all hover:bg-black/60">
              <span className="w-12 font-black text-[10px] text-slate-500 italic">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-glass" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-glass-active" placeholder="اليوم" />
              <div className="w-14 text-center font-black text-emerald-400 text-lg">{totals.fSums[idx] > 0 ? safeFormat(totals.fSums[idx]) : 0}</div>
            </div>
          ))}
          <div className="p-4 bg-blue-500/5 rounded-2xl border-t border-blue-500/10 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">إجمالي الصرف</span>
            <span className="text-2xl font-black text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{safeFormat(totals.totalF)}</span>
          </div>
        </section>

        {/* KW Section */}
        <section className="glass-card rounded-[2.5rem] p-5 shadow-3d border border-cyan-500/10 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-5 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></span>
            <h2 className="text-sm font-black text-cyan-300 uppercase tracking-tighter">إنتاج الطاقة (kW)</h2>
          </div>
          {kwRows.map((row, idx) => (
            <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3 shadow-inner-3d transition-all hover:bg-black/60">
              <span className="w-12 font-black text-[10px] text-slate-500 italic">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-glass" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-glass-active border-cyan-500/30 text-cyan-100" placeholder="اليوم" />
              <div className="w-14 text-center font-black text-cyan-400 text-lg">{totals.kSums[idx] > 0 ? safeFormat(totals.kSums[idx]) : 0}</div>
            </div>
          ))}
          <div className="p-4 bg-cyan-500/5 rounded-2xl border-t border-cyan-500/10 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">إجمالي الطاقة</span>
            <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">{safeFormat(totals.totalK)}</span>
          </div>
        </section>

        {/* Main Stock (The 3D Hero) */}
        <div className="glass-card p-8 rounded-[3rem] shadow-3d border border-white/5 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">الخزين الاحتياطي الكلي</label>
          <input 
            type="number" 
            value={initialStock} 
            onChange={(e)=>setInitialStock(e.target.value)} 
            className="w-full bg-black/40 border-2 border-white/5 p-4 rounded-2xl text-4xl font-black text-blue-400 text-center outline-none focus:border-blue-500/40 shadow-inner-3d transition-all"
            placeholder="0"
          />

          <div className="mt-8 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">صافي الوقود المتبقي</p>
            <p className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">
              {safeFormat(totals.remaining)}
              <span className="text-xs font-normal text-cyan-500 ml-2 italic underline decoration-cyan-900 underline-offset-4">Ltr</span>
            </p>
          </div>

          <div className="w-full h-1.5 bg-black/50 rounded-full mt-6 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_10px_#3b82f6] transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, (totals.remaining / 10000) * 100))}%` }}
            ></div>
          </div>
        </div>

        <footer className="text-center py-6 text-slate-800 text-[8px] font-bold tracking-[0.5em] uppercase">
          Autonomous Power Management System • 2026
        </footer>
      </div>

      <style jsx global>{`
        .glass-card { background: rgba(15, 17, 23, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .shadow-3d { box-shadow: 20px 20px 50px rgba(0,0,0,0.5), -5px -5px 15px rgba(255,255,255,0.01); }
        .shadow-inner-3d { box-shadow: inset 4px 4px 12px rgba(0,0,0,0.8), inset -2px -2px 6px rgba(255,255,255,0.01); }
        
        .input-glass { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.03); border-radius: 12px; padding: 10px; text-align: center; font-weight: 700; color: #475569; font-size: 14px; outline: none; }
        .input-glass-active { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(59,130,246,0.2); border-radius: 12px; padding: 10px; text-align: center; font-weight: 900; color: #fff; font-size: 14px; outline: none; transition: all 0.3s; }
        .input-glass-active:focus { border-color: rgba(59,130,246,0.5); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.1); }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #08090c; margin: 0; }
      `}</style>
    </div>
  );
}
