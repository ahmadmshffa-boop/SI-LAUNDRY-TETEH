import React from 'react';
import { statusClass, paymentBadgeClass } from '../data/formatters';

export default function Badge({ children, kind, type = 'status' }) {
  let badgeKind = kind;
  if (!badgeKind) {
    if (type === 'payment') {
      badgeKind = paymentBadgeClass(children);
    } else {
      badgeKind = statusClass(children);
    }
  }

  return (
    <span className={`badge ${badgeKind}`}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}
