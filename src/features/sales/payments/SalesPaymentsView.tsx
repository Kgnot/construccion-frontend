import { FeatureView } from '../../FeatureView';

export const SalesPaymentsView = () => {
  return (
    <FeatureView
      title="Pagos"
      description="Control de pagos recibidos, pendientes y conciliación básica."
      widgets={['Pagos pendientes', 'Métodos', 'Confirmaciones']}
    />
  );
};
