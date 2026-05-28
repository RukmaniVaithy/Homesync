"use client";
import React, { useState, useTransition } from 'react';
import ActionCard from './ActionCard';
import { PackageOpen, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import styles from './PantryClient.module.css';
import { togglePantryItemStatus, removePantryItem } from '@/app/actions';
import AddPantryItemModal from './AddPantryItemModal';

export default function PantryClient({ initialItems }: { initialItems: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (rowNumber: number, currentStatus: string) => {
    startTransition(() => {
      togglePantryItemStatus(rowNumber, currentStatus);
    });
  };

  const handleDelete = (rowNumber: number) => {
    if (confirm("Are you sure you want to remove this item from the pantry?")) {
      startTransition(() => {
        removePantryItem(rowNumber);
      });
    }
  };

  const categories = Array.from(new Set(initialItems.map(i => i.category)));

  return (
    <div className={styles.container}>
      {isPending && <div className={styles.loadingOverlay}><Loader2 className={styles.spinner} /> Updating...</div>}
      {categories.map(category => (
        <section key={category as string} className={styles.section}>
          <h2 className={styles.sectionTitle}>{category as string}</h2>
          {initialItems.filter(i => i.category === category).map(item => (
            <ActionCard
              key={item.id}
              title={item.name}
              subtitle={`Last updated by ${item.lastUpdatedBy}`}
              statusText={item.status}
              statusType={item.status === 'Running Low' ? 'warning' : 'healthy'}
              icon={<PackageOpen size={24} />}
              actionButton={
                <div className={styles.actionGroup}>
                  <button 
                    className={`${styles.toggleBtn} ${item.status === 'Running Low' ? styles.btnRestock : styles.btnLow}`}
                    onClick={() => handleToggle(item._rowNumber, item.status)}
                    disabled={isPending}
                  >
                    {item.status === 'Running Low' ? (
                      <><RefreshCw size={16} /> Restock</>
                    ) : (
                      "Mark Low"
                    )}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item._rowNumber)}
                    disabled={isPending}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              }
            />
          ))}
        </section>
      ))}
      <AddPantryItemModal existingCategories={categories as string[]} />
    </div>
  );
}
