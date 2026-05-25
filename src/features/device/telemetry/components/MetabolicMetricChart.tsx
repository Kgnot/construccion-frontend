import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { MetabolicReading } from '../metabolic';

type Props = {
  messages: MetabolicReading[];
  label: string;
  unit: string;
  color: string;
  dataKey: 'glucose' | 'creatinine' | 'bloodUreaNitrogen' | 'uricAcid' | 'ph' | 'calcium';
};

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('es-CO', { hour12: false });
}

export const MetabolicMetricChart = ({ messages, label, unit, color, dataKey }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, `rgba(55,138,221,0.18)`);
    gradient.addColorStop(1, `rgba(55,138,221,0.02)`);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label,
            data: [],
            borderColor: color,
            backgroundColor: gradient,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
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
                const lbl = context.dataset.label || '';
                const value = context.formattedValue;
                return unit ? `${lbl}: ${value} ${unit}` : `${lbl}: ${value}`;
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
    chart.data.datasets[0].data = messages.map((m) => m[dataKey]);
    chart.update('none');
  }, [messages]);

  return (
    <div className="chart_wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
};
