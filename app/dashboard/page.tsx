'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#f0fdf4'];

export default function Dashboard() {
  const [dataPedidos, setDataPedidos] = useState<any[]>([]);
  const [dataKg, setDataKg] = useState<any[]>([]);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalKg, setTotalKg] = useState(0);
  const [kgPorEstado, setKgPorEstado] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      const querySnapshot = await getDocs(collection(db, "envios"));
      const stateCounts: Record<string, number> = {};
      const stateKg: Record<string, number> = {};

      let kgSum = 0;
      let pedidos = 0;

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (data.stateName) {
          stateCounts[data.stateName] = (stateCounts[data.stateName] || 0) + 1;

          if (data.quantidade) {
            const kg = parseFloat(data.quantidade);
            stateKg[data.stateName] = (stateKg[data.stateName] || 0) + kg;
            kgSum += kg;
          }
        }

        pedidos++;
      });

      const pedidosChartData = Object.entries(stateCounts).map(([name, value]) => ({
        name,
        value,
      }));

      const kgChartData = Object.entries(stateKg).map(([name, value]) => ({
        name,
        value,
      }));

      setDataPedidos(pedidosChartData);
      setDataKg(kgChartData);
      setTotalKg(kgSum);
      setTotalPedidos(pedidos);
      setKgPorEstado(stateKg);
    }

    loadData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Dashboard Visual</h1>

      <div className="bg-green-100 text-green-700 p-4 rounded shadow mb-6 w-full max-w-md text-center">
        <p className="text-lg">Total de pedidos: <strong>{totalPedidos}</strong></p>
        <p className="text-lg">Total de kg enviados: <strong>{totalKg.toFixed(2)} kg</strong></p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        <div>
          <h2 className="text-center text-green-700 mb-2 font-bold">Pedidos por estado</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={dataPedidos}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#34d399"
              label
            >
              {dataPedidos.map((_, index) => (
                <Cell key={`cell-pedidos-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div>
          <h2 className="text-center text-green-700 mb-2 font-bold">KG por estado</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={dataKg}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#6ee7b7"
              label
            >
              {dataKg.map((_, index) => (
                <Cell key={`cell-kg-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold text-green-700 mb-2">Detalhamento de kg por estado</h2>
        <ul className="space-y-1">
          {Object.entries(kgPorEstado).map(([estado, kg]) => (
            <li key={estado} className="flex justify-between border-b pb-1">
              <span>{estado}</span>
              <span>{kg.toFixed(2)} kg</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
