"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorIPhoneOS() {
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
    const savedFuel = localStorage.getItem('v9_fuel');
    const savedKW = localStorage.getItem('v9_kw');
    const savedStock = localStorage.getItem('v9_stock');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('v9_fuel', JSON.stringify(fuelRows));
      localStorage.setItem('v9_kw', JSON.stringify(kwRows));
      localStorage.setItem('v9_stock', initialStock);
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
    <div className="min-h-screen bg-black flex justify-center items-center p-0 md:p-10 font-sans" dir="rtl">
      
      {/* جسم الهاتف الوهمي - يظهر فقط على الكمبيوتر */}
      <div className="w-full max-w-[430px] h-screen md:h-[850px] bg-[#090a0f] relative md:rounded-[3.5rem] md:border-[10px] border-[#1a1b23] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col animate-fade-in">
        
        {/* Notch (حساسات الآيفون العلوية) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1b23] rounded-b-2xl z-50 hidden md:block"></div>

        {/* محتوى التطبيق */}
        <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28 no-scrollbar space-y-8">
          
          {/* Header الاحترافي */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">المولدات</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Live System Pro</p>
              </div>
            </div>
            <button 
              onClick={() => confirm("ترحيل البيانات؟") && setFuelRows(fuelRows.map(r=>({...r, yesterday:r.today, today:''})))}
              className="bg-[#1a1b23] border border-white/5 text-[10px] font-black px-5 py-2.5 rounded-2xl active:scale-90 transition-all text-blue-400 uppercase"
            >
              ترحيل ⏭️
            </button>
          </div>

          {/* الكارت الرئيسي - الخزين المتبقي (تصميم زجاجي عريض) */}
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px]"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">صافي المتبقي في الخزان</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                {totals.remaining.toLocaleString()}
              </span>
              <span className="text-blue-500 font-black text-lg italic">Ltr</span>
            </div>
            <input 
              type="number" 
              value={initialStock} 
              onChange={(e)=>setInitialStock(e.target.value)}
              placeholder="إدخال القراءة الكلية..."
              className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-center text-lg font-black text-blue-400 outline-none focus:border-blue-500/40 transition-all shadow-inner"
            />
          </div>

          {/* قسم استهلاك الوقود - خطوط عريضة جداً */}
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2 flex justify-between">
              <span>⛽ استهلاك الكاز</span>
              <span className="text-emerald-400 italic">+{totals.totalF}</span>
            </h2>
            {fuelRows.map((row, idx) => (
              <div key={idx} className="bg-[#12141c] p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 transition-all active:bg-[#1a1d29]">
                <span className="w-14 font-black text-[11px] text-blue-300 italic">{row.name}</span>
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('f', idx, 'yesterday', e.target.value)} className="ios-input text-slate-500" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('f', idx, 'today', e.target.value)} className="ios-input-active border-blue-500/20" placeholder="اليوم" />
                <div className="w-20 text-center font-black text-2xl text-emerald-400 drop-shadow-sm">
                  {totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}
                </div>
              </div>
            ))}
          </div>

          {/* قسم إنتاج الطاقة - ألوان متناسقة */}
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2 flex justify-between">
              <span>⚡ إنتاج الطاقة</span>
              <span className="text-blue-400 italic">+{totals.totalK}</span>
            </h2>
            {kwRows.map((row, idx) => (
              <div key={idx} className="bg-[#12141c] p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 transition-all active:bg-[#1a1d29]">
                <span className="w-14 font-black text-[11px] text-purple-300 italic">{row.name}</span>
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('k', idx, 'yesterday', e.target.value)} className="ios-input text-slate-500" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('k', idx, 'today', e.target.value)} className="ios-input-active border-purple-500/20" placeholder="اليوم" />
                <div className="w-20 text-center font-black text-2xl text-blue-400 drop-shadow-sm">
                  {totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar - شكل الآيفون */}
        <div className="h-24 bg-[#090a0f]/80 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-10 pb-4">
           <div className="flex flex-col items-center gap-1 text-blue-500 scale-110">
              <span className="text-2xl">📊</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">البيانات</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-slate-700">
              <span className="text-2xl opacity-40">⚙️</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">الإعدادات</span>
           </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .glass-card { background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); backdrop-filter: blur(20px); }
        
        .ios-input { width: 100%; background: #000; border: 1px solid #1a1b23; border-radius: 14px; padding: 12px; text-align: center; font-size: 16px; outline: none; transition: all 0.2s; }
        .ios-input-active { width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px; text-align: center; font-size: 16px; color: #fff; font-weight: 900; outline: none; transition: all 0.3s; }
        .ios-input-active:focus { border-color: #3b82f6; transform: scale(1.05); box-shadow: 0 0 20px rgba(59,130,246,0.15); }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #000; margin: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}
