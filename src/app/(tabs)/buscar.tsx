import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';

export default function BuscarScreen() {
  return (
    <Screen title="Buscar">
      <ComingSoon icon="search" message="Busca canciones, artistas y álbumes" stage={6} />
    </Screen>
  );
}
