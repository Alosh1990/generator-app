"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function MobileAppGenerator() {
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
    const savedFuel = localStorage.getItem('app_fuel_v7');
    const savedKW = localStorage.getItem('app_kw_v7');
    const savedStock = localStorage.getItem('app_stock_v7');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('app_fuel_v7', JSON.stringify(fuelRows));
      localStorage.setItem('app_kw_v7', JSON.stringify(kwRows));
      localStorage.setItem('app_stock_v7', initialStock);
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
    <div className="min-h-screen bg-[#000] flex justify-center items-center font-['Inter',sans-serif]" dir="rtl">
      
      {/* Container - الهاتف الوهمي على اللابتوب */}
      <div className="w-full max-w-[430px] h-screen md:h-[880px] bg-[#0d0e12] relative md:rounded-[3rem] md:border-[8px] border-[#1f2128] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col">
        
        {/* شريط الساعة العلوي (iOS Style) */}
        <div className="h-10 w-full flex justify-between items-center px-8 pt-4 opacity-60 text-[12px] font-bold">
          <span>9:41</span>
          <div className="flex gap-1.5">
            <span>📶</span><span>🔋</span>
          </div>
        </div>

        {/* محتوى التطبيق القابل للتمرير */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-6 no-scrollbar">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">المولدات</h1>
              <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mt-1">التحكم الذكي</p>
            </div>
            <button 
              onClick={() => confirm("ترحيل؟") && setFuelRows(fuelRows.map(r=>({...r, yesterday:r.today, today:''})))}
              className="bg-blue-600 text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-blue-500/20 active:scale-90 transition-all text-white"
            >
              ترحيل البيانات
            </button>
          </div>

          {/* Main Card - الخزين المتبقي */}
          <div className="bg-gradient-to-br from-[#1a1c24] to-[#0d0e12] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">الخزين المتبقي (لتر)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white tracking-tighter tabular-nums">
                {totals.remaining.toLocaleString()}
              </span>
              <span className="text-blue-500 font-bold text-sm italic">Ltr</span>
            </div>
            <input 
              type="number" 
              value={initialStock} 
              onChange={(e)=>setInitialStock(e.target.value)}
              placeholder="تحديث الخزين الرئيسي..."
              className="mt-6 w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-center text-sm font-bold text-blue-400 outline-none focus:border-blue-500/30 transition-all"
            />
          </div>

          {/* عدادات الوقود */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">قراءات الوقود</h2>
            </div>
            {fuelRows.map((row, idx) => (
              <div key={idx} className="bg-[#16181f] p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 group transition-all hover:bg-[#1c1f29]">
                <span className="w-12 text-[10px] font-black text-slate-600 uppercase italic">{row.name}</span>
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('f', idx, 'yesterday', e.target.value)} className="app-input" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('f', idx, 'today', e.target.value)} className="app-input-active" placeholder="يوم" />
                <div className="w-14 text-center font-black text-emerald-400 text-lg">
                  {totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}
                </div>
              </div>
            ))}
          </section>

          {/* عدادات الطاقة */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">إنتاج الطاقة</h2>
            </div>
            {kwRows.map((row, idx) => (
              <div key={idx} className="bg-[#16181f] p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 group transition-all hover:bg-[#1c1f29]">
                <span className="w-12 text-[10px] font-black text-slate-600 uppercase italic">{row.name}</span>
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('k', idx, 'yesterday', e.target.value)} className="app-input" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('k', idx, 'today', e.target.value)} className="app-input-active !border-purple-500/20" placeholder="يوم" />
                <div className="w-14 text-center font-black text-blue-400 text-lg">
                  {totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}
                </div>
              </div>
            ))}
          </section>

        </div>

        {/* Bottom Navigation Bar (iOS Style) */}
        <div className="h-20 bg-[#0d0e12]/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-10">
          <div className="flex flex-col items-center gap-1 text-blue-500">
             <span className="text-xl">📊</span>
             <span className="text-[9px] font-bold">الإحصائيات</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-slate-600">
             <span className="text-xl">⚙️</span>
             <span className="text-[9px] font-bold">الإعدادات</span>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .app-input {
          width: 100%; background: #000; border: 1px solid #222; border-radius: 12px; padding: 10px;
          text-align: center; font-size: 14px; color: #444; outline: none;
        }
        
        .app-input-active {
          width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px;
          text-align: center; font-size: 14px; color: #fff; font-weight: bold; outline: none;
          transition: all 0.3s;
        }
        
        .app-input-active:focus {
          border-color: #3b82f6;
          background: #0d0e12;
          box-shadow: 0 0 15px rgba(59,130,246,0.1);
        }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
          -webkit-appearance: none; margin: 0;
        }

        body { background-color: #000; margin: 0; overflow: hidden; }
      `}</style>

    </div>
  );
}
