"use client";
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './AddMaintenanceButton.module.css';
import { addMaintenance } from '@/app/actions';

export default function AddMaintenanceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await addMaintenance(formData);
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setIsOpen(true)}>
        <Plus size={24} color="white" />
      </button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add Maintenance</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Appliance / System</label>
                <input type="text" name="title" required placeholder="e.g. HVAC Filter" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Next Due Date</label>
                <input type="text" name="nextDueDate" required placeholder="e.g. 2026-10-15" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Technician / Company</label>
                <input type="text" name="technician" placeholder="e.g. John's Plumbing" className={styles.input} />
              </div>
              
              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Maintenance'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
