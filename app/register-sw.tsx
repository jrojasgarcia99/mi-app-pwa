'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // Busca actualizaciones cada minuto
      setInterval(() => reg.update(), 60 * 1000);

      // Si hay un SW nuevo, recarga la app automáticamente
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    });
  }, []);
  return null;
}