'use client';

import { useEffect, useState } from 'react';

export type Role = 'loan-officer' | 'general-manager';

export const ROLE_LABELS: Record<Role, string> = {
  'loan-officer': 'Loan Officer',
  'general-manager': 'General Manager',
};

const STORAGE_KEY = 'gfi-role';

export function useRole() {
  const [role, setRoleState] = useState<Role | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Role | null;
    setRoleState(stored);
    setLoaded(true);
  }, []);

  function setRole(r: Role | null) {
    if (r) {
      localStorage.setItem(STORAGE_KEY, r);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setRoleState(r);
  }

  return { role, setRole, loaded };
}
