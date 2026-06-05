import React from 'react';
import { Bell } from 'lucide-react';
import styles from './TopBar.module.css';
import UserSwitcher from './UserSwitcher';

export default function TopBar({ title }: { title: string }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <UserSwitcher />
        <button className={styles.notificationBtn}>
          <Bell size={24} />
        </button>
      </div>
    </header>
  );
}
