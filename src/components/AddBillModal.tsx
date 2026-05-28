'use client';
import React, { useState, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { addBill } from '@/app/actions';
import styles from './Modal.module.css';

export default function AddBillModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      addBill(formData).then(() => {
        setIsOpen(false);
      });
    });
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setIsOpen(true)}>
        <Plus size={24} color="white" />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.title}>Add New Bill</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bill Name</label>
                <input type="text" name="name" required className={styles.input} placeholder="e.g. Internet Bill" />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Amount (£)</label>
                <input type="number" step="0.01" name="amount" required className={styles.input} placeholder="0.00" />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Due Date</label>
                <input type="date" name="dueDate" required className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select name="status" required className={styles.select}>
                  <option value="DUE">DUE</option>
                  <option value="PAID">PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={isPending}>
                  {isPending ? <Loader2 size={16} className="spinner" /> : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
