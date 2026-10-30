import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PortalShell } from '@/components/portal/Portal';
import { studentQuery } from '@/lib/portal/queries';
export const Route = createFileRoute('/_authenticated/alumnos')({ loader: ({ context }) => context.queryClient.ensureQueryData(studentQuery), component: () => <PortalShell><Outlet /></PortalShell> });
