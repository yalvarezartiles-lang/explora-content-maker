import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
export const SessionContext = createContext<User | null>(null);
export const usePortalSession = () => useContext(SessionContext);