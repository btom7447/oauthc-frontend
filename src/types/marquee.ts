export interface MarqueeItem {
  id: string;
  text: string;
  url?: string;
  isExternal?: boolean;
}

export interface MarqueeProps {
  items?: MarqueeItem[];
  fallbackText?: string;
}
