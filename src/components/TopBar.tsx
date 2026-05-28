import React from 'react';
import { Bell } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <div className={styles.avatar}>S</div>
      <h1 className={styles.title}>{title}</h1>
      <button className={styles.notificationBtn}>
        <Bell size={24} />
      </button>
    </header>
  );
}
