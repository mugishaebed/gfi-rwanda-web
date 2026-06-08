import ActiveClientGate from '../components/ActiveClientGate';
import ClientMyLoans from '../components/ClientMyLoans';

export default function MyLoansPage() {
  return (
    <ActiveClientGate>
      <ClientMyLoans />
    </ActiveClientGate>
  );
}
