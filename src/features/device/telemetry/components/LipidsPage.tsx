import { useEffect, useState } from 'react';
import { useWebSocketService } from '../hooks/WebSocketHook';
import type { LipidReading } from '../lipids';
import { LipidMetricChart } from '../components/LipidMetricChart';
import { Card } from '../components/Card';
import { ClipboardMinus, Droplets, LineChart } from 'lucide-react';
import '../telemetry.css'

export const LipidsPage = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<LipidReading[]>([]);
  const [currentMessage, setCurrentMessage] = useState<LipidReading | null>(null);
  const webSocketUrl = `http://localhost:8082/ws?userId=${encodeURIComponent(userId)}`;

  const { connect, subscribe, unsubscribe, disconnect } = useWebSocketService(
    webSocketUrl,
    () => {
      // suscribir aquí, cuando la conexión ya existe
      subscribe('/user/queue/lipid', (msg: LipidReading) => {
        setMessages(prev => [...prev, msg].slice(-30));
        setCurrentMessage(msg);
      });
    },
    (error) => console.error('WebSocket Error:', error)
  );

  useEffect(() => {
    connect();
    return () => {
      unsubscribe('/user/queue/lipid');
      disconnect();
    };
  }, []);

  const formatUnit = (u?: string) => {
    if (!u) return '—';
    const map: Record<string, string> = {
      'MG_DL': 'mg/dL',
      'MMOL_L': 'mmol/L',
    };
    return map[u] ?? u.replace('_', '/').toLowerCase();
  };

  return (
      <div className='main_box_telemetry'>
        <h1 className='data-title'>Lípidos</h1>
        {currentMessage ? (
          <div className='main_box_cards'>
            <Card
              name="Colesterol Total"
              value={currentMessage.totalCholesterol}
              unit={formatUnit(currentMessage.totalCholesterolUnit)}
              icon={<ClipboardMinus />}
            />
            <Card
              name="Triglicéridos"
              value={currentMessage.triglycerides}
              unit={formatUnit(currentMessage.triglyceridesUnit)}
              icon={<Droplets />}
            />
          </div>
        ) : (
          <p>No se han recibido mensajes aún.</p>
        )}
        <div className="charts_grid">
          <div>
            <div className="chart_title">
              <LineChart className="chart_title_icon" />
              <h2>Colesterol Total</h2>
            </div>
            <LipidMetricChart messages={messages} label="Colesterol total" unit="mg/dL" color="#378ADD" dataKey="totalCholesterol" />
          </div>
          <div>
            <div className="chart_title">
              <LineChart className="chart_title_icon" />
              <h2>Triglicéridos</h2>
            </div>
            <LipidMetricChart messages={messages} label="Triglicéridos" unit="mg/dL" color="#D85A30" dataKey="triglycerides" />
          </div>
        </div>
      </div>
  );
};