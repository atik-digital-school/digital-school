import IdleScreen from '../IdleScreen';

export default function IdleScreenExample() {
  return (
    <IdleScreen onActivate={() => console.log('Kiosk activated')} />
  );
}
