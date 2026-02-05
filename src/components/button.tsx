import clsx from 'clsx';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import '../PricingPlans.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}

export default function Button({ children, variant = 'primary', ...props }: Props) {
    return (
        <button
            className={clsx(
                variant === 'primary' && 'current-plan-indicator',
                variant === 'secondary' && 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#e5e5e5] border border-[#2a2a2a] hover:border-[#3a3a3a]',
                props.className
            )}
            {...props}
        >
            {children}
        </button>
    )
}