import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ActionCard from '@/components/ActionCard';
import styles from './page.module.css';
import { Wrench } from 'lucide-react';
import { getGoogleSheet } from '@/lib/googleSheets';
import AddMaintenanceButton from '@/components/AddMaintenanceButton';
import MarkCompleteButton from '@/components/MarkCompleteButton';

export const revalidate = 0;

async function getMaintenanceData() {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle['Maintenance'];
    const rows = await sheet.getRows();
    return rows.map(r => ({ ...r.toObject(), _rowNumber: r.rowNumber })) as any[];
  } catch (error) {
    console.error("Failed to fetch maintenance:", error);
    return [];
  }
}

export default async function MaintenanceHub() {
  const maintenance = await getMaintenanceData();

  const upcomingTasks = maintenance.filter((m: any) => m.status !== 'Completed');
  const historyTasks = maintenance.filter((m: any) => m.status === 'Completed');

  // Find the closest upcoming maintenance
  const upcoming = upcomingTasks.sort((a: any, b: any) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())[0];
  
  let daysLeft = 0;
  if (upcoming) {
    const diffTime = Math.abs(new Date(upcoming.nextDueDate).getTime() - new Date().getTime());
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <>
      <TopBar title="Service Hub" />
      
      <main className={styles.main}>
        {/* Countdown Timer */}
        {upcoming && (
          <section className={styles.countdownSection}>
            <div className={styles.timerCard}>
              <h2 className={styles.daysLeft}>{daysLeft}</h2>
              <p className={styles.timerLabel}>Days until next {upcoming.title}</p>
            </div>
          </section>
        )}

        {/* Upcoming Tasks */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>Upcoming Maintenance</h2>
          <div className={styles.historyList}>
            {upcomingTasks.map((record: any) => (
              <ActionCard
                key={record.id}
                title={record.title}
                subtitle={`Due: ${record.nextDueDate} ${record.technician ? '• ' + record.technician : ''}`}
                statusText="SCHEDULED"
                statusType="warning"
                icon={<Wrench size={24} />}
                actionButton={<MarkCompleteButton rowNumber={record._rowNumber} />}
              />
            ))}
            {upcomingTasks.length === 0 && <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>No upcoming maintenance.</p>}
          </div>
        </section>

        {/* Service History */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>Service History</h2>
          <div className={styles.historyList}>
            {historyTasks.map((record: any) => (
              <ActionCard
                key={record.id}
                title={record.title}
                subtitle={`Completed: ${record.date}`}
                statusText="Completed"
                statusType="healthy"
                icon={<Wrench size={24} />}
              />
            ))}
            {historyTasks.length === 0 && <p style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>No past history.</p>}
          </div>
        </section>

        {/* FAB */}
        <AddMaintenanceButton />
      </main>

      <BottomNav />
    </>
  );
}
