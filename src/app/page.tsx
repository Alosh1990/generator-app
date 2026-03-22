"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorPerfectMobile() {
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
    const savedFuel = localStorage.getItem('f_final_v10');
    const savedKW = localStorage.getItem('k_final_v10');
    const savedStock = localStorage.getItem('s_final_v10');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('f_final_v10', JSON.stringify(fuelRows));
      localStorage.setItem('k_final_v10', JSON.stringify(kwRows));
      localStorage.setItem('s_final_v10', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const updateValue = (type: 'f' | 'k', i: number, field: 'yesterday' | 'today', v: string) => {
    const data = type === 'f' ? [...fuelRows] : [...kwRows];
    data[i][field] = v;
    type === 'f' ? setFuelRows(data) : setKwRows(data);
  };

  const totals = useMemo(() => {
    const fSums = fuelRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const kSums = kwRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const totalF = fSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const totalK = kSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const remaining = (parseFloat(initialStock) || 0) - totalF;
    return { fSums, kSums, totalF, totalK, remaining: remaining || 0 };
  }, [fuelRows, kwRows, initialStock]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden flex justify-center" dir="rtl">
      
      {/* Container الأساسي - يتوسط في الكمبيوتر ويمرن في الموبايل */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#090a0f] p-5 md:p-8 space-y-8 shadow-2xl relative border-x border-white/5 pb-20">
        
        {/* Header فخم وبسيط */}
        <header className="flex justify-between items-center pt-2">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-l from-blue-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tighter">قمرة القيادة</h1>
            <p className="text-[9px] text-slate-600 font-bold tracking-[0.2em] uppercase">SYSTEM VERSION 10.0</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات؟") && setFuelRows(fuelRows.map(r=>({...r, yesterday:r.today, today:''})))}
            className="bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-4 py-2 rounded-xl active:scale-95 transition-all"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* كارت الخزين الرئيسي - كبير جداً وواضح */}
        <div className="bg-gradient-to-br from-[#12141c] to-[#090a0f] p-8 rounded-[2.5rem] border border-white/5 shadow-3d relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/5 blur-3xl"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">الخزين المتبقي الصافي (لتر)</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
              {totals.remaining.toLocaleString()}
            </span>
            <span className="text-blue-500 font-black text-sm italic">Ltr</span>
          </div>
          <input 
            type="number" 
            value={initialStock} 
            onChange={(e)=>setInitialStock(e.target.value)}
            placeholder="تحديث الخزين الرئيسي..."
            className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-center text-xl font-black text-blue-400 outline-none focus:border-blue-500/40 transition-all shadow-inner"
          />
        </div>

        {/* عدادات الكاز - خطوط واضحة وعريضة */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex justify-between">
            <span>⛽ استهلاك الكاز</span>
            <span className="text-emerald-400">+{totals.totalF}</span>
          </h2>
          {fuelRows.map((row, idx) => (
            <div key={idx} className="bg-[#11131a] p-5 rounded-[2rem] border border-white/5 flex items-center gap-3 shadow-3d transition-all active:bg-[#1a1d29]">
              <span className="w-14 font-black text-[10px] text-blue-300 italic uppercase">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('f', idx, 'yesterday', e.target.value)} className="ios-input" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('f', idx, 'today', e.target.value)} className="ios-input-active" placeholder="يوم" />
              <div className="w-20 text-center font-black text-2xl text-emerald-400 drop-shadow-glow">
                {totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}
              </div>
            </div>
          ))}
        </section>

        {/* عدادات الطاقة - تناسق ألوان */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex justify-between">
            <span>⚡ إنتاج الطاقة</span>
            <span className="text-purple-400">+{totals.totalK}</span>
          </h2>
          {kwRows.map((row, idx) => (
            <div key={idx} className="bg-[#11131a] p-5 rounded-[2rem] border border-white/5 flex items-center gap-3 shadow-3d transition-all active:bg-[#1a1d29]">
              <span className="w-14 font-black text-[10px] text-purple-300 italic uppercase">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('k', idx, 'yesterday', e.target.value)} className="ios-input" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('k', idx, 'today', e.target.value)} className="ios-input-active !border-purple-500/20" placeholder="يوم" />
              <div className="w-20 text-center font-black text-2xl text-blue-400 drop-shadow-glow">
                {totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}
              </div>
            </div>
          ))}
        </section>

        <footer className="text-center pt-10 opacity-20 text-[9px] font-bold tracking-[0.4em]">
          SECURE INTERFACE • 2026
        </footer>
      </div>

      <style jsx global>{`
        body { background-color: #050608; margin: 0; padding: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .shadow-3d { box-shadow: 10px 10px 30px rgba(0,0,0,0.5), -5px -5px 15px rgba(255,255,255,0.02); }
        .drop-shadow-glow { filter: drop-shadow(0 0 8px currentColor); }

        .ios-input { 
          width: 100%; background: #000; border: 1px solid #1a1b23; border-radius: 14px; 
          padding: 12px; text-align: center; font-size: 16px; color: #444; outline: none; 
          box-shadow: inset 2px 2px 5px #000;
        }
        
        .ios-input-active { 
          width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; 
          padding: 12px; text-align: center; font-size: 16px; color: #fff; font-weight: 900; 
          outline: none; transition: all 0.3s; box-shadow: inset 2px 2px 5px #000;
        }
        
        .ios-input-active:focus { 
          border-color: #3b82f6; background: #0d0e12; transform: scale(1.05); 
          box-shadow: 0 0 15px rgba(59,130,246,0.2); 
        }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        
        /* ضبط حجم الخط تلقائياً للموبايل لمنع الـ Zoom */
        @media screen and (max-width: 768px) {
          input { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}
