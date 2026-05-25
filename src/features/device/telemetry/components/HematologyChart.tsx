import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { HematologyReading } from '../hematology';

type Props = {
  messages: HematologyReading[];
};

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('es-CO', { hour12: false });
}

export const HematologyChart = ({ messages }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(229,62,62,0.12)');
    gradient.addColorStop(1, 'rgba(229,62,62,0.02)');

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Hemoglobina',
            data: [],
            borderColor: '#E53E3E',
            backgroundColor: gradient,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Leucocitos',
            data: [],
            borderColor: '#378ADD',
            borderDash: [5, 4],
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: false,
          },
          {
            label: 'Plaquetas',
            data: [],
            borderColor: '#38A169',
            borderDash: [3, 3],
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: false,
          },
          {
            label: 'Hierro',
            data: [],
            borderColor: '#805AD5',
            borderDash: [1, 3],
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 10, padding: 8 } },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.formattedValue;
                const units: Record<string, string> = {
                  Hemoglobina: 'g/dL',
                  Leucocitos: 'cells/µL',
                  Plaquetas: 'cells/µL',
                  Hierro: 'mg/dL',
                };
                const unit = units[label] || '';
                return `${label}: ${value} ${unit}`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { maxTicksLimit: 8, color: '#3b4a5a' }, grid: { color: 'rgba(20,40,60,0.04)' } },
          y: { ticks: { color: '#3b4a5a' }, grid: { color: 'rgba(20,40,60,0.04)' }, beginAtZero: false },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || messages.length === 0) return;

    chart.data.labels = messages.map((m) => formatTime(m.timestamp));
    chart.data.datasets[0].data = messages.map((m) => m.hemoglobin);
    chart.data.datasets[1].data = messages.map((m) => m.whiteBloodCells);
    chart.data.datasets[2].data = messages.map((m) => m.platelets);
    chart.data.datasets[3].data = messages.map((m) => m.iron);
    chart.update('none');
  }, [messages]);

  return (
    <div className="chart_wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
};
