import {
  Brain,
  Book,
  Code,
  Calculator,
  Music,
  Palette,
  Briefcase,
  Globe,
  Atom,
  Cpu,
  Database,
  Leaf,
  Zap,
  Heart,
  Smile,
  Coffee,
} from "lucide-react";

// 1. The list of available icons for the picker
export const AVAILABLE_ICONS = [
  { id: "brain", icon: Brain, label: "Brain" },
  { id: "book", icon: Book, label: "Book" },
  { id: "code", icon: Code, label: "Code" },
  { id: "calc", icon: Calculator, label: "Math" },
  { id: "atom", icon: Atom, label: "Science" },
  { id: "globe", icon: Globe, label: "Geo" },
  { id: "leaf", icon: Leaf, label: "Bio" },
  { id: "cpu", icon: Cpu, label: "Tech" },
  { id: "database", icon: Database, label: "Data" },
  { id: "music", icon: Music, label: "Art" },
  { id: "briefcase", icon: Briefcase, label: "Work" },
  { id: "zap", icon: Zap, label: "Energy" },
  { id: "heart", icon: Heart, label: "Health" },
  { id: "coffee", icon: Coffee, label: "Casual" },
];

// 2. A helper to render the icon based on the string name
export const getIconComponent = (iconName: string | null) => {
  const found = AVAILABLE_ICONS.find((i) => i.id === iconName);
  return found ? found.icon : null; // Returns null if no icon found (we'll use a default)
};
