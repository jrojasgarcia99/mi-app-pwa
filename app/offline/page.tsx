export default function Offline() {
  return (
    <main style={{maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'}}>
      <h1 style={{fontSize: 28, fontWeight: 800, marginBottom: 12}}>Sin conexión</h1>
      <p>Estás offline. Algunas funciones no están disponibles.</p>
      <ul>
        <li>Vuelve a intentar cuando tengas internet.</li>
        <li>Las páginas visitadas recientemente podrían seguir cargando.</li>
      </ul>
    </main>
  );
}