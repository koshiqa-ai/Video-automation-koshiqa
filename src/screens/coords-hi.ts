// Gesture targets for the Hindi FAQ screens (390 × 844 phone space).
// Kept free of React/Remotion imports so Node scripts (audio mix) can read the timeline.

export type AppId = "camera" | "fit" | "koshiqa" | "clock" | "photos" | "messages" | "calendar" | "settings";
export const APPS: { id: AppId; label: string; col: number; row: number; color?: string; glyph?: string }[] = [
  { id: "camera", label: "Camera", col: 0, row: 0, color: "#3C4043", glyph: "📷" },
  { id: "fit", label: "Fit", col: 1, row: 0 },
  { id: "koshiqa", label: "Koshiqa", col: 2, row: 0 },
  { id: "clock", label: "Clock", col: 3, row: 0, color: "#1F3A5F", glyph: "⏰" },
  { id: "photos", label: "Photos", col: 0, row: 1, color: "#FDE7D3", glyph: "🖼️" },
  { id: "messages", label: "Messages", col: 1, row: 1, color: "#D3E3FD", glyph: "💬" },
  { id: "calendar", label: "Calendar", col: 2, row: 1, color: "#E6F4EA", glyph: "📅" },
  { id: "settings", label: "Settings", col: 3, row: 1, color: "#E8EAED", glyph: "⚙️" },
];
export const COLX = [64, 151, 239, 326];
export const ROWY = [420, 528];
export const ICON = 62;

/** Centre of an app icon on the launcher */
export const iconCenter = (id: AppId) => {
  const a = APPS.find((x) => x.id === id)!;
  return { x: COLX[a.col], y: ROWY[a.row] + ICON / 2 };
};
/** "Uninstall" row of the long-press menu under an icon */
export const LAUNCHER_MENU_UNINSTALL = (id: AppId) => {
  const c = iconCenter(id);
  return { x: c.x, y: c.y + 56 + 48 + 24 };
};
/** First (Gmail) row of the account chooser sheet */
export const ACCOUNT_ROW_Y = 844 - 372 + 10 + 5 + 48 + 34 + 35;
export const FIT_AVATAR = { x: 346, y: 80 };
export const FIT_EMAIL_ROW = { x: 195, y: 104 + 26 + 72 + 12 + 28 + 16 + 27 };
export const CHANGE_BTN = { x: 322, y: 172 + 18 + 44 + 16 + 17 + 6 + 15 };
export const STORE_INSTALL = { x: 195, y: 324 };
export const DIALOG_ALLOW = { x: 195, y: 520 };
