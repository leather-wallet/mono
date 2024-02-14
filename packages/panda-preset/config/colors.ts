import { colors as leatherColors } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

export const colors = defineTokens.colors({
  current: { value: 'currentColor' },
  ...leatherColors,
});
