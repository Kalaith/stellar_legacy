// components/ui/Button.tsx
import React from 'react';
import { UI_CONSTANTS } from '../../constants/uiConstants';

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
  const baseClasses = UI_CONSTANTS.BUTTONS.BASE_CLASSES;

  const variantClasses = {
    primary: UI_CONSTANTS.BUTTONS.VARIANT.PRIMARY,
    secondary: UI_CONSTANTS.BUTTONS.VARIANT.SECONDARY,
    danger: UI_CONSTANTS.BUTTONS.VARIANT.DANGER,
  };

  const sizeClasses = {
    sm: UI_CONSTANTS.BUTTONS.SIZE.SM,
    md: UI_CONSTANTS.BUTTONS.SIZE.MD,
    lg: UI_CONSTANTS.BUTTONS.SIZE.LG,
  };

  const disabledClasses = props.disabled ? UI_CONSTANTS.BUTTONS.DISABLED : '';

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