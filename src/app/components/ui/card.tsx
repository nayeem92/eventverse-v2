// src/components/ui/card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div className="card-content">{children}</div>;
};
