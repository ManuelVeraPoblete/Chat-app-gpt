import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './ChatListItem.styles';
import { AvatarCircle } from './AvatarCircle';

export type ChatRow = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;

  lastMessage?: string;
  lastMessageAt?: Date;
};

type Props = {
  user: ChatRow;
  onPress: () => void;
};

export function ChatListItem({ user, onPress }: Props) {
  const timeLabel = useMemo(() => {
    if (!user.lastMessageAt) return '';
    return formatTime(user.lastMessageAt);
  }, [user.lastMessageAt]);

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <AvatarCircle name={user.displayName} size={54} badge="online" />

      <View style={styles.textCol}>
        <View style={styles.topLine}>
          <Text numberOfLines={1} style={styles.name}>
            {user.displayName}
          </Text>

          <Text style={styles.time}>{timeLabel}</Text>
        </View>

        <Text numberOfLines={1} style={styles.preview}>
          {user.lastMessage ?? user.email}
        </Text>
      </View>
    </Pressable>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const sameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (!sameDay) return 'Ayer';

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
