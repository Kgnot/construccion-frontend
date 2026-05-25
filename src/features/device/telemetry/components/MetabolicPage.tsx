import { useEffect, useState } from 'react';
import { useWebSocketService } from '../hooks/WebSocketHook';
import type { MetabolicReading } from '../metabolic';
import { MetabolicMetricChart } from './MetabolicMetricChart';
import { Card } from './Card';
import { LineChart, Gauge, FlaskConical, TestTubes, Droplets, Activity, Pill } from 'lucide-react';
import '../telemetry.css';

export const MetabolicPage = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<MetabolicReading[]>([]);
  const [currentMessage, setCurrentMessage] = useState<MetabolicReading | null>(null);
  const webSocketUrl = `http://localhost:8082/ws?userId=${encodeURIComponent(userId)}`;

  const { connect, subscribe, unsubscribe, disconnect } = useWebSocketService(
    webSocketUrl,
    () => {
      subscribe('/user/queue/metabolic', (msg: MetabolicReading) => {
        setMessages((prev) => [...prev, msg].slice(-30));
        setCurrentMessage(msg);
      });
    },
    (error) => console.error('WebSocket Error:', error)
  );

  useEffect(() => {
    connect();
    return () => {
      unsubscribe('/user/queue/metabolic');
      disconnect();
    };
  }, []);

  const formatUnit = (u?: string) => {
    if (!u) return '';
    const map: Record<string, string> = {
      MG_DL: 'mg/dL',
    };
    return map[u] ?? u.replace('_', '/').toLowerCase();
  };

  return (
    <div className="main_box_telemetry">
      <h1 className='data-title'>Metabolismo</h1>
      {currentMessage ? (
        <div className="main_box_cards">
          <Card
            name="Glucosa"
            value={currentMessage.glucose}
            unit={formatUnit(currentMessage.glucoseUnit)}
            icon={<Gauge />}
          />
          <Card
            name="Creatinina"
            value={currentMessage.creatinine}
            unit={formatUnit(currentMessage.creatinineUnit)}
            icon={<FlaskConical />}
          />
          <Card
            name="BUN"
            value={currentMessage.bloodUreaNitrogen}
            unit={formatUnit(currentMessage.bloodUreaNitrogenUnit)}
            icon={<TestTubes />}
          />
          <Card
            name="Ácido Úrico"
            value={currentMessage.uricAcid}
            unit={formatUnit(currentMessage.uricAcidUnit)}
            icon={<Droplets />}
          />
          <Card
            name="pH"
            value={currentMessage.ph}
            icon={<Activity />}
          />
          <Card
            name="Calcio"
            value={currentMessage.calcium}
            unit={formatUnit(currentMessage.calciumUnit)}
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
            <h2>Glucosa</h2>
          </div>
          <MetabolicMetricChart messages={messages} label="Glucosa" unit="mg/dL" color="#378ADD" dataKey="glucose" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Creatinina</h2>
          </div>
          <MetabolicMetricChart messages={messages} label="Creatinina" unit="mg/dL" color="#D85A30" dataKey="creatinine" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>BUN</h2>
          </div>
          <MetabolicMetricChart messages={messages} label="BUN" unit="mg/dL" color="#38A169" dataKey="bloodUreaNitrogen" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Ácido Úrico</h2>
          </div>
          <MetabolicMetricChart messages={messages} label="Ácido Úrico" unit="mg/dL" color="#805AD5" dataKey="uricAcid" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>pH</h2>
          </div>
          <MetabolicMetricChart messages={messages} label="pH" unit="" color="#E53E3E" dataKey="ph" />
        </div>
        <div>
          <div className="chart_title">
            <LineChart className="chart_title_icon" />
            <h2>Calcio</h2>
          </div>
          <MetabolicMetricChart messages={messages} label="Calcio" unit="mg/dL" color="#DD6B20" dataKey="calcium" />
        </div>
      </div>
    </div>
  );
};
