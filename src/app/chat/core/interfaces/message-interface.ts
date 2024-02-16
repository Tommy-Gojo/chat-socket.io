export enum MessageType {
  CHAT = 'CHAT',
  LEAVE = 'LEAVE',
  JOIN = 'JOIN'
}

export interface MessageInterface {
  avatarUrl: any;
  sender: string;
  content?: string;
  type: MessageType;
  isCurrentUserMessage?: boolean;
}