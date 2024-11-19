import { 
  Wallet, ShoppingBag, Home, Car, Plane, Book, 
  Briefcase, Heart, Music, Coffee, Utensils 
} from 'lucide-react';

const iconMap: { [key: string]: any } = {
  wallet: Wallet,
  shopping: ShoppingBag,
  home: Home,
  car: Car,
  travel: Plane,
  education: Book,
  work: Briefcase,
  health: Heart,
  entertainment: Music,
  food: Utensils,
  coffee: Coffee,
};

export const generateIconFromName = (name: string): any => {
  const lowercaseName = name.toLowerCase();
  
  // Try to match keywords with icons
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (lowercaseName.includes(keyword)) {
      return icon;
    }
  }
  
  // Default to Wallet if no match found
  return Wallet;
};