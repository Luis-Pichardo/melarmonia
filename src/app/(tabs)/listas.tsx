import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';

export default function ListasScreen() {
  return (
    <Screen title="Listas">
      <ComingSoon icon="queue-music" message="Tus favoritos y listas de reproducción" stage={5} />
    </Screen>
  );
}
