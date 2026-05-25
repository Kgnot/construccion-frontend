import { useEffect, useState } from 'react';
import { useWebSocketService } from '../hooks/WebSocketHook';
import type { HematologyReading } from '../hematology';
import { HematologyChart } from './HematologyChart';
import { HematologyMetricChart } from './HematologyMetricChart';
import { Card } from './Card';
import { LineChart, Droplets, Shield, Layers, Pill } from 'lucide-react';
import '../telemetry.css';

export const HematologyPage = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<HematologyReading[]>([]);
  const [currentMessage, setCurrentMessage] = useState<HematologyReading | null>(null);
  const webSocketUrl = `http://localhost:8082/ws?userId=${encodeURIComponent(userId)}`;

  const { connect, subscribe, unsubscribe, disconnect } = useWebSocketService(
    webSocketUrl,
    () => {
      subscribe('/user/queue/blood', (msg: HematologyReading) => {
        setMessages((prev) => [...prev, msg].slice(-30));
        setCurrentMessage(msg);
      });
    },
    (error) => console.error('WebSocket Error:', error)
  );

  useEffect(() => {
    connect();
    return () => {
      unsubscribe('/user/queue/blood');
      disconnect();
    };
  }, []);

  const formatUnit = (u?: string) => {
    if (!u) return '—';
    const map: Record<string, string> = {
      G_DL: 'g/dL',
      CELLS_MCL: 'cells/µL',
      MG_DL: 'mg/dL',
    };
    return map[u] ?? u.replace('_', '/').toLowerCase();
  };

  return (
    <div className="main_box_telemetry">
      <h1 className='data-title'>Hematología</h1>
      {currentMessage ? (
        <div className="main_box_cards">
          <Card
            name="Hemoglobina"
            value={currentMessage.hemoglobin}
            unit={formatUnit(currentMessage.hemoglobinUnit)}
            icon={<Droplets />}
          />
          <Card
            name="Leucocitos"
            value={currentMessage.whiteBloodCells}
            unit={formatUnit(currentMessage.whiteBloodCellsUnit)}
            icon={<Shield />}
          />
          <Card
            name="Plaquetas"
            value={currentMessage.platelets}
            unit={formatUnit(currentMessage.plateletsUnit)}
            icon={<Layers />}
          />
          <Card
            name="Hierro"
            value={currentMessage.iron}
            unit={formatUnit(currentMessage.ironUnit)}
            icon={<Pill />}
          />
        </div>
      ) : (
        <p>No se han recibido mensajes aún.</p>
      )}
      <div className="charts_grid">
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Hemoglobina</h2>
          </div>
          <HematologyMetricChart messages={messages} label="Hemoglobina" unit="g/dL" color="#E53E3E" dataKey="hemoglobin" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Leucocitos</h2>
          </div>
          <HematologyMetricChart messages={messages} label="Leucocitos" unit="cells/µL" color="#378ADD" dataKey="whiteBloodCells" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Plaquetas</h2>
          </div>
          <HematologyMetricChart messages={messages} label="Plaquetas" unit="cells/µL" color="#38A169" dataKey="platelets" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Hierro</h2>
          </div>
          <HematologyMetricChart messages={messages} label="Hierro" unit="mg/dL" color="#805AD5" dataKey="iron" />
        </div>
      </div>
    </div>
  );
};
