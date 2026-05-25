import { useEffect, useState } from 'react';
import { useWebSocketService } from '../hooks/WebSocketHook';
import type { ElectrolyteReading } from '../electrolytes';
import { ElectrolyteChart } from './ElectrolyteChart';
import { Card } from './Card';
import { LineChart, Zap, HeartPulse } from 'lucide-react';
import '../telemetry.css';

export const ElectrolytesPage = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<ElectrolyteReading[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ElectrolyteReading | null>(null);
  const webSocketUrl = `http://localhost:8082/ws?userId=${encodeURIComponent(userId)}`;

  const { connect, subscribe, unsubscribe, disconnect } = useWebSocketService(
    webSocketUrl,
    () => {
      subscribe('/user/queue/electrolyte', (msg: ElectrolyteReading) => {
        setMessages((prev) => [...prev, msg].slice(-30));
        setCurrentMessage(msg);
      });
    },
    (error) => console.error('WebSocket Error:', error)
  );

  useEffect(() => {
    connect();
    return () => {
      unsubscribe('/user/queue/electrolyte');
      disconnect();
    };
  }, []);

  const formatUnit = (u?: string) => {
    if (!u) return '—';
    const map: Record<string, string> = {
      MEQ_L: 'mEq/L',
    };
    return map[u] ?? u.replace('_', '/').toLowerCase();
  };

  return (
    <div className="main_box_telemetry">
      <h1 className='data-title'>Electrolitos</h1>
      {currentMessage ? (
        <div className="main_box_cards">
          <Card
            name="Sodio"
            value={currentMessage.sodium}
            unit={formatUnit(currentMessage.sodiumUnit)}
            icon={<Zap />}
          />
          <Card
            name="Potasio"
            value={currentMessage.potassium}
            unit={formatUnit(currentMessage.potassiumUnit)}
            icon={<HeartPulse />}
          />
        </div>
      ) : (
        <p>No se han recibido mensajes aún.</p>
      )}
      <div className="charts_grid">
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Sodio</h2>
          </div>
          <ElectrolyteChart messages={messages} label="Sodio" unit="mEq/L" color="#378ADD" dataKey="sodium" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Potasio</h2>
          </div>
          <ElectrolyteChart messages={messages} label="Potasio" unit="mEq/L" color="#D85A30" dataKey="potassium" />
        </div>
      </div>
    </div>
  );
};
