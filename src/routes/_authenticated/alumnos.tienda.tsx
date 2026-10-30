import { createFileRoute } from '@tanstack/react-router';
import { StudentShop } from '@/components/portal/Portal';
import { productsQuery } from '@/lib/portal/queries';
import { portalHead } from '@/lib/portal/rules';
export const Route = createFileRoute('/_authenticated/alumnos/tienda')({ head: () => portalHead('Tienda', 'Prácticas, packs y tasas para alumnos de Autoescuela Adassa.'), loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery), component: StudentShop });
