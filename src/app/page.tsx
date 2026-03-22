"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function Generator3DPro() {
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
    const savedFuel = localStorage.getItem('fuelData_v3');
    const savedKW = localStorage.getItem('kwData_v3');
    const savedStock = localStorage.getItem('fuelStock_v3');
    if (savedFuel) setFuelRows(JSON.parse(savedFuel));
    if (savedKW) setKwRows(JSON.parse(savedKW));
    if (savedStock) setInitialStock(savedStock);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('fuelData_v3', JSON.stringify(fuelRows));
      localStorage.setItem('kwData_v3', JSON.stringify(kwRows));
      localStorage.setItem('fuelStock_v3', initialStock);
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
    if (confirm("سيتم ترحيل البيانات وتصفير عدادات اليوم.. هل أنت متأكد؟")) {
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
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-4 md:p-8 font-sans overflow-x-hidden" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* Header 3D Section */}
        <div className="flex justify-between items-center p-6 bg-[#141820] rounded-[2rem] shadow-[10px_10px_20px_#050608,-5px_-5px_15px_#1c222d] border border-white/5">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">نظام الإدارة الذكي</h1>
            <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mt-1">GENERATOR MANAGEMENT SYSTEM v3.0</p>
          </div>
          <button 
            onClick={moveToTomorrow}
            className="relative group overflow-hidden bg-[#1a1f29] px-6 py-3 rounded-2xl font-black text-xs text-emerald-400 shadow-[5px_5px_10px_#050608,-2px_-2px_8px_#232b38] border border-emerald-500/20 active:shadow-inner active:scale-95 transition-all"
          >
            ترحيل البيانات ⏭️
          </button>
        </div>

        {/* 3D Fuel Card */}
        <div className="bg-[#141820] rounded-[2.5rem] shadow-[20px_20px_40px_#050608,-10px_-10px_30px_#1c222d] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-gradient-to-l from-blue-500/10 to-transparent">
            <h2 className="text-lg font-black text-blue-400 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              مراقبة صرف الكاز (Ltr)
            </h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="p-2">المولد</th>
                  <th className="p-2">القراءة السابقة</th>
                  <th className="p-2">القراءة الحالية</th>
                  <th className="p-2">صافي الصرف</th>
                </tr>
              </thead>
              <tbody>
                {fuelRows.map((row, idx) => (
                  <tr key={idx} className="group">
                    <td className="p-4 bg-[#0a0c10]/50 rounded-r-2xl font-black text-slate-400 border-y border-r border-white/5">{row.name}</td>
                    <td className="p-2 bg-[#0a0c10]/50 border-y border-white/5">
                      <input type="number" value={row.yesterday} onChange={(e)=>updateValue('fuel', idx, 'yesterday', e.target.value)} className="input-3d" placeholder="0" />
                    </td>
                    <td className="p-2 bg-[#0a0c10]/50 border-y border-white/5">
                      <input type="number" value={row.today} onChange={(e)=>updateValue('fuel', idx, 'today', e.target.value)} className="input-3d-active" placeholder="0" />
                    </td>
                    <td className="p-4 bg-[#0a0c10]/80 rounded-l-2xl border-y border-l border-white/5 text-center font-black text-xl text-emerald-400">
                      {totals.fuelSums[idx] > 0 ? totals.fuelSums[idx].toLocaleString() : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-blue-500/5 flex justify-between items-center border-t border-white/5">
            <span className="font-bold text-slate-400">المجموع الكلي:</span>
            <span className="text-3xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{totals.totalFuel.toLocaleString()} <small className="text-xs">لتر</small></span>
          </div>
        </div>

        {/* 3D KW Card */}
        <div className="bg-[#141820] rounded-[2.5rem] shadow-[20px_20px_40px_#050608,-10px_-10px_30px_#1c222d] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-gradient-to-l from-emerald-500/10 to-transparent">
            <h2 className="text-lg font-black text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block"></span>
              إنتاج الطاقة (kW)
            </h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="p-2">المولد</th>
                  <th className="p-2">القراءة السابقة</th>
                  <th className="p-2">القراءة الحالية</th>
                  <th className="p-2">صافي الإنتاج</th>
                </tr>
              </thead>
              <tbody>
                {kwRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-4 bg-[#0a0c10]/50 rounded-r-2xl font-black text-slate-400 border-y border-r border-white/5">{row.name}</td>
                    <td className="p-2 bg-[#0a0c10]/50 border-y border-white/5">
                      <input type="number" value={row.yesterday} onChange={(e)=>updateValue('kw', idx, 'yesterday', e.target.value)} className="input-3d" placeholder="0" />
                    </td>
                    <td className="p-2 bg-[#0a0c10]/50 border-y border-white/5">
                      <input type="number" value={row.today} onChange={(e)=>updateValue('kw', idx, 'today', e.target.value)} className="input-3d-active border-emerald-500/30 text-emerald-400" placeholder="0" />
                    </td>
                    <td className="p-4 bg-[#0a0c10]/80 rounded-l-2xl border-y border-l border-white/5 text-center font-black text-xl text-blue-400">
                      {totals.kwSums[idx] > 0 ? totals.kwSums[idx].toLocaleString() : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-emerald-500/5 flex justify-between items-center border-t border-white/5">
            <span className="font-bold text-slate-400">إجمالي الطاقة:</span>
            <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{totals.totalKW.toLocaleString()} <small className="text-xs">kW</small></span>
          </div>
        </div>

        {/* Footer 3D Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          <div className="bg-[#141820] p-8 rounded-[2.5rem] shadow-[15px_15px_30px_#050608,-8px_-8px_20px_#1c222d] border border-white/5 group">
            <span className="text-xs font-black text-slate-500 uppercase tracking-tighter mb-4 block">الخزين الاحتياطي المتوفر</span>
            <input 
              type="number" 
              value={initialStock} 
              onChange={(e)=>setInitialStock(e.target.value)} 
              className="w-full bg-[#0a0c10] shadow-inner border border-white/5 p-6 rounded-[1.5rem] text-4xl font-black text-blue-400 outline-none focus:ring-2 ring-blue-500/20 transition-all text-center" 
              placeholder="0" 
            />
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-[20px_20px_40px_rgba(0,0,0,0.4),inset_-5px_-5px_15px_rgba(0,0,0,0.2)] flex flex-col justify-center items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-blue-100 font-bold text-sm mb-2 opacity-80">صافي الوقود المتبقي</p>
            <p className="text-6xl font-black text-white tracking-tighter">
              {totals.remaining.toLocaleString()}
              <span className="text-sm font-light ml-2 opacity-60">Ltr</span>
            </p>
            <div className="mt-4 w-full h-2 bg-black/20 rounded-full overflow-hidden">
               <div className="h-full bg-white/40 shadow-[0_0_10px_white]" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-3d {
          width: 100%;
          background: #0d1117;
          border: 1px solid #1c222d;
          padding: 12px;
          border-radius: 15px;
          text-align: center;
          font-weight: 700;
          color: #64748b;
          box-shadow: inset 4px 4px 8px #050608, inset -2px -2px 5px #1c222d;
          outline: none;
          transition: all 0.3s;
        }
        .input-3d-active {
          width: 100%;
          background: #0d1117;
          border: 1px solid rgba(59,130,246,0.3);
          padding: 12px;
          border-radius: 15px;
          text-align: center;
          font-weight: 900;
          color: #3b82f6;
          box-shadow: 4px 4px 10px #050608, -2px -2px 8px #1c222d;
          outline: none;
          transition: all 0.3s;
        }
        .input-3d-active:focus {
          transform: translateY(-2px);
          box-shadow: 6px 6px 15px #050608, -2px -2px 10px #1c222d;
        }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}
