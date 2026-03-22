"use client";
import React, { useState, useEffect, useMemo } from 'react';

// --- مكون الأيقونة الزجاجية ---
const IconBox = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 mb-2 shadow-inner`}>
    {children}
  </div>
);

export default function RakbaProfessionalV3() {
  const [mounted, setMounted] = useState(false);
  const [stockBefore, setStockBefore] = useState('26820'); 
  const [fuelRows, setFuelRows] = useState([
    { id: 1, name: 'CAT 1', yest: '', today: '' },
    { id: 2, name: 'CAT 2', yest: '', today: '' },
    { id: 3, name: 'CAT 3', yest: '', today: '' },
  ]);

  // التحميل الآمن للبيانات
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('rakba_v3_stable');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.s) setStockBefore(parsed.s);
        if (parsed.fr) setFuelRows(parsed.fr);
      } catch (e) { console.error("Storage Error", e); }
    }
  }, []);

  // الحفظ التلقائي
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v3_stable', JSON.stringify({ s: stockBefore, fr: fuelRows }));
    }
  }, [stockBefore, fuelRows, mounted]);

  // الحسابات الرياضية
  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    return { fDiffs, totalFuel, current: (Number(stockBefore) || 0) - totalFuel };
  }, [stockBefore, fuelRows]);

  // دالة ترحيل البيانات (منفصلة لتجنب أخطاء البناء)
  const handleMigration = () => {
    if (confirm("هل تريد ترحيل البيانات؟")) {
      setFuelRows(fuelRows.map(r => ({ ...r, yest: r.today, today: '' })));
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-200 p-4 font-sans antialiased selection:bg-blue-500/30" dir="rtl">
      <style jsx global>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 2rem; }
        .neo-input { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; transition: 0.3s; color: white; text-align: center; }
        .neo-input:focus { border-color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); outline: none; }
      `}</style>

      <div className="max-w-[480px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end px-2 pt-4">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-blue-600">رُكبة PRO</h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Control Center v3.0</p>
          </div>
          <button onClick={handleMigration} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl text-[11px] font-black shadow-lg shadow-blue-900/20 active:scale-95 transition-all">ترحيل ⏭️</button>
        </div>

        {/* الخزين المتبقي - ثلاثي الأبعاد */}
        <div className="glass-card p-10 text-center shadow-2xl relative border-t border-white/10 ring-1 ring-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full"></div>
          <p className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">المتبقي الفعلي (لتر)</p>
          <div className="text-8xl font-black text-white mb-8 tracking-tighter tabular-nums drop-shadow-2xl">
            {stats.current.toLocaleString()}
          </div>
          <div className="relative group">
            <span className="absolute -top-2 right-4 bg-[#08090d] px-2 text-[9px] text-blue-500 font-bold uppercase">تعديل الخزين الكلي</span>
            <input 
              type="number" value={stockBefore} onChange={(e) => setStockBefore(e.target.value)}
              className="w-full neo-input p-5 text-2xl font-black group-hover:border-blue-500/50"
            />
          </div>
        </div>

        {/* الإجماليات بجانب بعضها */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 flex flex-col items-center border-b-4 border-emerald-500/30">
            <IconBox color="emerald">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 00.547 1.022l1.168 1.168a2 2 0 001.022.547l2.387.477a6 6 0 003.86-.517l.642-.316a6 6 0 013.86-.517l2.388.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-.547-1.022l-1.168-1.168z" /></svg>
            </IconBox>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">إجمالي الصرف</p>
            <p className="text-3xl font-black text-emerald-400 tabular-nums">{stats.totalFuel}</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center border-b-4 border-yellow-500/30 opacity-80">
            <IconBox color="yellow">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3V1L4 12H11V19L18 8H11V3Z" /></svg>
            </IconBox>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">الكيلو واط</p>
            <p className="text-3xl font-black text-yellow-400 tabular-nums">0</p>
          </div>
        </div>

        {/* قسم المولدات - تصميم فخم */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 px-3">
            <div className="h-[1px] flex-1 bg-white/5"></div>
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">عدادات المولدات</h2>
            <div className="h-[1px] flex-1 bg-white/5"></div>
          </div>
          
          {fuelRows.map((row, i) => (
            <div key={row.id} className="glass-card p-5 flex items-center gap-4 hover:bg-white/[0.05] transition-all group">
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex-none group-hover:border-blue-500/30 transition-colors">
                <span className="text-[9px] font-black text-blue-500 leading-none mb-1">UNIT</span>
                <span className="text-lg font-black text-white italic">{row.name.split(' ')[1] || row.id}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-slate-600 pr-1 uppercase">قراءة أمس</span>
                  <input type="number" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="neo-input w-full p-3 text-sm font-bold text-slate-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-emerald-500 pr-1 uppercase">قراءة اليوم</span>
                  <input type="number" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="neo-input w-full p-3 text-sm font-black border-emerald-500/20" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-16 border-r border-white/5 pr-4 flex-none group-hover:border-emerald-500/30">
                <span className="text-[9px] font-bold text-emerald-500 mb-1">الفرق</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">{stats.fDiffs[i]}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center py-10 opacity-20 text-[8px] font-bold tracking-[1.5em] uppercase text-slate-500">End of Dashboard</footer>
      </div>
    </div>
  );
}
