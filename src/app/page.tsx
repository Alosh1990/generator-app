"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function GeneratorApp() {
  const [mounted, setMounted] = useState(false);
  const [fuelRows, setFuelRows] = useState([{ name: 'CAT 1', yesterday: '', today: '' }, { name: 'CAT 2', yesterday: '', today: '' }, { name: 'CAT 3', yesterday: '', today: '' }]);
  const [kwRows, setKwRows] = useState([{ name: 'CAT 1', yesterday: '', today: '' }, { name: 'CAT 2', yesterday: '', today: '' }, { name: 'CAT 3', yesterday: '', today: '' }]);
  const [initialStock, setInitialStock] = useState('');

  useEffect(() => {
    setMounted(true);
    const savedFuel = localStorage.getItem('f');
    const savedKW = localStorage.getItem('k');
    const savedStock = localStorage.getItem('s');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('f', JSON.stringify(fuelRows));
      localStorage.setItem('k', JSON.stringify(kwRows));
      localStorage.setItem('s', initialStock);
    }
  }, [fuelRows, kwRows, initialStock, mounted]);

  const update = (t: 'f' | 'k', i: number, f: 'y' | 't', v: string) => {
    if (t === 'f') { const n = [...fuelRows]; n[i][f === 'y' ? 'yesterday' : 'today'] = v; setFuelRows(n); }
    else { const n = [...kwRows]; n[i][f === 'y' ? 'yesterday' : 'today'] = v; setKwRows(n); }
  };

  const totals = useMemo(() => {
    const fSum = fuelRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const kSum = kwRows.map(r => (parseFloat(r.today) || 0) - (parseFloat(r.yesterday) || 0));
    const tF = fSum.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    const tK = kSum.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    return { fSum, kSum, tF, tK, rem: (parseFloat(initialStock) || 0) - tF };
  }, [fuelRows, kwRows, initialStock]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans text-right" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h1 className="text-xl font-black text-blue-500">نظام العدادات الاحترافي</h1>
          <button onClick={() => { if(confirm("ترحيل الأرقام؟")){ setInitialStock(totals.rem.toString()); setFuelRows(fuelRows.map(r=>({...r, yesterday:r.today, today:''}))); setKwRows(kwRows.map(r=>({...r, yesterday:r.today, today:''}))); } }} className="bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold">ترحيل للغد ⏭️</button>
        </div>

        {/* جدول الكاز */}
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-3 bg-blue-600/10 text-blue-400 font-bold text-sm">📋 صرف الكاز (لتر)</div>
          <table className="w-full text-center text-sm">
            <thead className="bg-white/5 text-slate-500">
              <tr><th className="p-3">CAT</th><th className="p-3">الأمس</th><th className="p-3">اليوم</th><th className="p-3 text-emerald-400">الصرف</th></tr>
            </thead>
            <tbody>
              {fuelRows.map((r, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="p-3 font-bold">{r.name}</td>
                  <td><input type="number" value={r.yesterday} onChange={e=>update('f', i, 'y', e.target.value)} className="w-20 bg-black border border-white/10 p-1 rounded text-center" /></td>
                  <td><input type="number" value={r.today} onChange={e=>update('f', i, 't', e.target.value)} className="w-20 bg-black border border-blue-500/30 p-1 rounded text-center" /></td>
                  <td className="text-emerald-400 font-bold">{totals.fSum[i] > 0 ? totals.fSum[i] : 0}</td>
                </tr>
              ))}
              <tr className="bg-white/5 font-bold">
                <td colSpan={3} className="p-3 text-left">الإجمالي:</td>
                <td className="p-3 text-emerald-400 text-lg">{totals.tF} لتر</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* جدول الكيلو واط */}
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-3 bg-emerald-600/10 text-emerald-400 font-bold text-sm">⚡ صرف الكيلو واط (kW)</div>
          <table className="w-full text-center text-sm">
            <thead className="bg-white/5 text-slate-500">
              <tr><th className="p-3">CAT</th><th className="p-3">الأمس</th><th className="p-3">اليوم</th><th className="p-3 text-blue-400">الصرف</th></tr>
            </thead>
            <tbody>
              {kwRows.map((r, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="p-3 font-bold">{r.name}</td>
                  <td><input type="number" value={r.yesterday} onChange={e=>update('k', i, 'y', e.target.value)} className="w-20 bg-black border border-white/10 p-1 rounded text-center" /></td>
                  <td><input type="number" value={r.today} onChange={e=>update('k', i, 't', e.target.value)} className="w-20 bg-black border border-emerald-500/30 p-1 rounded text-center" /></td>
                  <td className="text-blue-400 font-bold">{totals.kSum[i] > 0 ? totals.kSum[i] : 0}</td>
                </tr>
              ))}
              <tr className="bg-white/5 font-bold">
                <td colSpan={3} className="p-3 text-left">الإجمالي:</td>
                <td className="p-3 text-blue-400 text-lg">{totals.tK} kW</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* المخزون */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111] p-4 rounded-2xl border border-white/5 shadow-xl">
            <span className="text-[10px] text-slate-500 block mb-1">الخزين الكلي</span>
            <input type="number" value={initialStock} onChange={e=>setInitialStock(e.target.value)} className="w-full bg-black border border-blue-500/20 p-2 rounded text-xl text-blue-400 font-bold outline-none" />
          </div>
          <div className="bg-blue-600 p-4 rounded-2xl text-center">
            <p className="text-[10px] text-blue-200">المتبقي</p>
            <p className="text-2xl font-black">{totals.rem.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
