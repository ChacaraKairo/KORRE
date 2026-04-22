import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from 'react-native';
import {
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';
import { buttonStyles as styles } from '../../../styles/components/buttonStyles';

interface MainButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: LucideIcon;
}

export const MainButton: React.FC<MainButtonProps> = ({
  title,
  onPress,
  icon: Icon,
  ...props
}) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.7}
    {...props}
  >
    <Text style={styles.text}>{title}</Text>
    {Icon ? (
      <Icon color="#121212" size={24} strokeWidth={3} />
    ) : (
      <ChevronRight
        color="#121212"
        size={24}
        strokeWidth={3}
      />
    )}
  </TouchableOpacity>
);
