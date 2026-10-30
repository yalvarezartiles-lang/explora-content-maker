import { createFileRoute } from '@tanstack/react-router';
import { StudentProfile } from '@/components/portal/Portal';
import { portalHead } from '@/lib/portal/rules';
export const Route = createFileRoute('/_authenticated/alumnos/perfil')({ head: () => portalHead('Mi Perfil', 'Datos personales de tu cuenta de alumno en Autoescuela Adassa.'), component: StudentProfile });
