'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // busca actualizaciones cada 60s
      const id = setInterval(() => reg.update(), 60_000);

      // si el SW nuevo toma control, recarga para ver la nueva versión
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      return () => clearInterval(id);
    });
  }, []);

  return null;
}