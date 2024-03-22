import { ComponentPropsWithoutRef } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

import { Theme } from '@leather-wallet/ui/native';
import {
  BackgroundColorProps,
  BackgroundColorShorthandProps,
  BaseTheme,
  BorderProps,
  LayoutProps,
  OpacityProps,
  ResponsiveValue,
  SpacingProps,
  SpacingShorthandProps,
  TextShadowProps,
  TypographyProps,
  VariantProps,
  VisibleProps,
  backgroundColor,
  backgroundColorShorthand,
  border,
  createRestyleComponent,
  createVariant,
  layout,
  opacity,
  spacing,
  spacingShorthand,
  textShadow,
  typography,
  visible,
} from '@shopify/restyle';

export interface TextColorProps<Theme extends BaseTheme> {
  textColor?: ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']>;
  textDecorationColor?: ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']>;
}

type BaseButtonProps<Theme extends BaseTheme> = VariantProps<Theme, 'textVariants', 'textVariant'> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  TypographyProps<Theme> &
  SpacingProps<Theme> &
  SpacingShorthandProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  BackgroundColorShorthandProps<Theme> &
  LayoutProps<Theme> &
  TextColorProps<Theme> &
  TextShadowProps<Theme> &
  ComponentPropsWithoutRef<typeof RNTouchableOpacity>;

// export const textColor = [
//   createRestyleFunction({
//     property: 'textColor',
//     themeKey: 'colors',
//   }),
//   createRestyleFunction({
//     property: 'textDecorationColor',
//     themeKey: 'colors',
//   }),
// ];

export const buttonRestyleFunctions = [
  opacity,
  visible,
  typography,
  spacing,
  spacingShorthand,
  textShadow,
  border,
  backgroundColor,
  backgroundColorShorthand,
  layout,
  createVariant({ themeKey: 'textVariants', property: 'textVariant' }),
];

// type Props = BaseButtonProps<Theme> & ComponentPropsWithoutRef<typeof RNTouchableOpacity>;

// const composedRestyleFunction = composeRestyleFunctions<Theme, Props>(buttonRestyleFunctions);

export const TouchableOpacity = createRestyleComponent<BaseButtonProps<Theme>, Theme>(
  buttonRestyleFunctions,
  RNTouchableOpacity
);

// export function TouchableOpacity({ title, ...rest }: Props & { title: string }) {
//   const props = useRestyle(composedRestyleFunction, rest);
//   console.log(props.textV);
//   return (
//     <RNTouchableOpacity {...props}>
//       <Text variant={props.textVariant}>{title}</Text>
//     </RNTouchableOpacity>
//   );
// }
