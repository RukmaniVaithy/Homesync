import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ActionCard from '@/components/ActionCard';
import styles from './page.module.css';
import { AlertCircle, Wrench, CreditCard } from 'lucide-react';
import { getGoogleSheet } from '@/lib/googleSheets';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import MarkPaidButton from '@/components/MarkPaidButton';

async function getDashboardData() {
  try {
    const doc = await getGoogleSheet();
    
    const billsSheet = doc.sheetsByTitle['Finances'];
    const billsRows = await billsSheet.getRows();
    const bills = billsRows.map(r => ({ ...r.toObject(), _rowNumber: r.rowNumber }));
    
    const maintSheet = doc.sheetsByTitle['Maintenance'];
    const maintRows = await maintSheet.getRows();
    const maintenance = maintRows.map(r => ({ ...r.toObject(), _rowNumber: r.rowNumber }))
      .filter((m: any) => m.status !== 'Completed');
    
    const activitySheet = doc.sheetsByTitle['Activity'];
    const activityRows = await activitySheet.getRows();
    const activity = activityRows.map(r => r.toObject()).reverse().slice(0, 5);
    
    return { bills, maintenance, activity };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { bills: [], maintenance: [], activity: [] };
  }
}

export default async function Home() {
  const { bills, maintenance, activity } = await getDashboardData();

  // Basic logic for Dashboard
  const overdueBills = bills.filter((b: any) => b.status === 'OVERDUE');
  
  // Calculate a mock health score based on outstanding issues
  const healthScore = Math.max(0, 100 - (overdueBills.length * 10));

  return (
    <>
      <TopBar title="HomeSync" />
      
      <main className={styles.main}>
        {/* Household Health Score */}
        <section className={styles.healthSection}>
          <div className={styles.healthCircle}>
            <div className={styles.healthScore}>{healthScore}</div>
            <div className={styles.healthLabel}>Score</div>
          </div>
          <p className={styles.healthText}>
            {healthScore === 100 ? "Household is running perfectly." : "Action required to restore balance."}
          </p>
        </section>

        {/* Urgent Alerts */}
        {(overdueBills.length > 0) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Urgent Alerts</h2>
            {overdueBills.map((bill: any) => (
              <ActionCard 
                key={bill.id}
                title={bill.name}
                subtitle={`Overdue: £${bill.amount}`}
                statusText="OVERDUE"
                statusType="critical"
                icon={<AlertCircle size={24} />}
              />
            ))}
          </section>
        )}

        {/* Upcoming */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming</h2>
          {maintenance.slice(0, 2).map((task: any) => (
            <ActionCard
              key={task.id}
              title={task.title}
              subtitle={`Due: ${task.nextDueDate}`}
              statusText="SCHEDULED"
              statusType="warning"
              icon={<Wrench size={24} />}
              actionButton={<MarkCompleteButton rowNumber={task._rowNumber} />}
            />
          ))}
          {bills.filter((b: any) => b.status === 'DUE').slice(0, 1).map((bill: any) => (
            <ActionCard
              key={bill.id}
              title={bill.name}
              subtitle={`Due: ${bill.dueDate}`}
              statusText="DUE SOON"
              statusType="warning"
              icon={<CreditCard size={24} />}
              actionButton={<MarkPaidButton rowNumber={bill._rowNumber} />}
            />
          ))}
        </section>

        {/* Activity Feed */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityFeed}>
            {activity.map((item: any) => (
              <div key={item.id} className={styles.activityItem}>
                <span className={styles.activityUser}>{item.user}</span>
                <span className={styles.activityAction}>{item.action}</span>
                <span className={styles.activityTime}>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
            {activity.length === 0 && <p className={styles.emptyText}>No recent activity.</p>}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
