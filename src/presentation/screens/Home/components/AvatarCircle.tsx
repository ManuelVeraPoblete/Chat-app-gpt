import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './AvatarCircle.styles';

type Props = {
  name: string;
  size: number;
  badge?: 'online' | 'ai' | 'me';
};

export function AvatarCircle({ name, size, badge }: Props) {
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.initials}>{initials}</Text>

      {badge === 'online' && <View style={styles.badgeOnline} />}
      {badge === 'ai' && <View style={styles.badgeAi} />}
      {badge === 'me' && <View style={styles.badgeMe} />}
    </View>
  );
}

function getInitials(name: string): string {
  const parts = (name ?? '').trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
