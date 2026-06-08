'use client';

import { useAuth } from '@/app/lib/auth-context';
import ClientProfileCompletionForm from './ClientProfileCompletionForm';
import ClientProfileDetails from './ClientProfileDetails';

export default function ClientProfilePageContent() {
  const { clientOnboardingStatus } = useAuth();

  if (
    clientOnboardingStatus === 'PENDING_PROFILE' ||
    clientOnboardingStatus === 'PENDING_APPROVAL'
  ) {
    return <ClientProfileCompletionForm />;
  }

  return <ClientProfileDetails />;
}
