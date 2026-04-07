'use client';

import { useState, FormEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for a city..."
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading || !value.trim()}
        >
          {loading ? (
            <span className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
}
