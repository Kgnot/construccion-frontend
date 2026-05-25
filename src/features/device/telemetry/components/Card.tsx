import type { ReactNode } from 'react';

type Props = {
  name: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
};

export const Card = ({ name, value, unit, icon }: Props) => (
  <div className="card_message">
    <span className="card_background_icon">
      <span className="card_icon">{icon}</span>
    </span>
    <div className="card_message_info">
      <span className="card_name">{name}</span>
      <span className="card_value">{value}</span>
      {unit && <span className="card_unit">{unit}</span>}
    </div>
  </div>
);
