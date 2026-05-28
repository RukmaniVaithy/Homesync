import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ActionCard from '@/components/ActionCard';
import styles from './page.module.css';
import { CreditCard } from 'lucide-react';
import { getGoogleSheet } from '@/lib/googleSheets';
import AddBillModal from '@/components/AddBillModal';
import AddBillButton from '@/components/AddBillButton';
import MarkPaidButton from '@/components/MarkPaidButton';

export const revalidate = 0;

async function getBillsData() {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle['Finances'];
    const rows = await sheet.getRows();
    return rows.map(r => ({ ...r.toObject(), _rowNumber: r.rowNumber }));
  } catch (error) {
    console.error("Failed to fetch bills:", error);
    return [];
  }
}

export default async function BillsManager() {
  const bills = await getBillsData();

  const totalDue = bills
    .filter((b: any) => b.status === 'DUE' || b.status === 'OVERDUE')
    .reduce((sum: number, b: any) => sum + Number(b.amount), 0);

  const overdueBills = bills.filter((b: any) => b.status === 'OVERDUE');
  const dueBills = bills.filter((b: any) => b.status === 'DUE');
  const paidBills = bills.filter((b: any) => b.status === 'PAID');

  return (
    <>
      <TopBar title="Financial Hub" />
      
      <main className={styles.main}>
        {/* FAB Modal */}
        <AddBillModal />
        {/* Overview Cards */}
        <section className={styles.overviewSection}>
          <div className={`${styles.overviewCard} ${styles.dueCard}`}>
            <p className={styles.overviewLabel}>Total Due</p>
            <h2 className={styles.overviewValue}>£{totalDue.toFixed(2)}</h2>
          </div>
          <div className={`${styles.overviewCard} ${styles.taxCard}`}>
            <p className={styles.overviewLabel}>Next Tax Deadline</p>
            <h2 className={styles.overviewValue}>Jan 31</h2>
          </div>
        </section>

        {/* Overdue Bills */}
        {overdueBills.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Overdue</h2>
            {overdueBills.map((bill: any) => (
              <ActionCard
                key={bill.id}
                title={bill.name}
                subtitle={`Due: ${bill.dueDate}`}
                statusText="OVERDUE"
                statusType="critical"
                icon={<CreditCard size={24} />}
                actionButton={<MarkPaidButton rowNumber={bill._rowNumber} />}
              />
            ))}
          </section>
        )}

        {/* Due Bills */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming</h2>
          {dueBills.map((bill: any) => (
            <ActionCard
              key={bill.id}
              title={bill.name}
              subtitle={`Due: ${bill.dueDate}`}
              statusText="DUE"
              statusType="warning"
              icon={<CreditCard size={24} />}
              actionButton={<MarkPaidButton rowNumber={bill._rowNumber} />}
            />
          ))}
          {dueBills.length === 0 && <p className={styles.emptyText}>No upcoming bills.</p>}
        </section>

        {/* Paid Bills */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Paid Recently</h2>
          {paidBills.map((bill: any) => (
            <ActionCard
              key={bill.id}
              title={bill.name}
              subtitle={`Paid by ${bill.lastUpdatedBy}`}
              statusText="PAID"
              statusType="healthy"
              icon={<CreditCard size={24} />}
            />
          ))}
        </section>

        {/* FAB */}
        <AddBillButton />
      </main>

      <BottomNav />
    </>
  );
}
