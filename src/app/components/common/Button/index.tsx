import styles from './styles.module.css'
import type { ButtonProps } from './types'

export const Button = function({
  variant = 'secondary',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classNames = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classNames} {...rest}>
      {children}
    </button>
  )
}
