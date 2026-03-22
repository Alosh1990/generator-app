"use client";
import React from "react";

export default function FixedUI() {
  return (
    <div style={styles.bg}>
      <div style={styles.card}>

        <h2 style={styles.title}>⚡ جدول صرف الكيلو واط</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>الفئة</th>
              <th>الأمس</th>
              <th>اليوم</th>
              <th>الصرف</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Cat 1</td>
              <td>2661561</td>
              <td>2664809</td>
              <td style={styles.glow}>3248</td>
            </tr>

            <tr>
              <td>Cat 2</td>
              <td>2693445</td>
              <td>2697404</td>
              <td style={styles.glow}>3959</td>
            </tr>

            <tr>
              <td>Cat 3</td>
              <td>1541614</td>
              <td>1545662</td>
              <td style={styles.glow}>4048</td>
            </tr>
          </tbody>
        </table>

        <div style={styles.total}>المجموع: 11,255 kWh</div>

        <div style={styles.stock}>
          <p>الخزين قبل: 26,820 لتر</p>
          <p style={styles.green}>الخزين بعد: 15,565 لتر 👍</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "#0b0f17",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  card: {
    background: "#111827",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 0 40px rgba(0,255,255,0.2)",
    width: "90%",
    maxWidth: "600px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#22d3ee",
  },
  table: {
    width: "100%",
    textAlign: "center",
    marginBottom: "20px",
  },
  total: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#facc15",
  },
  stock: {
    marginTop: "20px",
  },
  green: {
    color: "#4ade80",
    fontWeight: "bold",
  },
  glow: {
    color: "#22d3ee",
    textShadow: "0 0 10px cyan",
  },
};
