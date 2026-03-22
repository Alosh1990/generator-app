"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function RakbaGlassEdition() {
  const [mounted, setMounted] = useState(false);
  const [stockBefore, setStockBefore] = useState('26820'); 
  
  const [fuelRows, setFuelRows] = useState([
    { id: 1, name: 'CAT 1', yest: '', today: '' },
    { id: 2, name: 'CAT 2', yest: '', today: '' },
    { id: 3, name: 'CAT 3', yest: '', today: '' },
  ]);

  const [kwRows, setKwRows] = useState([
    { id: 1, name: 'CAT 1', yest: '', today: '' },
    { id: 2, name: 'CAT 2', yest: '', today: '' },
    { id: 3, name: 'CAT 3', yest: '', today: '' },
  ]);

  useEffect(() => {
    setMounted(true);
    // تم تغيير مفتاح التخزين لضمان تحديث البيانات عند المستخدم
    const saved = localStorage.getItem('rakba_v_premium_fix');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.s) setStockBefore(parsed.s);
      if(parsed.fr) setFuelRows(parsed.fr);
      if(parsed.kr) setKwRows(parsed.kr);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rakba_v_premium_fix', JSON.stringify({ s: stockBefore, fr: fuelRows, kr: kwRows }));
    }
  }, [stockBefore, fuelRows, kwRows, mounted]);

  const stats = useMemo(() => {
    const fDiffs = fuelRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const kDiffs = kwRows.map(r => Math.max(0, (Number(r.today) || 0) - (Number(r.yest) || 0)));
    const totalFuel = fDiffs.reduce((a, b) => a + b, 0);
    const totalKW = kDiffs.reduce((a, b) => a + b, 0);
    return { fDiffs, kDiffs, totalFuel, totalKW, current: (Number(stockBefore) || 0) - totalFuel };
  }, [stockBefore, fuelRows, kwRows]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050608] text-white p-4 relative overflow-hidden font-sans antialiased selection:bg-blue-500/30" dir="rtl">
      
      {/* خلفية زرقاء ديناميكية متحركة (Animated Blue Waves) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgMzBDMjAgMTAgNDAgMTAgNjAgMzBDODAgNTAgMTAwIDUwIDEwMCAzMEwxMDAgMTAwTDAgMTAwWiIgZmlsbD0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMDMpIi8+PC9zdmc+')] animate-wave duration-[20s] linear infinite opacity-50"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgNDBDMzAgMjAgNjAgMjAgOTAgNDBDOTAgNDAgOTAgNDAgOTAgNDBDNjAgMjAgMzAgMjAgMCA0MEwwIDEwMEwwIDQwWiIgZmlsbD0icmdiYSgxNiwgMTg1LCAxMjksIDAuMDIiLz48L3N2Zz4=')] animate-wave duration-[25s] linear infinite delay-1000 opacity-30"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[100px] animate-bounce duration-[15s]"></div>
      </div>

      <style jsx global>{`
        /* تأثير الزجاج الأسود الفخم (Premium Black Glass) */
        .glass-panel {
          background: rgba(10, 10, 15, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-panel:hover {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.2);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.15);
        }

        /* الحقول السوداء الزجاجية المصغرة */
        input {
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 12px !important;
          padding: 10px !important;
          color: white !important;
          text-align: center !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5) !important;
          transition: all 0.3s ease !important;
          width: 100% !important;
          outline: none !important;
        }

        input:focus {
          border-color: #3b82f6 !important;
          background: rgba(0, 0, 0, 0.7) !important;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2) !important;
        }

        /* توهج النيون للأرقام الكبيرة */
        .neon-text-blue { text-shadow: 0 0 15px rgba(59, 130, 246, 0.6); color: #60a5fa; }
        .neon-text-emerald { text-shadow: 0 0 15px rgba(16, 185, 129, 0.6); color: #34d399; }
        .neon-text-yellow { text-shadow: 0 0 15px rgba(245, 158, 11, 0.6); color: #fbbf24; }
      `}</style>

      <div className="max-w-[500px] mx-auto relative z-10 space-y-6 pb-20">
        
        {/* Header - مستوحى من Living Parallax */}
        <header className="flex justify-between items-center py-6 border-b border-white/5 px-2">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white group cursor-default">
              رُكبة <span className="text-blue-500 group-hover:text-blue-400 transition-colors">PRO</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-600 tracking-[0.4em] uppercase">Enterprise Edition v5.0</p>
          </div>
          <button 
            onClick={() => confirm("ترحيل قراءات اليوم ليوم جديد؟") && (setFuelRows(fuelRows.map(r=>({...r, yest:r.today, today:''}))), setKwRows(kwRows.map(r=>({...r, yest:r.today, today:''}))))}
            className="bg-blue-600 hover:bg-blue-500/90 border border-blue-500/30 text-white text-[11px] font-black px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)] active:scale-95 transition-all"
          >
            ترحيل البيانات ⏭️
          </button>
        </header>

        {/* الكارت الرئيسي (الخزين الحالي) */}
        <section className="glass-panel p-10 text-center relative overflow-hidden border-t border-white/10">
          <p className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">المتبقي الصافي (لتر)</p>
          <div className="text-8xl font-black tabular-nums neon-text-blue mb-10 tracking-tighter tabular-nums drop-shadow-2xl">
            {stats.current.toLocaleString()}
          </div>
          <div className="relative max-w-[240px] mx-auto relative group">
            <span className="absolute -top-2 right-4 bg-[#050608] px-2 text-[10px] text-blue-500 font-bold uppercase tracking-widest z-10">الخزين الكلي قبل الصرف</span>
            <input type="number" value={stockBefore} onChange={(e)=>setStockBefore(e.target.value)} className="w-full text-2xl" />
          </div>
        </section>

        {/* إحصائيات سريعة ملونة */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-6 text-center border-r-2 border-emerald-500/50">
            <p className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">مجموع صرف الكاز</p>
            <p className="text-4xl font-black neon-text-emerald tabular-nums">{stats.totalFuel}</p>
          </div>
          <div className="glass-panel p-6 text-center border-r-2 border-yellow-500/50">
            <p className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">إجمالي الـ KW</p>
            <p className="text-4xl font-black neon-text-yellow tabular-nums">{stats.totalKW.toLocaleString()}</p>
          </div>
        </div>

        {/* جداول العدادات بنظام الزجاج الأسود والنيون */}
        <div className="space-y-10">
          
          {/* قسم الكاز */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3">
              <span className="h-[1px] flex-1 bg-white/5"></span>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">محاسبة الكاز ⛽</h2>
              <span className="h-[1px] flex-1 bg-white/5"></span>
            </div>
            {fuelRows.map((row, i) => (
              <div key={row.id} className="glass-panel p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-black text-blue-500 italic shadow-inner w-16 h-16 text-lg">
                  {row.name.split(' ')[1]}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3 max-w-[240px]">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...fuelRows]; n[i].yest=e.target.value; setFuelRows(n)}} className="text-xs opacity-50" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...fuelRows]; n[i].today=e.target.value; setFuelRows(n)}} className="text-xs border-emerald-500/20" />
                </div>
                <div className="w-20 text-center border-r border-white/5 pr-4 flex-none">
                  <span className="text-[10px] font-bold text-emerald-500 block mb-1">الفرق</span>
                  <span className="text-2xl font-black neon-text-emerald tabular-nums">{stats.fDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* قسم الكهرباء */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3">
              <span className="h-[1px] flex-1 bg-white/5"></span>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">محاسبة الطاقة ⚡</h2>
              <span className="h-[1px] flex-1 bg-white/5"></span>
            </div>
            {kwRows.map((row, i) => (
              <div key={row.id} className="glass-panel p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-black text-yellow-500 italic shadow-inner w-16 h-16 text-lg">
                  KW
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3 max-w-[240px]">
                  <input type="number" placeholder="أمس" value={row.yest} onChange={(e)=>{const n=[...kwRows]; n[i].yest=e.target.value; setKwRows(n)}} className="text-xs opacity-50" />
                  <input type="number" placeholder="اليوم" value={row.today} onChange={(e)=>{const n=[...kwRows]; n[i].today=e.target.value; setKwRows(n)}} className="text-xs border-blue-500/20" />
                </div>
                <div className="w-20 text-center border-r border-white/5 pr-4 flex-none">
                  <span className="text-[10px] font-bold text-blue-400 block mb-1">الإنتاج</span>
                  <span className="text-2xl font-black neon-text-blue tabular-nums">{stats.kDiffs[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center py-10 opacity-20 text-[9px] font-bold tracking-[1.5em] uppercase text-blue-200">System secured • Enterprise Solution</footer>
      </div>
    </div>
  );
}
