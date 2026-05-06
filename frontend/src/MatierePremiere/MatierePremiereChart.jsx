import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from "axios";

const MatierePremiereChart = () => {
  const [chartData, setChartData] = useState({ AllMatiere: [], ByUnit: [] });
  const [loading, setLoading] = useState(false);

  // Note: This endpoint should be implemented in the backend
  useEffect(() => {
    // fetchData() logic here when endpoint is ready
  }, []);

  const data = [
    { name: 'KG', value: 40 },
    { name: 'Litre', value: 30 },
    { name: 'Unité', value: 30 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h5 style={{ marginTop: '20px' }}>Répartition par Unité</h5>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default MatierePremiereChart;
