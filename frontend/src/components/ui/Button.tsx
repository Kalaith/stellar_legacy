// components/ui/Button.tsx
import React from 'react';
import { uiConstants } from '../../constants/uiConstants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = React.memo(({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = uiConstants.BUTTONS.BASE_CLASSES;

  const variantClasses = {
    primary: uiConstants.BUTTONS.VARIANT.PRIMARY,
    secondary: uiConstants.BUTTONS.VARIANT.SECONDARY,
    danger: uiConstants.BUTTONS.VARIANT.DANGER,
  };

  const sizeClasses = {
    sm: uiConstants.BUTTONS.SIZE.SM,
    md: uiConstants.BUTTONS.SIZE.MD,
    lg: uiConstants.BUTTONS.SIZE.LG,
  };

  const disabledClasses = props.disabled ? uiConstants.BUTTONS.DISABLED : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;