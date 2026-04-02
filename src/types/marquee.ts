export interface MarqueeItem {
  id: string;
  text: string;
  type: "info" | "urgent" | "event";
  link?: string;
  isExternal?: boolean;
  active: boolean;
  order: number;
}

export interface MarqueeSettings {
  enabled: boolean;
  speed: "slow" | "normal" | "fast";
}
