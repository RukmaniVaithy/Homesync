import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ActionCard from '@/components/ActionCard';
import styles from './page.module.css';
import { ShoppingBag, MapPin } from 'lucide-react';
import { getGoogleSheet } from '@/lib/googleSheets';

export const revalidate = 0;

async function getShoppingList() {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle['Pantry'];
    const rows = await sheet.getRows();
    return rows.map(r => r.toObject()).filter((item: any) => item.status === 'Running Low');
  } catch (error) {
    console.error("Failed to fetch shopping list:", error);
    return [];
  }
}

export default async function ShoppingList() {
  const items = await getShoppingList();

  return (
    <>
      <TopBar title="Shopping List" />
      <main className={styles.main}>
        {/* Map / Nearest Stockist Mock */}
        <section className={styles.mapSection}>
          <div className={styles.mapCard}>
            <div className={styles.mapIconWrapper}>
              <MapPin size={24} color="white" />
            </div>
            <div className={styles.mapInfo}>
              <h3>Nearest Stockist</h3>
              <p>Tesco Extra (1.2 miles away)</p>
            </div>
          </div>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>To Buy ({items.length})</h2>
          {items.length === 0 ? (
            <p className={styles.emptyText}>Your shopping list is empty.</p>
          ) : (
            <div className={styles.listContainer}>
              {items.map((item: any) => (
                <ActionCard
                  key={item.id}
                  title={item.name}
                  subtitle={`Marked low by ${item.lastUpdatedBy}`}
                  icon={<ShoppingBag size={24} />}
                  actionButton={
                    <button className={styles.checkBtn}>
                      Bought
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
