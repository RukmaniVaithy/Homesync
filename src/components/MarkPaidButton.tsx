"use client";
import React, { useTransition } from 'react';
import { CheckCircle } from 'lucide-react';
import { markBillAsPaid } from '@/app/actions';
import styles from './MarkPaidButton.module.css';

export default function MarkPaidButton({ rowNumber }: { rowNumber: number }) {
  const [isPending, startTransition] = useTransition();

  const handlePaid = () => {
    startTransition(() => {
      markBillAsPaid(rowNumber);
    });
  };

  return (
    <button 
      className={styles.btn}
      onClick={handlePaid}
      disabled={isPending}
    >
      <CheckCircle size={16} />
      {isPending ? 'Marking...' : 'Mark Paid'}
    </button>
  );
}
