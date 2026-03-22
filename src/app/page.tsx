"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorFinalSystem() {
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
    const savedFuel = localStorage.getItem('fuelData');
    const savedKW = localStorage.getItem('kwData');
    const savedStock = localStorage.getItem('fuelStock');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuelData', JSON.stringify(fuelRows));
      localStorage.setItem('kwData', JSON.stringify(kwRows));
      localStorage.setItem('fuelStock', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const updateValue = (type: 'fuel' | 'kw', index: number, field: 'yesterday' | 'today', val: string) => {
    if (type === 'fuel') {
      const updated = [...fuelRows];
      updated[index][field] = val;
      setFuelRows(updated);
    } else {
      const updated = [...kwRows];
      updated[index][field] = val;
      setKwRows(updated);
    }
  };

  const moveToTomorrow = () => {
    if (confirm("هل تريد ترحيل أرقام اليوم لتصبح أرقام الأمس؟")) {
      const newInitialStock = totals.remaining.toString();
      setFuelRows(fuelRows.map(r => ({ ...r, yesterday: r.today, today: '' })));
      setKwRows(kwRows.map(r => ({ ...r, yesterday: r.today, today: '' })));
      setInitialStock(newInitialStock);
    }
  };

  const totals = useMemo(() => {
    const fuelSums = fuelRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const totalFuel = fuelSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const kwSums = kwRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const totalKW = kwSums.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const remaining = (parseFloat(initialStock) || 0) - totalFuel;
    return { fuelSums, totalFuel, kwSums, totalKW, remaining };
  }, [fuelRows, kwRows, initialStock]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8 text-right">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-black text-blue-500 underline decoration-blue-900 underline-offset-8">نظام العدادات الاحترافي</h1>
          <button onClick={moveToTomorrow} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95 text-sm">
            ترحيل البيانات للغد ⏭️
          </button>
        </div>

        {/* جدول الكاز */}
        <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-4 bg-blue-600/10 text-blue-400 font-bold border-b border-white/5">📋 جدول صرف الكاز (لتر)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-center min-w-[400px]">
              <thead className="bg-white/5 text-slate-500 text-xs">
                <tr>
                  <th className="p-4">CAT (كتر)</th>
                  <th className="p-4">عداد الأمس</th>
                  <th className="p-4 text-blue-400">عداد اليوم</th>
                  <th className="p-4 text-emerald-400">الصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold">
                {fuelRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-4 text-slate-300 font-black">{row.name}</td>
                    <td className="p-4"><input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-field" placeholder="0" /></td>
                    <td className="p-4"><input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-field border-blue-500/30" placeholder="0" /></td>
                    <td className="p-4 text-xl text-emerald-400">{totals.fuelSums[idx] > 0 ? totals.fuelSums[idx].toLocaleString() : 0}</td>
                  </tr>
                ))}
                <tr className="bg-white/5 font-black text-xl border-t-2 border-white/10">
                  <td colSpan={3} className="p-5 text-left pr-10 text-slate-400">إجمالي صرف الكاز:</td>
                  <td className="p-5 text-emerald-500">{totals.totalFuel.toLocaleString()} لتر</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* جدول الكيلو واط */}
        <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-4 bg-emerald-600/10 text-emerald-400 font-bold border-b border-white/5">⚡ جدول صرف الكيلو واط (kW)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-center min-w-[400px]">
              <thead className="bg-white/5 text-slate-500 text-xs">
                <tr>
                  <th className="p-4">CAT (كتر)</th>
                  <th className="p-4">عداد الأمس</th>
                  <th className="p-4 text-emerald-400">عداد اليوم</th>
                  <th className="p-4 text-blue-400">الصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold">
                {kwRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-4 text-slate-300 font-black">{row.name}</td>
                    <td className="p-4"><input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-field" placeholder="0" /></td>
                    <td className="p-4"><input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-field border-emerald-500/30" placeholder="0" /></td>
                    <td className="p-4 text-xl text-blue-400">{totals.kwSums[idx] > 0 ? totals.kwSums[idx].toLocaleString() : 0}</td>
                  </tr>
                ))}
                <tr className="bg-white/5 font-black text-xl border-t-2 border-white/10">
                  <td colSpan={3} className="p-5 text-left pr-10 text-slate-400">إجمالي صرف الطاقة:</td>
                  <td className="p-5 text-blue-500">{totals.totalKW.toLocaleString()} kW</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* المخزون */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-3 shadow-xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mr-2">خزين الكاز المتوفر (لتر)</span>
            <input type="number" value={initialStock} onChange={(e)=>setInitialStock(e.target.value)} className="w-full bg-black border border-blue-500/30 p-5 rounded-2xl text-3xl font-black text-blue-400 outline-none focus:border-blue-500" placeholder="0" />
          </div>
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-center shadow-2xl shadow-blue-900/20">
            <p className="text-xs font-bold text-blue-200 mb-2">المتبقي الصافي في الخزان</p>
            <p className="text-5xl font-black">{totals.remaining.toLocaleString()} <span className="text-sm font-normal opacity-70">لتر</span></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          background: #000;
          border: 1px solid #222;
          padding: 10px;
          border-radius: 12px;
          text-align: center;
          font-weight: 800;
          color: white;
          outline: none;
        }
        .input-field:focus { border-color: #3b82f6; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}
