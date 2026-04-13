import { useEffect, useMemo, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { ClassNameProp } from '../../../../shared/ui/className/ClassNameProp'
import './TelemetryWsMockPanel.css'

type TelemetryType = 'BLOOD' | 'ELECTROLYTE' | 'METABOLIC' | 'LIPID'
type Destination = '/queue/blood' | '/queue/electrolyte' | '/queue/metabolic' | '/queue/lipid'

interface BloodCountPayload {
  deviceId: string
  userId: string
  timestamp: string
  hemoglobin: number
  hemoglobinUnit: string
  redBloodCells: number
  whiteBloodCells: number
  whiteBloodCellsUnit: string
  platelets: number
  plateletsUnit: string
  iron: number
  ironUnit: string
}

interface ElectrolytePayload {
  deviceId: string
  userId: string
  timestamp: string
  sodium: number
  sodiumUnit: string
  potassium: number
  potassiumUnit: string
}

interface LipidPayload {
  deviceId: string
  userId: string
  timestamp: string
  totalCholesterol: number
  totalCholesterolUnit: string
  triglycerides: number
  triglyceridesUnit: string
}

interface MetabolicPayload {
  deviceId: string
  userId: string
  timestamp: string
  glucose: number
  glucoseUnit: string
  creatinine: number
  bloodUreaNitrogen: number
  uricAcid: number
  ph: number
  calcium: number
}

type Payload = BloodCountPayload | ElectrolytePayload | LipidPayload | MetabolicPayload

interface TelemetryEvent {
  id: string
  type: TelemetryType
  destination: Destination
  payload: Payload
  receivedAt: string
}

interface TelemetryWsMockPanelProps extends ClassNameProp {}

const USER_ID = 'doctor-juan'
const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws?userId=doctor-juan'
const USER_DEST_PREFIX = '/user'

const DESTINATIONS: Record<TelemetryType, Destination> = {
  BLOOD: '/queue/blood',
  ELECTROLYTE: '/queue/electrolyte',
  METABOLIC: '/queue/metabolic',
  LIPID: '/queue/lipid',
}

const TELEMETRY_TYPES: TelemetryType[] = ['BLOOD', 'ELECTROLYTE', 'METABOLIC', 'LIPID']

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-PE', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export const TelemetryWsMockPanel = ({ className = '' }: TelemetryWsMockPanelProps) => {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<TelemetryEvent[]>([])
  const [error, setError] = useState<string>('')

  const [subscriptions, setSubscriptions] = useState<Record<TelemetryType, boolean>>({
    BLOOD: true,
    ELECTROLYTE: true,
    METABOLIC: true,
    LIPID: true,
  })

  const clientRef = useRef<Client | null>(null)
  const unsubRef = useRef<Array<() => void>>([])

  const latestByType = useMemo(() => {
    const latest: Partial<Record<TelemetryType, TelemetryEvent>> = {}
    for (const evt of events) {
      if (!latest[evt.type]) latest[evt.type] = evt
    }
    return latest
  }, [events])

  const counters = useMemo(() => {
    return events.reduce<Record<TelemetryType, number>>(
      (acc, event) => {
        acc[event.type] += 1
        return acc
      },
      { BLOOD: 0, ELECTROLYTE: 0, METABOLIC: 0, LIPID: 0 }
    )
  }, [events])

  useEffect(() => {
    const client = new Client({
      reconnectDelay: 4000,
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        'x-user-id': USER_ID,
      },
      onConnect: () => {
        setConnected(true)
        setError('')

        unsubRef.current.forEach((fn) => fn())
        unsubRef.current = []

        TELEMETRY_TYPES.forEach((type) => {
          if (!subscriptions[type]) return

          const destination = DESTINATIONS[type]
          const fullDestination = USER_DEST_PREFIX + destination

          const sub = client.subscribe(fullDestination, (message) => {
            try {
              const payload = JSON.parse(message.body) as Payload
              const evt: TelemetryEvent = {
                id: String(Date.now()) + '-' + String(Math.round(Math.random() * 1000000)),
                type,
                destination,
                payload,
                receivedAt: new Date().toISOString(),
              }
              setEvents((prev) => [evt, ...prev].slice(0, 100))
            } catch {
              setError('No se pudo parsear un mensaje JSON del backend.')
            }
          })

          unsubRef.current.push(() => sub.unsubscribe())
        })
      },
      onStompError: (frame) => {
        setConnected(false)
        setError('STOMP error: ' + frame.headers.message)
      },
      onWebSocketError: () => {
        setConnected(false)
        setError('Error de transporte WebSocket.')
      },
      onDisconnect: () => {
        setConnected(false)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      unsubRef.current.forEach((fn) => fn())
      unsubRef.current = []
      client.deactivate()
      clientRef.current = null
      setConnected(false)
    }
  }, [subscriptions])

  const reconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate().then(() => {
        clientRef.current?.activate()
      })
    }
  }

  const toggleSubscription = (type: TelemetryType) => {
    setSubscriptions((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  return (
    <section className={'telemetry-mock ' + className}>
      <header className="telemetry-mock__header">
        <div>
          <h2>WebSocket Telemetry Monitor</h2>
          <p>Usuario fijo: doctor-juan</p>
          <p>Conexión: {WS_URL}</p>
        </div>

        <div className="telemetry-mock__status">
          <span className={connected ? 'is-ok' : 'is-off'}>
            {connected ? 'Conectado' : 'Desconectado'}
          </span>
          <button type="button" onClick={reconnect}>
            Reconectar
          </button>
          <button type="button" onClick={() => setEvents([])}>
            Limpiar historial
          </button>
        </div>
      </header>

      {error && <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p>}

      <div className="telemetry-mock__subscriptions">
        {TELEMETRY_TYPES.map((type) => (
          <article key={type} className="telemetry-subscription-card">
            <h3>{type}</h3>
            <p>Destino: {DESTINATIONS[type]}</p>
            <p>Mensajes recibidos: {counters[type]}</p>
            <label className="toggle-line">
              <input
                type="checkbox"
                checked={subscriptions[type]}
                onChange={() => toggleSubscription(type)}
              />
              Suscrito
            </label>
          </article>
        ))}
      </div>

      <div className="telemetry-mock__latest">
        <h3>Último payload por tipo</h3>
        <div className="telemetry-latest-grid">
          {TELEMETRY_TYPES.map((type) => {
            const current = latestByType[type]
            return (
              <article key={type} className="latest-card">
                <h4>{type}</h4>
                {!current && <p>Sin eventos aún</p>}
                {current && (
                  <>
                    <p><strong>deviceId:</strong> {current.payload.deviceId}</p>
                    <p><strong>timestamp:</strong> {formatDate(current.payload.timestamp)}</p>
                    <pre>{JSON.stringify(current.payload, null, 2)}</pre>
                  </>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}