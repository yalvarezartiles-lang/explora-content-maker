import { createFileRoute } from '@tanstack/react-router';
import { StudentHistory } from '@/components/portal/Portal';
import { ordersQuery } from '@/lib/portal/queries';
import { portalHead } from '@/lib/portal/rules';
export const Route = createFileRoute('/_authenticated/alumnos/historial')({ head: () => portalHead('Historial de Compras', 'Consulta los pedidos y pagos de tu cuenta de alumno de Adassa.'), loader: ({ context }) => context.queryClient.ensureQueryData(ordersQuery), component: StudentHistory });
