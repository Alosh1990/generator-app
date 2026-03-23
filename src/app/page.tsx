"use client";

import React, { useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Page() {
  const [activeTab, setActiveTab] = useState("kwh");
  const [rowsKwh, setRowsKwh] = useState([
    { name: "المولد 1", y: "", t: "" },
    { name: "المولد 2", y: "", t: "" },
    { name: "المولد 3", y: "", t: "" },
  ]);
  const [rowsGas, setRowsGas] = useState([
    { name: "المولد 1", y: "", t: "" },
    { name: "المولد 2", y: "", t: "" },
    { name: "المولد 3", y: "", t: "" },
  ]);
  const [stockBeforeGas, setStockBeforeGas] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("energyRecords");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const statsKwh = useMemo(() => {
    const diffs = rowsKwh.map(r => Math.max(0, (Number(r.t) || 0) - (Number(r.y) || 0)));
    return { diffs, total: diffs.reduce((a, b) => a + b, 0) };
  }, [rowsKwh]);

  const statsGas = useMemo(() => {
    const diffs = rowsGas.map(r => Math.max(0, (Number(r.t) || 0) - (Number(r.y) || 0)));
    const total = diffs.reduce((a, b) => a + b, 0);
    return { diffs, total, current: (Number(stockBeforeGas) || 0) - total };
  }, [rowsGas, stockBeforeGas]);

  const rows = activeTab === "kwh" ? rowsKwh : rowsGas;
  const setRows = activeTab === "kwh" ? setRowsKwh : setRowsGas;
  const stats = activeTab === "kwh" ? statsKwh : statsGas;

  const saveRecord = () => {
    const newRecord = { date: currentDate, type: activeTab, total: stats.total };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem("energyRecords", JSON.stringify(updated));
  };

  const deleteRecord = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    localStorage.setItem("energyRecords", JSON.stringify(updated));
  };

  const exportPDF = async () => {
    const input = document.getElementById("pdfTable");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0);
    pdf.save("report.pdf");
  };

  const exportCSV = () => {
    const rowsCSV = [["Date", "Type", "Total"], ...records.map(r => [r.date, r.type, r.total])];
    const csv = "data:text/csv;charset=utf-8," + rowsCSV.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "records.csv";
    link.click();
  };

  const chartData = {
    labels: records.map(r => r.date),
    datasets: [{
      label: "الاستهلاك",
      data: records.map(r => r.total),
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34,211,238,0.2)",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 6,
    }]
  };

  // الخلفية الجديدة الثابتة
  const backgroundUrl = "https://t3.ftcdn.net/jpg/02/16/48/06/360_F_216480626_7D9oipMrGQ66GPni8c5D2j25i2aJqDio.jpg";

  return (
    <main className="min-h-screen flex flex-col items-center font-sans"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full min-h-screen bg-black/40 flex flex-col items-center p-4 sm:p-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyan-300 text-center mb-6">
          ⚡ محطة الكهرباء الإسبانية 🇪🇸
        </h1>

        <input
          type="date"
          value={currentDate}
          onChange={e => setCurrentDate(e.target.value)}
          className="mb-4 p-3 rounded-lg bg-white text-black shadow-lg text-lg w-full max-w-xs"
        />

        {/* Tabs */}
        <div className="flex gap-4 mb-6 text-lg flex-wrap justify-center">
          <button
            onClick={() => setActiveTab("kwh")}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "kwh" ? "bg-cyan-500 text-black shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >⚡ كهرباء</button>
          <button
            onClick={() => setActiveTab("gas")}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === "gas" ? "bg-orange-500 text-black shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >🔥 كاز</button>
        </div>

        {/* Table */}
        <div id="pdfTable" className="w-full max-w-lg bg-black/70 p-4 sm:p-6 rounded-xl shadow-xl">
          {rows.map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 p-3 bg-black/50 rounded-lg shadow-md border border-cyan-300">
              <span className="text-purple-200 font-extrabold text-lg sm:text-xl">{r.name}</span>
              <input type="number" placeholder="أمس" value={r.y}
                onChange={e => { const newRows = [...rows]; newRows[i].y = e.target.value; setRows(newRows); }}
                className="w-full sm:w-1/4 p-3 rounded-lg bg-white text-black font-bold text-center text-lg"
              />
              <input type="number" placeholder="اليوم" value={r.t}
                onChange={e => { const newRows = [...rows]; newRows[i].t = e.target.value; setRows(newRows); }}
                className="w-full sm:w-1/4 p-3 rounded-lg bg-white text-black font-bold text-center text-lg"
              />
              <span className="text-yellow-300 font-extrabold text-2xl text-center w-full sm:w-20">{stats.diffs[i]}</span>
            </div>
          ))}
          <div className="mt-4 font-extrabold text-2xl sm:text-3xl text-green-300 text-center border-t border-cyan-400 pt-3">{`المجموع: ${stats.total}`}</div>
        </div>

        {/* الخزين للكاز */}
        {activeTab === "gas" && (
          <div className="mt-6 w-full max-w-lg p-4 sm:p-6 rounded-xl bg-orange-500/25 border border-orange-300 shadow-lg">
            <div className="flex justify-between mb-3">
              <span className="font-bold text-purple-200 text-lg sm:text-xl">الخزين قبل:</span>
              <input type="number" value={stockBeforeGas} onChange={e => setStockBeforeGas(e.target.value)}
                className="p-3 w-32 rounded-lg bg-white text-black font-bold text-center text-lg sm:text-xl"
              />
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-purple-200 text-lg sm:text-xl">الخزين بعد:</span>
              <span className="text-green-300 font-extrabold text-2xl sm:text-3xl">{statsGas.current}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-6 flex-wrap justify-center">
          <button onClick={saveRecord} className="bg-cyan-500 px-6 py-3 rounded-lg font-bold hover:scale-105 transition text-black">💾 حفظ</button>
          <button onClick={exportPDF} className="bg-blue-500 px-6 py-3 rounded-lg font-bold hover:scale-105 transition text-black">📄 PDF</button>
          <button onClick={exportCSV} className="bg-green-500 px-6 py-3 rounded-lg font-bold hover:scale-105 transition text-black">📥 CSV</button>
        </div>

        {/* Records */}
        <div className="mt-6 w-full max-w-lg">
          <h2 className="font-bold text-xl sm:text-2xl text-cyan-300 mb-3">سجلات التاريخ:</h2>
          <ul className="list-disc list-inside text-white">
            {records.map((rec, i) => (
              <li key={i} className="flex justify-between items-center mb-2 p-2 bg-black/30 rounded-lg transition-all hover:bg-black/50">
                <span className="text-lg sm:text-xl">{rec.date} - {rec.type} - {rec.total}</span>
                <button onClick={() => deleteRecord(i)} className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition">🗑️</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart */}
        <div className="w-full max-w-lg mt-8">
          <Line data={chartData} />
        </div>

      </div>
    </main>
  );
}
