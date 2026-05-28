"use client";
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './AddPantryButton.module.css';
import { addPantryItem } from '@/app/actions';

export default function AddPantryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await addPantryItem(formData);
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
              <h3>Add Pantry Item</h3>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Item Name</label>
                <input type="text" name="name" required placeholder="e.g. Olive Oil" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input type="text" name="category" required placeholder="e.g. Everyday Essentials" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select name="status" className={styles.input}>
                  <option value="In Stock">In Stock</option>
                  <option value="Running Low">Running Low</option>
                </select>
              </div>
              
              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
