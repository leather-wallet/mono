import { definePreset } from '@pandacss/dev';

import { breakpoints } from './config/breakpoints';
import { keyframes } from './config/keyframes';
import { buttonRecipe } from './config/recipes/button-recipe';
import { linkRecipe } from './config/recipes/link-recipe';
import { semanticTokens } from './config/semantic-tokens';
import { tokens } from './config/tokens';
import { textStyles } from './config/typography';

export const leatherPandaPreset = definePreset({
  presets: [],
  theme: {
    extend: {
      semanticTokens,
      tokens,
      keyframes,
      textStyles,
      breakpoints,
      recipes: {
        button: buttonRecipe,
        link: linkRecipe,
      },
    },
  },
});
