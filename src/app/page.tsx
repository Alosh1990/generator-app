"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorMobilePro() {
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
    const savedFuel = localStorage.getItem('v11_fuel');
    const savedKW = localStorage.getItem('v11_kw');
    const savedStock = localStorage.getItem('v11_stock');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('v11_fuel', JSON.stringify(fuelRows));
      localStorage.setItem('v11_kw', JSON.stringify(kwRows));
      localStorage.setItem('v11_stock', initialStock);
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
    <div className="min-h-screen bg-[#050608] text-white flex justify-center items-start" dir="rtl">
      
      {/* هذا القسم يضمن أن العرض على الموبايل يكون 100% وبدون فراغات سوداء كبيرة */}
      <div className="w-full max-w-[500px] min-h-screen bg-[#090a0f] p-6 pb-20 shadow-2xl flex flex-col gap-8">
        
        {/* Header - كبير وواضح */}
        <div className="flex justify-between items-center py-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-black text-white italic">قمرة القيادة</h1>
            <p className="text-blue-500 text-[10px] font-bold tracking-widest uppercase">Generator Control</p>
          </div>
          <button 
            onClick={() => confirm("هل تريد ترحيل البيانات؟") && setFuelRows(fuelRows.map(r=>({...r, yesterday:r.today, today:''})))}
            className="bg-blue-600 px-5 py-2 rounded-xl text-xs font-bold active:scale-90 transition-all shadow-lg shadow-blue-600/20"
          >
            ترحيل ⏭️
          </button>
        </div>

        {/* الكارت الرئيسي - الخزين المتبقي */}
        <div className="bg-gradient-to-br from-[#12141c] to-[#0d0e12] p-8 rounded-[2rem] border border-white/5 shadow-xl text-center">
          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">الخزين المتبقي (لتر)</p>
          <div className="text-6xl font-black text-white tracking-tighter mb-6">
            {totals.remaining.toLocaleString()}
          </div>
          <input 
            type="number" 
            value={initialStock} 
            onChange={(e)=>setInitialStock(e.target.value)}
            placeholder="أدخل الكمية الكلية..."
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-center text-lg font-bold text-blue-400 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* عدادات الكاز */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-sm font-bold text-slate-400">⛽ استهلاك الكاز</h2>
            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black">+{totals.totalF}</span>
          </div>
          {fuelRows.map((row, idx) => (
            <div key={idx} className="bg-[#11131a] p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <span className="w-12 text-[10px] font-black text-blue-300 italic">{row.name}</span>
              <div className="flex-1 flex gap-2">
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('f', idx, 'yesterday', e.target.value)} className="mobile-input" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('f', idx, 'today', e.target.value)} className="mobile-input-active" placeholder="اليوم" />
              </div>
              <div className="w-12 text-center font-black text-emerald-400 text-lg">
                {totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}
              </div>
            </div>
          ))}
        </div>

        {/* عدادات الطاقة */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-sm font-bold text-slate-400">⚡ إنتاج الطاقة</h2>
            <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black">+{totals.totalK}</span>
          </div>
          {kwRows.map((row, idx) => (
            <div key={idx} className="bg-[#11131a] p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <span className="w-12 text-[10px] font-black text-purple-300 italic">{row.name}</span>
              <div className="flex-1 flex gap-2">
                <input type="number" value={row.yesterday} onChange={(e)=>updateValue('k', idx, 'yesterday', e.target.value)} className="mobile-input" placeholder="أمس" />
                <input type="number" value={row.today} onChange={(e)=>updateValue('k', idx, 'today', e.target.value)} className="mobile-input-active border-purple-500/20" placeholder="اليوم" />
              </div>
              <div className="w-12 text-center font-black text-blue-400 text-lg">
                {totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx global>{`
        /* أهم جزء لمنع الخطوط الصغيرة في الموبايل */
        html, body { 
          margin: 0; padding: 0; width: 100%; overflow-x: hidden; 
          background-color: #050608; font-family: sans-serif;
        }

        .mobile-input {
          width: 100%; background: #000; border: 1px solid #1a1b23; border-radius: 10px;
          padding: 10px; text-align: center; font-size: 16px; color: #555; outline: none;
        }

        .mobile-input-active {
          width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 10px; text-align: center; font-size: 16px; color: #fff; font-weight: 700; outline: none;
        }

        .mobile-input-active:focus { border-color: #3b82f6; }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
          -webkit-appearance: none; margin: 0;
        }

        /* منع التكبير التلقائي المزعج عند الضغط على الحقول في الايفون */
        @media screen and (max-width: 768px) {
          input { font-size: 16px !important; }
        }
      `}</style>

    </div>
  );
}
