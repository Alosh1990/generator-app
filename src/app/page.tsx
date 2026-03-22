"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorFinalFixedUI() {
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
    // استرجاع البيانات الآمن
    try {
      const savedFuel = localStorage.getItem('fuel_v6');
      const savedKW = localStorage.getItem('kw_v6');
      const savedStock = localStorage.getItem('stock_v6');
      if (savedFuel) setFuelRows(JSON.parse(savedFuel));
      if (savedKW) setKwRows(JSON.parse(savedKW));
      if (savedStock) setInitialStock(savedStock);
    } catch (e) { console.error("Error loading data"); }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuel_v6', JSON.stringify(fuelRows));
      localStorage.setItem('kw_v6', JSON.stringify(kwRows));
      localStorage.setItem('stock_v6', initialStock);
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
    return { fSums, kSums, totalF, totalK, remaining: remaining || 0 };
  }, [fuelRows, kwRows, initialStock]);

  const safeFormat = (num: number) => (num || 0).toLocaleString('en-US');

  if (!mounted) return null;

  return (
    <>
      {/* 1. الحل السحري للموبايل (Meta Tag) */}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>

      <div className="min-h-screen bg-[#08090c] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-x-hidden" dir="rtl">
        
        {/* تأثيرات إضاءة خلفية هادئة */}
        <div className="fixed inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-cyan-600/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-md mx-auto relative z-10 space-y-6 pb-12">
          
          {/* الهيدر الفخم */}
          <header className="os-glass p-6 rounded-[2rem] flex justify-between items-center shadow-3d border border-white/5 mt-2">
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tight">قمرة القيادة</h1>
              <p className="text-[10px] text-slate-600 font-bold tracking-widest mt-1 uppercase">GENERATOR PRO v6</p>
            </div>
            <button 
              onClick={() => confirm("ترحيل البيانات للغد؟") && setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' })))}
              className="os-btn text-[10px] font-black px-4 py-2.5 rounded-xl text-blue-400 active:scale-95 transition-all"
            >
              ترحيل البيانات ⏭️
            </button>
          </header>

          {/* المخزون الصافي (تصميم زجاجي عريض للموبايل) */}
          <div className="os-glass p-8 rounded-[2.5rem] shadow-3d border border-white/5 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl opacity-60"></div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 z-10">الخزين الكلي الحالي في المستودع</label>
            <input 
              type="number" 
              value={initialStock} 
              onChange={(e)=>setInitialStock(e.target.value)} 
              className="w-full bg-black/50 border-2 border-white/5 p-4 rounded-2xl text-4xl font-black text-blue-400 outline-none shadow-inner-3d text-center focus:border-blue-500 transition-all z-10"
              placeholder="0"
            />
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-8 mb-2 z-10">المتبقي الصافي الآمن</p>
             <h3 className="text-7xl font-black text-white tracking-tighter drop-shadow-3d z-10 animate-text-glow">
               {safeFormat(totals.remaining)}
               <span className="text-sm font-normal text-cyan-400 mr-2 italic underline decoration-cyan-900 underline-offset-4">Ltr</span>
             </h3>
          </div>

          {/* عدادات الكاز - تنسيق محاذي عمودياً للموبايل */}
          <section className="os-glass rounded-[2.5rem] p-5 shadow-3d border border-blue-900/10 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-5 bg-blue-500 rounded-full shadow-glow-blue"></span>
              <h2 className="text-sm font-black text-blue-300">عدادات الكاز (لتر)</h2>
            </div>
            {fuelRows.map((row, idx) => (
              <div key={idx} className="bg-black/40 p-4 rounded-2xl shadow-inner-3d border border-white/5 flex items-center gap-2 transition-all hover:border-blue-500/30">
                <span className="w-12 font-black text-[10px] text-slate-500 italic">{row.name}</span>
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-field text-slate-600" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-field-active border-blue-500/40 text-blue-100" placeholder="اليوم" />
                <div className="w-14 text-center font-black text-emerald-400 text-lg">
                  {totals.fSums[idx] > 0 ? safeFormat(totals.fSums[idx]) : 0}
                </div>
              </div>
            ))}
          </section>

          {/* عدادات الطاقة - تنسيق محاذي عمودياً للموبايل */}
          <section className="os-glass rounded-[2.5rem] p-5 shadow-3d border border-cyan-900/10 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-5 bg-cyan-500 rounded-full shadow-glow-cyan"></span>
              <h2 className="text-sm font-black text-cyan-300">إنتاج الطاقة الكهربائية (kW)</h2>
            </div>
            {kwRows.map((row, idx) => (
              <div key={idx} className="bg-black/40 p-4 rounded-2xl shadow-inner-3d border border-white/5 flex items-center gap-2 transition-all hover:border-cyan-500/30">
                <span className="w-12 font-black text-[10px] text-slate-500 italic">{row.name}</span>
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-field text-slate-600" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-field-active border-cyan-500/40 text-cyan-100" placeholder="اليوم" />
                <div className="w-14 text-center font-black text-cyan-400 text-lg">
                  {totals.kSums[idx] > 0 ? safeFormat(totals.kSums[idx]) : 0}
                </div>
              </div>
            ))}
          </section>

        </div>

        {/* ستايل مخصص لضمان استجابة الموبايل */}
        <style jsx global>{`
          @keyframes textGlow { 0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); } 50% { filter: drop-shadow(0 0 15px rgba(59,130,246,0.4)); } }
          .animate-text-glow { animation: textGlow 4s infinite ease-in-out; }
          .os-glass { background: rgba(13, 15, 22, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
          .shadow-3d { box-shadow: 15px 15px 40px #040507, -5px -5px 15px rgba(255,255,255,0.01); }
          .shadow-inner-3d { box-shadow: inset 3px 3px 10px #000, inset -1px -1px 5px rgba(255,255,255,0.01); }
          .shadow-glow-blue { box-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }
          .shadow-glow-cyan { box-shadow: 0 0 10px rgba(6, 182, 212, 0.4); }
          .drop-shadow-3d { filter: drop-shadow(5px 5px 3px #000); }
          
          .os-btn { background: #0c0e14; border: 1px solid #1c222d; color: #a1a1aa; box-shadow: 4px 4px 10px #040507, -2px -2px 5px #1c222d; transition: all 0.2s; cursor: pointer; }
          .os-btn:active { transform: translateY(2px); box-shadow: 1px 1px 2px #040507, -1px -1px 2px #1c222d; color: #fff; }

          .input-field { width: 100%; bg: #0a0c10; border: 1px solid #111; border-radius: 10px; p: 10px; text-align: center; font-weight: 700; font-size: 14px; outline: none; box-shadow: inset 2px 2px 5px #000; }
          .input-field-active { width: 100%; bg: #0a0c10; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; p: 10px; text-align: center; font-weight: 900; font-size: 14px; outline: none; transition: all 0.3s; }
          .input-field-active:focus { border-color: rgba(255,255,255,0.3); transform: scale(1.05); }

          input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
          body { background-color: #08090c; margin: 0; }
        `}</style>
      </div>
    </>
  );
}
