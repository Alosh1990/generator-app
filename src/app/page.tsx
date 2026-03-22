"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorFinalUltraPro3D() {
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

  // تأثيرات ديناميكية عند تحميل الصفحة
  useEffect(() => {
    setMounted(true);
    const savedFuel = localStorage.getItem('fuel_vFinal');
    const savedKW = localStorage.getItem('kw_vFinal');
    const savedStock = localStorage.getItem('stock_vFinal');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  // حفظ تلقائي فوري وآمن للبيانات
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuel_vFinal', JSON.stringify(fuelRows));
      localStorage.setItem('kw_vFinal', JSON.stringify(kwRows));
      localStorage.setItem('stock_vFinal', initialStock);
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
    <div className="min-h-screen bg-[#06070a] text-white p-4 font-sans selection:bg-cyan-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Background Cinematic Effects (المؤثرات السينمائية الخلفية) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[130px] rounded-full animate-pulse-slow"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 space-y-6 pb-12">
        
        {/* Header (الهيدر الزجاجي) */}
        <header className="glass-panel p-6 rounded-[2.5rem] flex justify-between items-center shadow-3d-flat border border-white/5 mt-4 animate-slide-down">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tight">GMS Pro v1.0</h1>
            <p className="text-[9px] text-slate-600 font-bold tracking-[0.2em] uppercase mt-1">Smart Generator Management</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات للغد؟") && (
              setInitialStock(totals.remaining.toString()),
              setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' }))),
              setKwRows(kwRows.map(r => ({ ...r, yesterday: r.today, today: '' })))
            )}
            className="btn-3d-active text-[10px] font-black px-4 py-2 rounded-xl"
          >
            ترحيل ⏭️
          </button>
        </header>

        {/* Fuel Card (بطاقة الوقود النيون) */}
        <section className="glass-panel rounded-[2.5rem] p-5 shadow-3d-flat border border-blue-900/10 space-y-4 group">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <span className="w-3 h-5 bg-blue-500 rounded-lg shadow-glow-blue animate-pulse"></span>
              <h2 className="text-sm font-black text-blue-300">مراقبة صرف الكاز (لتر)</h2>
            </div>
            <span className="text-[10px] text-slate-600 font-bold">LITERS</span>
          </div>
          {fuelRows.map((row, idx) => (
            <div key={idx} className="bg-[#0c0e14]/50 p-4 rounded-2xl shadow-inner-3d border border-white/5 flex items-center gap-3 transition-all hover:border-blue-500/30">
              <span className="w-14 font-black text-xs text-blue-200 italic">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-3d" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-3d-active border-blue-500/40 text-blue-100" placeholder="يوم" />
              <div className="w-14 text-center font-black text-emerald-400 text-lg group-hover:animate-scale-in">{totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}</div>
            </div>
          ))}
          <div className="p-4 bg-gradient-to-r from-blue-950/20 to-transparent rounded-2xl border-t border-blue-800/20 flex justify-between items-center mt-2">
            <span className="text-xs font-bold text-slate-500">إجمالي صرف الوقود:</span>
            <span className="text-2xl font-black text-blue-400 shadow-glow-blue-txt">{totals.totalFuel.toLocaleString()}</span>
          </div>
        </section>

        {/* KW Card (بطاقة الطاقة النيون) */}
        <section className="glass-panel rounded-[2.5rem] p-5 shadow-3d-flat border border-cyan-900/10 space-y-4 group">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <span className="w-3 h-5 bg-cyan-500 rounded-lg shadow-glow-cyan animate-pulse"></span>
              <h2 className="text-sm font-black text-cyan-300">إنتاج الطاقة (kW)</h2>
            </div>
            <span className="text-[10px] text-slate-600 font-bold">POWER</span>
          </div>
          {kwRows.map((row, idx) => (
            <div key={idx} className="bg-[#0c0e14]/50 p-4 rounded-2xl shadow-inner-3d border border-white/5 flex items-center gap-3 transition-all hover:border-cyan-500/30">
              <span className="w-14 font-black text-xs text-cyan-200 italic">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-3d" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-3d-active border-cyan-500/40 text-cyan-100" placeholder="يوم" />
              <div className="w-14 text-center font-black text-cyan-400 text-lg group-hover:animate-scale-in">{totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}</div>
            </div>
          ))}
          <div className="p-4 bg-gradient-to-r from-cyan-950/20 to-transparent rounded-2xl border-t border-cyan-800/20 flex justify-between items-center mt-2">
            <span className="text-xs font-bold text-slate-500">إجمالي الإنتاج:</span>
            <span className="text-2xl font-black text-cyan-400 shadow-glow-cyan-txt">{totals.totalKW.toLocaleString()}</span>
          </div>
        </section>

        {/* Remaining (الخزين الصافي - البطاقة الرئيسية) */}
        <div className="space-y-4 relative overflow-hidden p-6 glass-panel rounded-[3rem] shadow-3d-flat border border-white/5 text-center flex flex-col items-center">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-blue-600/5 [mask-image:linear-gradient(180deg,#fff,rgba(255,255,255,0))] opacity-50"></div>
            
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1 z-10">الخزين الكلي في الخزان الرئيسي (لتر)</label>
            <input 
              type="number" 
              value={initialStock} 
              onChange={(e)=>setInitialStock(e.target.value)} 
              className="w-full bg-[#0c0e14]/80 border-2 border-blue-500/30 p-5 rounded-2xl text-4xl font-black text-blue-400 outline-none shadow-inner-3d text-center focus:border-blue-500 focus:ring-4 ring-blue-500/10 transition-all z-10"
              placeholder="0"
            />
            
            <div className="w-full h-1 bg-black/40 rounded-full mt-6 shadow-inner-3d z-10 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 shadow-glow-blue-txt animate-shimmer"
                    style={{ width: `${Math.min(100, (totals.remaining / 10000) * 100)}%` }}
                ></div>
            </div>

            <p className="text-[9px] font-black text-blue-200uppercase tracking-widest mt-6 mb-1 z-10">المتبقي الصافي الآن</p>
            <p className="text-7xl font-black text-white tracking-tighter drop-shadow-3d animate-text-glow z-10">
              {totals.remaining.toLocaleString()}
              <span className="text-xs font-normal text-cyan-400 ml-2 italic">Ltr</span>
            </p>
        </div>

      </div>

      {/* Footer info (فوتر الاحترافي) */}
      <footer className="text-center p-8 text-slate-700 text-[10px] font-bold tracking-[0.3em]">
        DESIGNED FOR EXTREME OPERATIONS • 2026
      </footer>

      {/* Global CSS for unique animations and effects (جميع التأثيرات والمؤثرات البصرية) */}
      <style jsx global>{`
        @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes textGlow { 0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.4)); } 50% { filter: drop-shadow(0 0 15px rgba(59,130,246,0.6)); } }
        @keyframes pulseSlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.6; } }
        @keyframes scaleIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        .animate-slide-down { animation: slideDown 0.8s ease-out; }
        .animate-text-glow { animation: textGlow 4s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulseSlow 5s infinite ease-in-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%); background-size: 200% 100%; animation: shimmer 2.5s infinite linear; }

        .glass-panel { background: rgba(13, 15, 22, 0.7); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
        .shadow-3d-flat { box-shadow: 20px 20px 40px #040507, -5px -5px 15px rgba(255,255,255,0.01); }
        .shadow-inner-3d { box-shadow: inset 4px 4px 10px #000, inset -2px -2px 5px rgba(255,255,255,0.01); }
        .shadow-glow-blue { box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
        .shadow-glow-cyan { box-shadow: 0 0 15px rgba(6, 182, 212, 0.6); }
        .shadow-glow-blue-txt { filter: drop-shadow(0 0 10px #3b82f6); }
        .shadow-glow-cyan-txt { filter: drop-shadow(0 0 10px #06b6d4); }
        .drop-shadow-3d { filter: drop-shadow(5px 5px 3px #000); }
        
        .btn-3d-active { background: #050608; border: 1px solid #1c222d; color: #a1a1aa; box-shadow: 4px 4px 8px #040507, -2px -2px 5px #1c222d; transition: all 0.2s; }
        .btn-3d-active:active { transform: translateY(2px); box-shadow: 1px 1px 2px #040507, -1px -1px 2px #1c222d; color: #fff; border-color: #3f3f46; }

        .input-3d { width: 100%; background: #0a0c10; border: 1px solid #111; border-radius: 10px; padding: 10px; text-align: center; font-weight: 700; color: #3f3f46; outline: none; box-shadow: inset 3px 3px 6px #000; font-size: 14px; }
        .input-3d-active { width: 100%; background: #0a0c10; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; text-align: center; font-weight: 900; color: #fff; outline: none; box-shadow: 0 0 15px rgba(255,255,255,0.05); font-size: 14px; transition: all 0.3s; }
        .input-3d-active:focus { border-color: rgba(255,255,255,0.3); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,255,255,0.1); }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #06070a; }
      `}</style>
    </div>
  );
}
