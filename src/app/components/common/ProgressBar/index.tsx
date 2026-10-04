import styles from './styles.module.css'
import type { ProgressBarProps } from './types'

export const ProgressBar = function({ percent, label }: ProgressBarProps) {
  const roundedPercent =
    percent === null ? null : Math.min(100, Math.max(0, Math.round(percent)))
  const widthPercent = roundedPercent ?? 100

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={roundedPercent ?? undefined}
      aria-valuetext={roundedPercent === null ? 'Размер неизвестен' : `${roundedPercent}%`}
    >
      <div
        className={
          roundedPercent === null ? `${styles.fill} ${styles.indeterminate}` : styles.fill
        }
        style={{ width: `${widthPercent}%` }}
      />
    </div>
  )
}
