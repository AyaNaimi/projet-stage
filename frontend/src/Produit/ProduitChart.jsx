import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axiosInstance from "../axiosInstance";

const CategoryProductChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/statistique-chartProduitData");
        setChartData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = () => {
    if (!chartData?.Categorie) return [];

    return chartData.Categorie.map((category) => ({
      name: category.categorie,
      value: category.produits?.length || 0,
    })).filter((item) => item.value > 0 && item.name);
  };

  const data = processData();
  const total = chartData?.AllProduit?.length || 0;

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FDB462",
    "#B3DE69",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E7E9ED",
    "#A0522D",
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{ fontSize: "14px", fontWeight: 500 }}
          >{`${payload[0].name}: ${payload[0].value} products`}</p>
          <p
            style={{ fontSize: "14px", color: "#666" }}
          >{`${percentage}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "16px" }}>
        <p style={{ fontSize: "18px", fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "16px" }}>
        <p style={{ fontSize: "18px", fontWeight: 600, color: "#ef4444" }}>
          {error}
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "16px" }}>
        <p style={{ fontSize: "18px", fontWeight: 600 }}>
          No data available for the chart
        </p>
      </div>
    );
  }
  const CustomLegend = ({ payload }) => {
    const groupSize = 4;
    const legendGroups = payload.reduce((groups, item, index) => {
      const groupIndex = Math.floor(index / groupSize);
      if (!groups[groupIndex]) groups[groupIndex] = [];
      groups[groupIndex].push(item);
      return groups;
    }, []);
  
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: '-180px'
        }}
      >
        {legendGroups.map((group, groupIndex) => (
          <table
            key={groupIndex}
            style={{
              borderCollapse: "separate",
              width: "250px",
            }}
          >
            <tbody>
              {group.map((entry, index) => (
                <tr key={index}>
                  <td
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "6px",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: entry.color,
                        borderRadius: "4px",
                      }}
                    />
                    <span style={{ fontSize: "14px" }}>
                      {entry.value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    );
  };
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0px auto",
        position: "relative",
        top: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <PieChart width={800} height={700}>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<CustomLegend />}
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
          />
        </PieChart>

        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: 600 }}>Total Produits</p>
          <p style={{ fontSize: "24px", fontWeight: 700 }}>
            {total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductChart;
