"use client";
import React, { useTransition } from 'react';
import { CheckCircle } from 'lucide-react';
import { markMaintenanceComplete } from '@/app/actions';
import styles from './MarkPaidButton.module.css'; // Reusing the same button styles

export default function MarkCompleteButton({ rowNumber }: { rowNumber: number }) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(() => {
      markMaintenanceComplete(rowNumber);
    });
  };

  return (
    <button 
      className={styles.btn}
      onClick={handleComplete}
      disabled={isPending}
    >
      <CheckCircle size={16} />
      {isPending ? 'Marking...' : 'Complete'}
    </button>
  );
}
