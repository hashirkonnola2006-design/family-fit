import React from 'react';
import { cn } from '@/lib/utils';

interface MenuToggleIconProps extends React.SVGProps<SVGSVGElement> {
  open: boolean;
  duration?: number;
  className?: string;
}

export function MenuToggleIcon({
  open,
  duration = 300,
  className,
  ...props
}: MenuToggleIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('transition-all', className)}
      style={{ transitionDuration: `${duration}ms` }}
      {...props}
    >
      <line
        x1="4"
        y1={open ? '18' : '6'}
        x2="20"
        y2={open ? '6' : '6'}
        className="transition-all origin-center"
        style={{
          transitionDuration: `${duration}ms`,
          transform: open ? 'rotate(45deg) translate(0px, 0px)' : 'none',
          transformOrigin: '12px 12px',
        }}
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        className="transition-opacity"
        style={{
          transitionDuration: `${duration}ms`,
          opacity: open ? 0 : 1,
        }}
      />
      <line
        x1="4"
        y1={open ? '6' : '18'}
        x2="20"
        y2={open ? '18' : '18'}
        className="transition-all origin-center"
        style={{
          transitionDuration: `${duration}ms`,
          transform: open ? 'rotate(-45deg) translate(0px, 0px)' : 'none',
          transformOrigin: '12px 12px',
        }}
      />
    </svg>
  );
}
