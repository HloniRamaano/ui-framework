export function SavingOverlay() {
  return <div className="saving-overlay" onClick={e => e.stopPropagation()} />;
}