'use client';
import React, { useState, useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { addPantryItem } from '@/app/actions';
import styles from './Modal.module.css';

export default function AddPantryItemModal({ existingCategories }: { existingCategories: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      addPantryItem(formData).then(() => {
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
            <h2 className={styles.title}>Add Pantry Item</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Item Name</label>
                <input type="text" name="name" required className={styles.input} placeholder="e.g. Olive Oil" />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <input type="text" name="category" list="category-list" required className={styles.input} placeholder="e.g. Baking" />
                <datalist id="category-list">
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select name="status" required className={styles.select}>
                  <option value="In Stock">In Stock</option>
                  <option value="Running Low">Running Low</option>
                </select>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={isPending}>
                  {isPending ? <Loader2 size={16} className="spinner" /> : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
