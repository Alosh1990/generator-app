"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaSystem() {
  const [mounted, setMounted] = useState(false);
  const [stockBefore, setStockBefore] = useState('26820'); 
  
  const [fuelRows, setFuelRows] = useState([
    { id: 1, name: 'CAT 1', yest: '732942', today: '733835' },
    { id: 2, name: 'CAT 2', yest: '757151', today: '758214' },
    { id: 3, name: 'CAT 3', yest: '664490', today: '665588' },
  ]);

  const [kwRows, setKwRows] = useState([
    { id: 1, name: 'CAT 1', yest: '2661561', today: '2664809' },
    { id: 2, name: 'CAT 2', yest: '2693445', today: '2697404' },
    { id: 3, name: 'CAT 3', yest: '1541614', today: '1545662' },
  ]);

  useEffect(() => { setMounted(true); }, []);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const kDiffs = kwRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);
    return { fDiffs, kDiffs, totalFuel, totalKW, current: (Number(stockBefore) || 0) - totalFuel };
  }, [stockBefore, fuelRows, kwRows]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans" dir="rtl">
      <div className="max-w-xl mx-auto space-y-8 pb-10">
        
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold italic">رُكبة PRO</h1>
          <button 
            onClick={() => confirm("ترحيل البيانات؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''}))))}
            className="bg-blue-600 px-4 py-2 rounded font-bold text-xs"
          >
            ترحيل البيانات ⏭️
          </button>
        </div>

        {/* جدول الكاز */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-blue-400">📊 جدول صرف الكاز</h2>
          <table className="w-full text-center border border-zinc-800">
            <thead className="bg-zinc-900 text-xs text-zinc-400">
              <tr>
                <th className="p-3 border border-zinc-800">المولدة</th>
                <th className="p-3 border border-zinc-800">عداد الأمس</th>
                <th className="p-3 border border-zinc-800">عداد اليوم</th>
                <th className="p-3 border border-zinc-800 bg-zinc-800 text-white">الصرف</th>
              </tr>
            </thead>
            <tbody>
              {fuelRows.map((row, i) => (
                <tr key={row.id} className="border-b border-zinc-800">
                  <td className="p-3 font-bold bg-zinc-900/50">{row.name}</td>
                  <td className="p-2"><input type="number" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="bg-transparent w-full text-center outline-none" /></td>
                  <td className="p-2"><input type="number" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="bg-transparent w-full text-center outline-none" /></td>
                  <td className="p-3 font-black text-xl text-emerald-400">{stats.fDiffs[i]}</td>
                </tr>
              ))}
              <tr className="bg-zinc-900">
                <td colSpan={3} className="p-3 font-bold text-left">المجموع الكلي:</td>
                <td className="p-3 font-black text-2xl text-blue-500">{stats.totalFuel}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* جدول الكهرباء */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-yellow-500">⚡ جدول الكيلو واط</h2>
          <table className="w-full text-center border border-zinc-800">
            <thead className="bg-zinc-900 text-xs text-zinc-400">
              <tr>
                <th className="p-3 border border-zinc-800">المولدة</th>
                <th className="p-3 border border-zinc-800">عداد الأمس</th>
                <th className="p-3 border border-zinc-800">عداد اليوم</th>
                <th className="p-3 border border-zinc-800 bg-zinc-800 text-white">الإنتاج</th>
              </tr>
            </thead>
            <tbody>
              {kwRows.map((row, i) => (
                <tr key={row.id} className="border-b border-zinc-800">
                  <td className="p-3 font-bold bg-zinc-900/50">{row.name}</td>
                  <td className="p-2"><input type="number" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} className="bg-transparent w-full text-center outline-none" /></td>
                  <td className="p-2"><input type="number" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} className="bg-transparent w-full text-center outline-none" /></td>
                  <td className="p-3 font-black text-xl text-yellow-400">{stats.kDiffs[i]}</td>
                </tr>
              ))}
              <tr className="bg-zinc-900">
                <td colSpan={3} className="p-3 font-bold text-left">مجموع الإنتاج:</td>
                <td className="p-3 font-black text-2xl text-yellow-500">{stats.totalKW.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* الخلاصة النهائية */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-bold">الخزين قبل الصرف:</span>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} className="bg-black border border-zinc-700 px-4 py-2 rounded text-left w-32 font-bold text-xl" />
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
            <span className="text-zinc-400 font-bold">الخزين المتبقي (الصافي):</span>
            <span className="text-4xl font-black text-emerald-400">{stats.current.toLocaleString()} لتر 👍</span>
          </div>
        </div>

      </div>
    </div>
  );
}
