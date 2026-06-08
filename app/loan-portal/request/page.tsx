import ActiveClientGate from '../components/ActiveClientGate';
import ClientLoanRequestForm from '../components/ClientLoanRequestForm';

export default function LoanRequestPage() {
  return (
    <ActiveClientGate>
      <ClientLoanRequestForm />
    </ActiveClientGate>
  );
}
