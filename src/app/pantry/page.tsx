import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import PantryClient from '@/components/PantryClient';
import AddPantryButton from '@/components/AddPantryButton';
import styles from './page.module.css';
import { getGoogleSheet } from '@/lib/googleSheets';

export const revalidate = 0;

async function getPantryData() {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle['Pantry'];
    const rows = await sheet.getRows();
    return rows.map(r => ({ ...r.toObject(), _rowNumber: r.rowNumber })).filter((r: any) => r.status !== 'Removed');
  } catch (error) {
    console.error("Failed to fetch pantry:", error);
    return [];
  }
}

export default async function Pantry() {
  const pantryItems = await getPantryData();

  return (
    <>
      <TopBar title="Smart Pantry" />
      <main className={styles.main}>
        <PantryClient initialItems={pantryItems} />
        <AddPantryButton />
      </main>
      <BottomNav />
    </>
  );
}
