import {
  AirVent,
  ArrowUpDown,
  Armchair,
  Baby,
  Bath,
  BedDouble,
  Building2,
  Car,
  CalendarDays,
  Check,
  ChefHat,
  Coffee,
  CookingPot,
  Cross,
  Dice5,
  DoorOpen,
  Droplets,
  Fan,
  Flame,
  Flower2,
  Gamepad2,
  KeyRound,
  Laptop,
  Lock,
  Moon,
  Mountain,
  PawPrint,
  Refrigerator,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShowerHead,
  Snowflake,
  Sparkles,
  SquareParking,
  Sun,
  Tv,
  Utensils,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  Wine,
  type LucideIcon,
} from "lucide-react";

/**
 * PMS amenity names (Hostaway + Guesty free text) → a matching Lucide icon.
 * First rule wins, so specific phrases sit above generic words; anything
 * unmatched keeps the check mark. Built from the live amenity vocabulary
 * of all current listings.
 */
const AMENITY_ICON_RULES: Array<[RegExp, LucideIcon]> = [
  // connectivity & work
  [/wifi|wireless|internet/i, Wifi],
  [/laptop|workspace/i, Laptop],
  // climate
  [/air condition/i, AirVent],
  [/ceiling fan|fan\b/i, Fan],
  [/heating|heater/i, Flame],
  [/freezer|ice maker/i, Snowflake],
  // water & pool
  [/swimming pool/i, Waves],
  [/ocean view|sea view|beach/i, Waves],
  [/jacuzzi|hot tub|bathtub|tub\b/i, Bath],
  [/bidet|shower/i, ShowerHead],
  [/hot water/i, Droplets],
  // views & outdoors
  [/mountain view/i, Mountain],
  [/city view/i, Building2],
  [/garden|backyard/i, Flower2],
  [/balcony|veranda|terrace|patio/i, Sun],
  [/outdoor|sunlounger/i, Armchair],
  [/bbq|grill/i, Flame],
  // kitchen & dining
  [/coffee|tea maker|kettle/i, Coffee],
  [/wine/i, Wine],
  [/private chef/i, ChefHat],
  [/dining table/i, UtensilsCrossed],
  [/dish|silverware|dinnerware/i, Utensils],
  [/refrigerator|fridge/i, Refrigerator],
  [/microwave|oven|stove|toaster|blender|rice maker|bread maker|baking|cookware|cooking|kitchen/i, CookingPot],
  [/grocery/i, ShoppingBag],
  // laundry & clothing
  [/hair dryer/i, Wind],
  [/washer|washing|laundr|dryer|drying/i, WashingMachine],
  [/iron\b|hanger|clothing|wardrobe|closet/i, Shirt],
  // bedroom & bath basics
  [/linen|pillow|blanket|bed\b/i, BedDouble],
  [/shampoo|conditioner|soap|shower gel|toiletries|essentials/i, Droplets],
  [/room darkening|blackout/i, Moon],
  // family
  [/child|infant|baby|high chair|crib/i, Baby],
  // entertainment
  [/\btv\b|television/i, Tv],
  [/board game/i, Dice5],
  [/pool table|game/i, Gamepad2],
  [/gym|fitness/i, ArrowUpDown],
  // access, parking & building
  [/parking|street park/i, SquareParking],
  [/garage/i, Car],
  [/elevator|lift/i, ArrowUpDown],
  [/key card|keypad|smart lock/i, KeyRound],
  [/private entrance/i, DoorOpen],
  [/safe\b/i, Lock],
  // safety & service
  [/smoke detector|carbon monoxide/i, ShieldCheck],
  [/fire extinguisher/i, ShieldCheck],
  [/first aid/i, Cross],
  [/housekeeper|cleaning/i, Sparkles],
  [/pets? allowed|pet friendly/i, PawPrint],
  [/long term/i, CalendarDays],
  [/babysitter/i, Baby],
];

export function amenityIcon(name: string | undefined | null): LucideIcon {
  if (!name) return Check;
  for (const [re, icon] of AMENITY_ICON_RULES) {
    if (re.test(name)) return icon;
  }
  return Check;
}
