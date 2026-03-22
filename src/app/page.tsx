"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorMobileOptimized() {
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
    // استرجاع البيانات
    const savedFuel = localStorage.getItem('fuel_v_mobile');
    const savedKW = localStorage.getItem('kw_v_mobile');
    const savedStock = localStorage.getItem('stock_v_mobile');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuel_v_mobile', JSON.stringify(fuelRows));
      localStorage.setItem('kw_v_mobile', JSON.stringify(kwRows));
      localStorage.setItem('stock_v_mobile', initialStock);
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
    <div className="min-h-screen bg-[#0d0f14] text-white p-4 font-sans" dir="rtl">
      
      {/* ستايل مخصص لضمان استجابة الموبايل */}
      <style jsx global>{`
        html, body { 
          max-width: 100vw; 
          overflow-x: hidden; 
          background: #0d0f14; 
          touch-action: manipulation; /* يحسن سرعة الاستجابة للمس */
        }
        .mobile-card {
          background: rgba(25, 28, 38, 0.95); /* لون أغمق وأوضح للموبايل */
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          padding: 20px;
          margin-bottom: 20px;
        }
        .input-3d {
          background: #000 !important;
          border: 1px solid #222 !important;
          border-radius: 12px !important;
          color: #fff !important;
          height: 45px;
          text-align: center;
          font-size: 16px !important; /* حجم خط مثالي للموبايل لمنع الـ Zoom التلقائي */
          width: 100%;
        }
        .btn-action {
          background: #2563eb;
          padding: 12px;
          border-radius: 15px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }
      `}</style>

      <div className="max-w-md mx-auto">
        
        <header className="flex justify-between items-center mb-6 pt-4">
          <h1 className="text-xl font-black text-blue-400 italic">GENERATOR PRO</h1>
          <button 
            onClick={() => confirm("ترحيل؟") && setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' })))}
            className="btn-action text-xs"
          >
            ترحيل البيانات
          </button>
        </header>

        {/* كارت الوقود */}
        <div className="mobile-card">
          <h2 className="text-blue-400 font-bold mb-4 flex items-center gap-2 text-sm">
            <span className="w-2 h-4 bg-blue-500 rounded-full"></span> عدادات الكاز
          </h2>
          {fuelRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 items-center mb-3 bg-black/20 p-2 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-3d col-span-1" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-3d col-span-1 border-blue-500/50" placeholder="يوم" />
              <span className="text-emerald-400 font-black text-center">{totals.fSums[idx] > 0 ? totals.fSums[idx] : 0}</span>
            </div>
          ))}
        </div>

        {/* كارت الطاقة */}
        <div className="mobile-card">
          <h2 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 text-sm">
            <span className="w-2 h-4 bg-cyan-500 rounded-full"></span> عدادات الطاقة
          </h2>
          {kwRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 items-center mb-3 bg-black/20 p-2 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{row.name}</span>
              <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-3d" placeholder="أمس" />
              <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-3d border-cyan-500/50" placeholder="يوم" />
              <span className="text-cyan-400 font-black text-center">{totals.kSums[idx] > 0 ? totals.kSums[idx] : 0}</span>
            </div>
          ))}
        </div>

        {/* كارت المتبقي الكبير */}
        <div className="mobile-card bg-gradient-to-br from-blue-600 to-blue-900 border-none">
          <p className="text-xs font-bold text-blue-100 mb-2">الخزين المتبقي الصافي</p>
          <div className="flex justify-between items-end">
             <h3 className="text-5xl font-black tracking-tighter">{totals.remaining.toLocaleString()}</h3>
             <span className="text-xs mb-2 opacity-70">LITERS</span>
          </div>
          <input 
            type="number" 
            value={initialStock} 
            onChange={(e)=>setInitialStock(e.target.value)} 
            className="mt-4 w-full bg-white/10 border border-white/20 p-3 rounded-xl text-center font-bold placeholder:text-blue-200"
            placeholder="تحديث الخزين الرئيسي"
          />
        </div>

      </div>
    </div>
  );
}
