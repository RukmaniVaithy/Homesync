"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UserSwitcher.module.css';

export default function UserSwitcher() {
  const router = useRouter();
  const user1 = process.env.NEXT_PUBLIC_USER1_NAME || 'User 1';
  const user2 = process.env.NEXT_PUBLIC_USER2_NAME || 'User 2';
  
  const [activeUser, setActiveUser] = useState<string>('');

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )homesync_user=([^;]+)'));
    if (match) {
      setActiveUser(decodeURIComponent(match[2]));
    } else {
      setActiveUser(user1);
      document.cookie = `homesync_user=${encodeURIComponent(user1)}; path=/; max-age=31536000`;
    }
  }, [user1]);

  const toggleUser = () => {
    const nextUser = activeUser === user1 ? user2 : user1;
    setActiveUser(nextUser);
    document.cookie = `homesync_user=${encodeURIComponent(nextUser)}; path=/; max-age=31536000`;
    router.refresh();
  };

  if (!activeUser) return <div className={styles.placeholder} />;

  const initial = activeUser.charAt(0).toUpperCase();

  return (
    <button className={styles.avatarBtn} onClick={toggleUser} title={`Current user: ${activeUser}. Click to switch.`}>
      {initial}
    </button>
  );
}
