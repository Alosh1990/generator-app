"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorUltraPro3D() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('fuel'); // للتنقل الديناميكي

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

  // التأثيرات الحركية عند التحميل
  useEffect(() => {
    setMounted(true);
    const savedFuel = localStorage.getItem('fuel_v4');
    const savedKW = localStorage.getItem('kw_v4');
    const savedStock = localStorage.getItem('stock_v4');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuel_v4', JSON.stringify(fuelRows));
      localStorage.setItem('kw_v4', JSON.stringify(kwRows));
      localStorage.setItem('stock_v4', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const updateValue = (type: 'fuel' | 'kw', index: number, field: 'yesterday' | 'today', val: string) => {
    const setter = type === 'fuel' ? setFuelRows : setKwRows;
    const data = type === 'fuel' ? [...fuelRows] : [...kwRows];
    data[index][field] = val;
    setter(data);
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
    <div className="min-h-screen bg-[#08090d] text-white p-4 font-sans selection:bg-cyan-500/30 overflow-x-hidden" dir="rtl">
      
      {/* المؤثرات الخلفية المتحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] animate-bounce-slow"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 space-y-6">
        
        {/* الهيدر الاحترافي */}
        <header className="glass-card p-6 rounded-[2.5rem] flex justify-between items-center shadow-3d-flat border border-white/10 animate-slide-down">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">PRO GENERATOR</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
          <button 
            onClick={() => confirm("ترحيل البيانات للغد؟") && (
              setInitialStock(totals.remaining.toString()),
              setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' }))),
              setKwRows(kwRows.map(r => ({ ...r, yesterday: r.today, today: '' })))
            )}
            className="btn-3d-emerald text-[10px] font-black px-5 py-3 rounded-2xl"
          >
            ترحيل البيانات ⏭️
          </button>
        </header>

        {/* أزرار التحكم الديناميكية (Tabs) */}
        <div className="flex gap-3 p-1 bg-black/40 rounded-3xl shadow-inner-3d border border-white/5">
          <button 
            onClick={() => setActiveTab('fuel')}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'fuel' ? 'bg-cyan-600 shadow-3d-cyan' : 'text-slate-500'}`}
          >
            ⛽ وقود الـ CAT
          </button>
          <button 
            onClick={() => setActiveTab('kw')}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'kw' ? 'bg-blue-600 shadow-3d-blue' : 'text-slate-500'}`}
          >
            ⚡ إنتاج الطاقة
          </button>
        </div>

        {/* البطاقة الرئيسية الديناميكية */}
        <div className="animate-fade-in">
          {activeTab === 'fuel' ? (
            <div className="glass-card rounded-[3rem] p-4 shadow-3d-flat border border-white/5 space-y-4">
              <h2 className="text-center text-cyan-400 font-black text-sm mb-2">قراءات عدادات الكاز</h2>
              {fuelRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/30 p-4 rounded-[2rem] shadow-inner-3d border border-white/5 transition-transform hover:scale-[1.02]">
                  <span className="w-12 font-black text-cyan-500 text-xs italic">{row.name}</span>
                  <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-3d-glass" placeholder="الأمس" />
                  <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-3d-glass-active" placeholder="اليوم" />
                  <div className="w-16 text-center">
                    <span className="text-emerald-400 font-black text-lg">{totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}</span>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-cyan-600/10 rounded-2xl border border-cyan-500/20 flex justify-between">
                <span className="text-xs font-bold text-cyan-200">إجمالي صرف الكاز</span>
                <span className="text-xl font-black text-cyan-400">{totals.totalFuel} لتر</span>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[3rem] p-4 shadow-3d-flat border border-white/5 space-y-4">
               <h2 className="text-center text-blue-400 font-black text-sm mb-2">قراءات الطاقة الكهربائية</h2>
               {kwRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/30 p-4 rounded-[2rem] shadow-inner-3d border border-white/5 transition-transform hover:scale-[1.02]">
                  <span className="w-12 font-black text-blue-500 text-xs italic">{row.name}</span>
                  <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-3d-glass" placeholder="الأمس" />
                  <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-3d-glass-active border-blue-500/40 text-blue-400" placeholder="اليوم" />
                  <div className="w-16 text-center">
                    <span className="text-cyan-400 font-black text-lg">{totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}</span>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex justify-between">
                <span className="text-xs font-bold text-blue-200">إجمالي الطاقة المنتجة</span>
                <span className="text-xl font-black text-blue-400">{totals.totalKW} kW</span>
              </div>
            </div>
          )}
        </div>

        {/* المخزون الصافي (3D Hero Card) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative glass-card p-8 rounded-[3rem] shadow-3d-flat border border-white/10 flex flex-col items-center text-center space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مستوى الوقود المتبقي في الخزان الرئيسي</span>
            <div className="text-6xl font-black text-white tracking-tighter drop-shadow-3d">
              {totals.remaining.toLocaleString()}
              <span className="text-xs font-normal text-cyan-400 ml-2 italic">LITERS</span>
            </div>
            <div className="w-full h-4 bg-black/40 rounded-full p-1 shadow-inner-3d border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 shadow-glow"
                style={{ width: `${Math.min(100, Math.max(0, (totals.remaining / 10000) * 100))}%` }}
              ></div>
            </div>
            <div className="flex w-full items-center gap-4 mt-4">
               <span className="text-[9px] text-slate-500 font-black whitespace-nowrap">تحديث الخزين:</span>
               <input 
                type="number" 
                value={initialStock} 
                onChange={(e)=>setInitialStock(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-center text-cyan-400 font-bold focus:border-cyan-500 outline-none shadow-inner-3d"
                placeholder="أدخل الكمية الحالية"
               />
            </div>
          </div>
        </div>

        <footer className="text-center text-[9px] font-bold text-slate-600 tracking-[0.3em] py-6 opacity-50">
          DESIGNED BY AI EXPERT PRO • 2026
        </footer>
      </div>

      <style jsx global>{`
        @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        
        .animate-slide-down { animation: slideDown 0.8s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-bounce-slow { animation: bounceSlow 5s infinite ease-in-out; }

        .glass-card { background: rgba(22, 25, 32, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .shadow-3d-flat { box-shadow: 15px 15px 35px #040507, -5px -5px 15px rgba(255,255,255,0.02); }
        .shadow-inner-3d { box-shadow: inset 4px 4px 8px #040507, inset -2px -2px 5px rgba(255,255,255,0.01); }
        .drop-shadow-3d { filter: drop-shadow(4px 4px 2px #000); }
        .shadow-glow { box-shadow: 0 0 15px rgba(6, 182, 212, 0.5); }
        
        .btn-3d-emerald { background: #059669; box-shadow: 0 5px 0 #064e3b, 0 8px 15px rgba(0,0,0,0.4); transition: all 0.1s; }
        .btn-3d-emerald:active { transform: translateY(3px); box-shadow: 0 2px 0 #064e3b, 0 4px 8px rgba(0,0,0,0.4); }

        .shadow-3d-cyan { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4); border: 1px solid rgba(255,255,255,0.2); }
        .shadow-3d-blue { box-shadow: 0 0 20px rgba(37, 99, 235, 0.4); border: 1px solid rgba(255,255,255,0.2); }

        .input-3d-glass { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 1rem; padding: 8px; text-align: center; font-weight: 700; color: #64748b; font-size: 14px; outline: none; box-shadow: inset 2px 2px 5px #000; }
        .input-3d-glass-active { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 1rem; padding: 8px; text-align: center; font-weight: 900; color: #fff; font-size: 14px; outline: none; box-shadow: 0 0 10px rgba(6,182,212,0.2); transition: all 0.3s; }
        .input-3d-glass-active:focus { transform: scale(1.05); border-color: #06b6d4; }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #08090d; }
      `}</style>
    </div>
  );
}
