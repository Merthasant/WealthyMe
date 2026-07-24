import { icons } from "lucide-react";

// Nama icon diambil dari key yang tersedia di lucide-react, misal "Banknote", "Wallet", dll
type IconName = keyof typeof icons;

interface DynamicIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

function DynamicIcon({ name, size = 20, color, className }: DynamicIconProps) {
  // 1. Ambil komponen icon dari nama yang dikasih
  const Icon = icons[name];

  // 2. Kalau nama icon tidak ditemukan, jangan render apa-apa
  if (!Icon) {
    return null;
  }

  // 3. Render icon-nya
  return <Icon size={size} color={color} className={className} />;
}

// Contoh pemakaian:
// <DynamicIcon name="Wallet" size={24} />
// <DynamicIcon name="Landmark" className="text-blue-500" />

export { DynamicIcon };
export type { IconName };
