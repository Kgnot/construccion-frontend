import { useEffect, useState } from "react";
import { getDevicesUseCase, type DeviceResponse } from "./services/GetDevicesUseCase";
import "./ActiveDevicesTable.css";
import { useNavigate } from "react-router";
import { getCustomerById } from "../../../shared/lib/customerService";

const STATUS_LABELS: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  warning: "Advertencia",
};

export function ActiveDevicesTable() {
  const [devices, setDevices] = useState<DeviceResponse[]>([]);


  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await getDevicesUseCase();
      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };


  const handleClick = (userId: string) => {
    navigate(`/device/telemetry/${userId}`);
  };


  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) return <p className="devices_loading">Cargando dispositivos...</p>;
  if (devices.length === 0) return <p className="devices_empty">No hay dispositivos activos.</p>;
  return (
    <div className="devices_table_wrapper">
      <table className="devices_table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>N.º Serie</th>
            <th>Modelo</th>
            <th>Fabricante</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {devices.length !== 0 && devices.map((device) => (
            <tr key={device.id}>
              <td className="col_name">{device.name}</td>
              <td className="col_serial">{device.serialNumber}</td>
              <td>{device.model}</td>
              <td>{device.manufacturer}</td>
              <td>
                <span className="col_status">
                  <span className={`status_dot ${device.status?.toLowerCase() ?? ""}`} />
                  {STATUS_LABELS[device.status?.toLowerCase()] ?? device.status}
                </span>
              </td>
              <td className="col_action">
                <button className="btn_detail" onClick={() => handleClick(device.userId)}>
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
