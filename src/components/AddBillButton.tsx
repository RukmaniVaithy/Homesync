"use client";
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './AddBillButton.module.css';
import { addBill } from '@/app/actions';

export default function AddBillButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await addBill(formData);
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
              <h3>Add New Bill</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Bill Name</label>
                <input type="text" name="name" required placeholder="e.g. Electricity" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Amount (£)</label>
                <input type="number" name="amount" required step="0.01" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Due Date</label>
                <input type="text" name="dueDate" required placeholder="e.g. 15th" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select name="status" className={styles.input}>
                  <option value="DUE">DUE</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>
              
              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Bill'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
