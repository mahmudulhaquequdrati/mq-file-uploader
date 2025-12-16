import type { ProgressBarProps } from '../types';

/**
 * Progress bar component for upload status
 */
export function ProgressBar({
  value,
  className = '',
  showText = false,
  status = 'uploading',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const statusClass = status !== 'uploading' && status !== 'pending'
    ? `mq-progress--${status}`
    : '';

  return (
    <div className={`mq-progress-wrapper ${className}`}>
      <div className={`mq-progress ${statusClass}`}>
        <div
          className="mq-progress__bar"
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showText && (
        <span className="mq-progress__text">{clampedValue}%</span>
      )}
    </div>
  );
}
