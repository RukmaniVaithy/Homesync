import React from 'react';
import styles from './ActionCard.module.css';

interface ActionCardProps {
  title: string;
  subtitle?: string;
  statusText?: string;
  statusType?: 'healthy' | 'warning' | 'critical' | 'neutral';
  actionButton?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function ActionCard({ title, subtitle, statusText, statusType = 'neutral', actionButton, icon }: ActionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
        <div className={styles.details}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {statusText && (
            <span className={`${styles.statusBadge} ${styles[statusType]}`}>
              {statusText}
            </span>
          )}
        </div>
      </div>
      {actionButton && <div className={styles.action}>{actionButton}</div>}
    </div>
  );
}
