import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';

export default function BibliotecaScreen() {
  return (
    <Screen title="Biblioteca">
      <ComingSoon icon="library-music" message="Aquí aparecerá toda tu música" stage={2} />
    </Screen>
  );
}
