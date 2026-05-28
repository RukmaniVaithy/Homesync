"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, Package, ShoppingCart, Wrench } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Hub', path: '/', icon: Home },
    { name: 'Finances', path: '/bills', icon: ClipboardList },
    { name: 'Pantry', path: '/pantry', icon: Package },
    { name: 'Shopping', path: '/shopping', icon: ShoppingCart },
    { name: 'Service', path: '/maintenance', icon: Wrench },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link key={item.name} href={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Icon size={24} />
            <span className={styles.label}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
