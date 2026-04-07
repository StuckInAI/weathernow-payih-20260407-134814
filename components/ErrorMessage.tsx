import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>⚠️</span>
      <div className={styles.content}>
        <h3 className={styles.title}>Something went wrong</h3>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
