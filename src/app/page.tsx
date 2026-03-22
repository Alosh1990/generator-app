"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorProDashboard() {
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
    const savedFuel = localStorage.getItem('f_v2');
    const savedKW = localStorage.getItem('k_v2');
    const savedStock = localStorage.getItem('s_v2');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('f_v2', JSON.stringify(fuelRows));
      localStorage.setItem('k_v2', JSON.stringify(kwRows));
      localStorage.setItem('s_v2', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const update = (type: 'f' | 'k', idx: number, field: 'y' | 't', val: string) => {
    if (type === 'f') {
      const newRows = [...fuelRows];
      newRows[idx][field === 'y' ? 'yesterday' : 'today'] = val;
      setFuelRows(newRows);
    } else {
      const newRows = [...kwRows];
      newRows[idx][field === 'y' ? 'yesterday' : 'today'] = val;
      setKwRows(newRows);
    }
  };

  const totals = useMemo(() => {
    const fDiffs = fuelRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const kDiffs = kwRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const totalF = fDiffs.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const totalK = kDiffs.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const remain = (parseFloat(initialStock) || 0) - totalF;
    return { fDiffs, kDiffs, totalF, totalK, remain };
  }, [fuelRows, kwRows, initialStock]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-blue-500/30" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#161920]/80 backdrop-blur-md border-b border-white/5 p-4 shadow-xl">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black bg-gradient-to-l from-blue-400 to-cyan-300 bg-clip-text text-transparent">نظام المولدات</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Smart Management v2.0</p>
          </div>
          <button 
            onClick={() => { if(confirm("هل تريد ترحيل البيانات للغد؟")) {
              setInitialStock(totals.remain.toString());
              setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' })));
              setKwRows(kwRows.map(r => ({ ...r, yesterday: r.today, today: '' })));
            }}}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 active:scale-95 transition-all px-4 py-2 rounded-xl text-white text-xs font-black shadow-lg shadow-emerald-900/20"
          >
            ترحيل للغد ⏭️
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6 pb-20">
        
        {/* Fuel Card */}
        <section className="bg-[#1c212c] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600/20 to-transparent p-4 border-b border-white/5 flex justify-between items-center">
            <span className="text-blue-400 font-black text-sm">⛽ عدادات الكاز (لتر)</span>
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">LITERS</span>
          </div>
          <div className="p-2">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase">
                  <th className="p-3 text-right">المولد</th>
                  <th className="p-3">الأمس</th>
                  <th className="p-3">اليوم</th>
                  <th className="p-3">الصرف</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {fuelRows.map((r, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-3 font-bold text-slate-400">{r.name}</td>
                    <td className="p-1"><input type="number" value={r.yesterday} onChange={e=>update('f', i, 'y', e.target.value)} className="w-full bg-[#0f1115] border border-white/5 p-2 rounded-lg text-center outline-none focus:border-blue-500/50 transition-colors" placeholder="0" /></td>
                    <td className="p-1"><input type="number" value={r.today} onChange={e=>update('f', i, 't', e.target.value)} className="w-full bg-[#0f1115] border border-blue-500/20 p-2 rounded-lg text-center outline-none focus:border-blue-500 transition-colors text-blue-400 font-bold" placeholder="0" /></td>
                    <td className="p-3 text-center font-black text-emerald-400">{totals.fDiffs[i] > 0 ? totals.fDiffs[i] : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 mt-2 bg-blue-500/5 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">إجمالي الصرف:</span>
              <span className="text-xl font-black text-blue-400">{totals.totalF.toLocaleString()} <small className="text-[10px]">لتر</small></span>
            </div>
          </div>
        </section>

        {/* KW Card */}
        <section className="bg-[#1c212c] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="bg-gradient-to-r from-amber-600/20 to-transparent p-4 border-b border-white/5 flex justify-between items-center">
            <span className="text-amber-400 font-black text-sm">⚡ كيلو واط (kW)</span>
            <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold">POWER</span>
          </div>
          <div className="p-2">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase">
                  <th className="p-3 text-right">المولد</th>
                  <th className="p-3">الأمس</th>
                  <th className="p-3">اليوم</th>
                  <th className="p-3">الإنتاج</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {kwRows.map((r, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-3 font-bold text-slate-400">{r.name}</td>
                    <td className="p-1"><input type="number" value={r.yesterday} onChange={e=>update('k', i, 'y', e.target.value)} className="w-full bg-[#0f1115] border border-white/5 p-2 rounded-lg text-center outline-none focus:border-amber-500/50 transition-colors" placeholder="0" /></td>
                    <td className="p-1"><input type="number" value={r.today} onChange={e=>update('k', i, 't', e.target.value)} className="w-full bg-[#0f1115] border border-amber-500/20 p-2 rounded-lg text-center outline-none focus:border-amber-500 transition-colors text-amber-400 font-bold" placeholder="0" /></td>
                    <td className="p-3 text-center font-black text-blue-400">{totals.kDiffs[i] > 0 ? totals.kDiffs[i] : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 mt-2 bg-amber-500/5 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">إجمالي الطاقة:</span>
              <span className="text-xl font-black text-amber-400">{totals.totalK.toLocaleString()} <small className="text-[10px]">kW</small></span>
            </div>
          </div>
        </section>

        {/* Stock & Remaining */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#1c212c] p-6 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
             <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">خزين الكاز المتوفر الآن</label>
             <input 
               type="number" 
               value={initialStock} 
               onChange={e=>setInitialStock(e.target.value)} 
               className="w-full bg-[#0f1115] border-2 border-blue-500/20 focus:border-blue-500 p-4 rounded-2xl text-3xl font-black text-blue-400 outline-none transition-all shadow-inner" 
               placeholder="0"
             />
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2rem] shadow-2xl shadow-blue-900/40 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">المتبقي الصافي</p>
              <p className="text-4xl font-black text-white mt-1">{totals.remain.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">⛽</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center p-8 text-slate-600 text-[10px] font-bold">
        DESIGNED FOR FIELD OPERATIONS • 2026
      </footer>

      <style jsx global>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { background-color: #0f1115; }
      `}</style>
    </div>
  );
}
