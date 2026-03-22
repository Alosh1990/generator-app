"use client";
import React, { useState, useEffect, useMemo } from 'react';

// تزيين الأيقونات البسيطة بدون مكتبات خارجية
const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    os: '◻️', fuel: '⛽', power: '⚡', save: '💾', transfer: '⏭️'
  };
  return <span className="text-lg opacity-80">{icons[name] || ''}</span>;
};

export default function GeneratorFinalOS_v6() {
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

  // استرجاع البيانات الآمن
  useEffect(() => {
    setMounted(true);
    try {
      const savedFuel = localStorage.getItem('f_os_v6');
      const savedKW = localStorage.getItem('k_os_v6');
      const savedStock = localStorage.getItem('s_os_v6');
      if (savedFuel) setFuelRows(JSON.parse(savedFuel));
      if (savedKW) setKwRows(JSON.parse(savedKW));
      if (savedStock) setInitialStock(savedStock);
    } catch (e) { console.error("Data error"); }
  }, []);

  // حفظ تلقائي
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('f_os_v6', JSON.stringify(fuelRows));
      localStorage.setItem('k_os_v6', JSON.stringify(kwRows));
      localStorage.setItem('s_os_v6', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const update = (type: 'f' | 'k', i: number, field: 'yesterday' | 'today', v: string) => {
    const data = type === 'f' ? [...fuelRows] : [...kwRows];
    data[i][field] = v;
    type === 'f' ? setFuelRows(data) : setKwRows(data);
  };

  const totals = useMemo(() => {
    const fSums = fuelRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const kSums = kwRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const totalF = fSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const totalK = kSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const stock = parseFloat(initialStock) || 0;
    const remaining = stock - totalF;
    return { fSums, kSums, totalF, totalK, remaining: remaining || 0 };
  }, [fuelRows, kwRows, initialStock]);

  const safeFormat = (num: number) => (num || 0).toLocaleString('en-US');

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-200 p-4 md:p-10 font-sans selection:bg-cyan-500/30 overflow-x-hidden" dir="rtl">
      
      {/* 1. Cinematic Light Effects (تأثيرات ضوئية خلفية) */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[130px] rounded-full animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* 2. Glass OS Header */}
        <header className="os-glass p-6 rounded-[2rem] flex justify-between items-center shadow-3d-flat border border-white/5 mt-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-blue-600 shadow-glow-blue">
               <Icon name="os" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tight">قمرة القيادة</h1>
              <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase mt-1">GENERATOR MANAGEMENT OS • V6.0</p>
            </div>
          </div>
          <button 
            onClick={() => confirm("ترحيل؟") && (
              setInitialStock(totals.remaining.toString()),
              setFuelRows(fuelRows.map(r=>({...r, yesterday:r.today, today:''}))),
              setKwRows(kwRows.map(r=>({...r, yesterday:r.today, today:''})))
            )}
            className="os-btn text-xs font-black px-6 py-3 rounded-2xl"
          >
            <Icon name="transfer" /> الترحيل للغد
          </button>
        </header>

        {/* 3. The Grand Storage Control (الجزء الرئيسي - الخزين) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-10">
           <div className="os-glass p-10 rounded-[2.5rem] shadow-3d-flat border border-white/5 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-3xl opacity-50"></div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 z-10">الخزين الكلي في الخزان الرئيسي (لتر)</label>
              <input 
                type="number" 
                value={initialStock} 
                onChange={(e)=>setInitialStock(e.target.value)} 
                className="w-full max-w-xl bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-5xl font-black text-blue-400 outline-none shadow-inner-3d text-center focus:border-blue-500 transition-all z-10"
                placeholder="0"
              />
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-12 mb-3 z-10">المتبقي الصافي الآن</p>
               <h3 className="text-[10rem] font-black text-white tracking-tighter drop-shadow-3d animate-text-glow z-10">
                 {safeFormat(totals.remaining)}
                 <span className="text-xl font-normal text-cyan-400 mr-4 italic underline decoration-cyan-900 underline-offset-8">Ltr</span>
               </h3>
               <div className="w-full h-1.5 bg-black/40 rounded-full mt-10 shadow-inner-3d z-10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 animate-shimmer" style={{ width: `${Math.min(100, Math.max(0, (totals.remaining / 10000) * 100))}%` }}></div>
               </div>
           </div>
           
           {/* الترحيل والبيانات السريعة */}
           <div className="os-glass p-8 rounded-[2.5rem] shadow-3d-flat border border-white/5 flex flex-col justify-between">
              <div className="text-center">
                 <Icon name="fuel" />
                 <p className="text-xs font-bold text-slate-500 mt-2 mb-1">إجمالي صرف اليوم</p>
                 <span className="text-5xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{safeFormat(totals.totalF)} <small className="text-xs">لتر</small></span>
              </div>
              <div className="border-t border-white/5 pt-6 text-center">
                  <Icon name="power" />
                 <p className="text-xs font-bold text-slate-500 mt-2 mb-1">إجمالي إنتاج الطاقة</p>
                 <span className="text-5xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{safeFormat(totals.totalK)} <small className="text-xs">kW</small></span>
              </div>
           </div>
        </div>

        {/* 4. The Grids: Fuel & Power (جداول العدادات - التنسيق الجديد) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           
           {/* Fuel OS Glass Card */}
           <section className="os-glass rounded-[2.5rem] p-8 shadow-3d-flat border border-blue-900/10 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                 <span className="w-3 h-6 bg-blue-500 rounded-lg shadow-glow-blue animate-pulse"></span>
                 <h2 className="text-lg font-black text-blue-300 uppercase tracking-tight">مراقبة صرف الوقود</h2>
              </div>
              <div className="space-y-4">
                 {fuelRows.map((row, idx) => (
                    <div key={idx} className="bg-[#0c0e14]/50 p-6 rounded-3xl border border-white/5 flex items-center gap-4 shadow-inner-3d transition-all hover:border-blue-500/30">
                       <span className="w-16 font-black text-xs text-blue-200 italic">{row.name}</span>
                       <input type="number" value={row.yesterday} onChange={(e)=>update('f', idx, 'yesterday', e.target.value)} className="input-field" placeholder="أمس" />
                       <input type="number" value={row.today} onChange={(e)=>update('f', idx, 'today', e.target.value)} className="input-field-active border-blue-500/30" placeholder="يوم" />
                       <div className="w-20 text-center font-black text-2xl text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                         {totals.fSums[idx] > 0 ? safeFormat(totals.fSums[idx]) : 0}
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Power OS Glass Card */}
           <section className="os-glass rounded-[2.5rem] p-8 shadow-3d-flat border border-cyan-900/10 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                 <span className="w-3 h-6 bg-cyan-500 rounded-lg shadow-glow-cyan animate-pulse"></span>
                 <h2 className="text-lg font-black text-cyan-300 uppercase tracking-tight">مراقبة إنتاج الطاقة</h2>
              </div>
              <div className="space-y-4">
                 {kwRows.map((row, idx) => (
                    <div key={idx} className="bg-[#0c0e14]/50 p-6 rounded-3xl border border-white/5 flex items-center gap-4 shadow-inner-3d transition-all hover:border-cyan-500/30">
                       <span className="w-16 font-black text-xs text-cyan-200 italic">{row.name}</span>
                       <input type="number" value={row.yesterday} onChange={(e)=>update('k', idx, 'yesterday', e.target.value)} className="input-field" placeholder="أمس" />
                       <input type="number" value={row.today} onChange={(e)=>update('k', idx, 'today', e.target.value)} className="input-field-active border-cyan-500/30 text-cyan-100" placeholder="يوم" />
                       <div className="w-20 text-center font-black text-2xl text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                         {totals.kSums[idx] > 0 ? safeFormat(totals.kSums[idx]) : 0}
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center p-12 text-slate-700 text-[10px] font-bold tracking-[0.3em] opacity-30">
        POWER MANAGEMENT OS • HIGH-END INTERFACE • 2026
      </footer>

      {/* 5. CSS Perfection (تعديل المسافات والخطوط والظلال) */}
      <style jsx global>{`
        @keyframes textGlow { 0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); } 50% { filter: drop-shadow(0 0 15px rgba(59,130,246,0.4)); } }
        @keyframes pulseSlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        .animate-text-glow { animation: textGlow 4s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulseSlow 5s infinite ease-in-out; }
        .animate-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%); background-size: 200% 100%; animation: shimmer 2.5s infinite linear; }

        .os-glass { background: rgba(13, 15, 22, 0.7); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); }
        .shadow-3d-flat { box-shadow: 20px 20px 50px rgba(0,0,0,0.5), -5px -5px 15px rgba(255,255,255,0.01); }
        .shadow-inner-3d { box-shadow: inset 5px 5px 15px #000, inset -2px -2px 6px rgba(255,255,255,0.01); }
        .shadow-glow-blue { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
        .shadow-glow-cyan { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
        .drop-shadow-3d { filter: drop-shadow(5px 5px 3px #000); }
        
        .os-btn { background: #0c0e14; border: 1px solid #1c222d; color: #a1a1aa; box-shadow: 4px 4px 10px #040507, -2px -2px 5px #1c222d; transition: all 0.2s; cursor: pointer; }
        .os-btn:active { transform: translateY(2px); box-shadow: 1px 1px 2px #040507, -1px -1px 2px #1c222d; color: #fff; border-color: #3f3f46; }

        .input-field { width: 100%; bg: #0a0c10; border: 1px solid #1a1e28; border-radius: 12px; p: 12px; text-align: center; font-weight: 700; color: #3f3f46; font-size: 15px; outline: none; box-shadow: inset 3px 3px 6px #000; }
        .input-field-active { width: 100%; bg: #0a0c10; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; p: 12px; text-align: center; font-weight: 900; color: #fff; font-size: 15px; outline: none; transition: all 0.3s; }
        .input-field-active:focus { border-color: rgba(255,255,255,0.3); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,255,255,0.1); }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #06070a; margin: 0; }
      `}</style>
    </div>
  );
}
