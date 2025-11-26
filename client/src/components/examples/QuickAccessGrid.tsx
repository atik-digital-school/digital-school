import QuickAccessGrid from '../QuickAccessGrid';

export default function QuickAccessGridExample() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <QuickAccessGrid onSelect={(id) => console.log('Selected:', id)} />
    </div>
  );
}
