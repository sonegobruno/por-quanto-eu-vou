import styled from 'styled-components/native';
import { Text as ElementText } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const Container = styled(KeyboardAwareScrollView).attrs(() => ({
  contentContainerStyle: { padding: RFValue(16), paddingTop: RFValue(56) },
  keyboardShouldPersistTaps: 'handled',
}))``;

export const Title = styled(ElementText)`
  color: ${({ theme }) => theme.colors.neutral_500};
  font-size: ${RFValue(24)}px;
  line-height: ${RFValue(32)}px;
  font-family: ${({ theme }) => theme.fonts.roboto_bold};
`;
