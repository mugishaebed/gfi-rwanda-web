import ActiveClientGate from '../../components/ActiveClientGate';
import ClientLoanDetails from '../../components/ClientLoanDetails';

type LoanDetailsPageProps = {
  params: Promise<{ loanId: string }>;
};

export default async function LoanDetailsPage({ params }: LoanDetailsPageProps) {
  const { loanId } = await params;

  return (
    <ActiveClientGate>
      <ClientLoanDetails loanId={loanId} />
    </ActiveClientGate>
  );
}
