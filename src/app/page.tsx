"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorFullView3D() {
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
    const savedFuel = localStorage.getItem('fuel_v5');
    const savedKW = localStorage.getItem('kw_v5');
    const savedStock = localStorage.getItem('stock_v5');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuel_v5', JSON.stringify(fuelRows));
      localStorage.setItem('kw_v5', JSON.stringify(kwRows));
      localStorage.setItem('stock_v5', initialStock);
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
    const remaining = (parseFloat(initialStock) || 0) - totalF;
    return { fSums, kSums, totalF, totalK, remaining };
  }, [fuelRows, kwRows, initialStock]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white p-4 font-sans selection:bg-blue-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-blue-600/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-cyan-600/20 blur-[100px]"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 space-y-8 pb-10">
        
        {/* Header Section */}
        <header className="glass-card p-6 rounded-[2.5rem] flex justify-between items-center shadow-3d border border-white/10 mt-4">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic">نظام المولدات</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">PRO EDITION V5</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات للغد؟") && (
              setInitialStock(totals.remaining.toString()),
              setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' }))),
              setKwRows(kwRows.map(r => ({ ...r, yesterday: r.today, today: '' })))
            )}
            className="btn-3d-blue text-[10px] font-black px-4 py-2 rounded-xl"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* Fuel Table Section */}
        <section className="glass-card rounded-[2.5rem] p-5 shadow-3d border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
            <h2 className="text-sm font-black text-blue-400">عدادات الكاز (لتر)</h2>
          </div>
          {fuelRows.map((row, idx) => (
            <div key={idx} className="bg-black/40 p-4 rounded-2xl shadow-inner-3d border border-white/5 flex items-center gap-3">
              <span className="w-14 font-black text-xs text-slate-400 italic">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-field" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-field-active border-blue-500/30" placeholder="يوم" />
              <div className="w-14 text-center font-black text-emerald-400 text-lg">{totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}</div>
            </div>
          ))}
          <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex justify-between items-center mt-2">
            <span className="text-xs font-bold text-blue-200">إجمالي الصرف:</span>
            <span className="text-2xl font-black text-blue-400">{totals.totalF.toLocaleString()} <small className="text-[10px]">لتر</small></span>
          </div>
        </section>

        {/* KW Table Section */}
        <section className="glass-card rounded-[2.5rem] p-5 shadow-3d border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-5 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></span>
            <h2 className="text-sm font-black text-cyan-400">عدادات الطاقة (kW)</h2>
          </div>
          {kwRows.map((row, idx) => (
            <div key={idx} className="bg-black/40 p-4 rounded-2xl shadow-inner-3d border border-white/5 flex items-center gap-3">
              <span className="w-14 font-black text-xs text-slate-400 italic">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-field" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-field-active border-cyan-500/30 text-cyan-400" placeholder="يوم" />
              <div className="w-14 text-center font-black text-blue-400 text-lg">{totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}</div>
            </div>
          ))}
          <div className="p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 flex justify-between items-center mt-2">
            <span className="text-xs font-bold text-cyan-200">إجمالي الإنتاج:</span>
            <span className="text-2xl font-black text-cyan-400">{totals.totalKW.toLocaleString()} <small className="text-[10px]">kW</small></span>
          </div>
        </section>

        {/* Storage Section */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-[2.5rem] shadow-3d border border-white/5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">الخزين الكلي الحالي</label>
            <input 
              type="number" 
              value={initialStock} 
              onChange={(e)=>setInitialStock(e.target.value)} 
              className="w-full bg-black/50 border border-blue-500/20 p-4 rounded-2xl text-3xl font-black text-blue-400 outline-none shadow-inner-3d text-center focus:border-blue-500 transition-all"
              placeholder="0"
            />
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-3d flex justify-between items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div>
              <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">المتبقي الصافي</p>
              <p className="text-5xl font-black text-white tracking-tighter">{totals.remaining.toLocaleString()}</p>
            </div>
            <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="text-2xl">⛽</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .glass-card { background: rgba(20, 24, 32, 0.8); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
        .shadow-3d { box-shadow: 20px 20px 40px #050608, -5px -5px 15px rgba(255,255,255,0.02); }
        .shadow-inner-3d { box-shadow: inset 4px 4px 10px #000, inset -2px -2px 5px rgba(255,255,255,0.01); }
        
        .btn-3d-blue { background: #2563eb; color: white; box-shadow: 0 4px 0 #1e3a8a, 0 8px 15px rgba(0,0,0,0.4); transition: all 0.1s; }
        .btn-3d-blue:active { transform: translateY(2px); box-shadow: 0 1px 0 #1e3a8a, 0 4px 8px rgba(0,0,0,0.4); }

        .input-field { width: 100%; background: #000; border: 1px solid #1a1a1a; border-radius: 12px; padding: 10px; text-align: center; font-weight: 700; color: #4b5563; outline: none; box-shadow: inset 2px 2px 5px #000; font-size: 14px; }
        .input-field-active { width: 100%; background: #000; border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 10px; text-align: center; font-weight: 900; color: #fff; outline: none; box-shadow: 0 0 10px rgba(59,130,246,0.1); font-size: 14px; transition: all 0.3s; }
        .input-field-active:focus { border-color: #3b82f6; transform: scale(1.02); }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #0a0b10; }
      `}</style>
    </div>
  );
}
