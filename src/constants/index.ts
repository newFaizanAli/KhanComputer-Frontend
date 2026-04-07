export const ITEMUOM: {
  value: string;
  label: string;
}[] = [
  // 🔹 Basic Units (MOST USED)
  { value: "PCS", label: "Pieces" },
  { value: "UNIT", label: "Unit" },
  { value: "SET", label: "Set" },
  { value: "PAIR", label: "Pair" },
  { value: "NOS", label: "Number of Items" },

  // 🔹 Packaging
  { value: "BOX", label: "Box" },
  { value: "PACK", label: "Pack" },
  { value: "BUNDLE", label: "Bundle" },
  { value: "CARTON", label: "Carton" },

  // 🔹 Electronics / Hardware Specific
  { value: "MODULE", label: "Module" },
  { value: "KIT", label: "Kit" },
  { value: "BOARD", label: "Board" }, // Arduino, PCB
  { value: "CHIP", label: "Chip" },
  { value: "IC", label: "Integrated Circuit" },
  { value: "SLOT", label: "Slot" }, // RAM slots, etc.

  // 🔹 Storage Devices
  { value: "DRIVE", label: "Drive" }, // HDD, SSD
  { value: "CARD", label: "Card" }, // SD card, GPU card

  // 🔹 Length (Cables, Wires)
  { value: "METER", label: "Meter" },
  { value: "CM", label: "Centimeter" },
  { value: "MM", label: "Millimeter" },
  { value: "FEET", label: "Feet" },
  { value: "INCH", label: "Inch" },

  // 🔹 Weight (rare but useful)
  { value: "GRAM", label: "Gram" },
  { value: "KG", label: "Kilogram" },

  // 🔹 Volume (for liquids like thermal paste, cleaning fluid)
  { value: "ML", label: "Milliliter" },
  { value: "LITER", label: "Liter" },

  // 🔹 Bulk Quantities
  { value: "DOZEN", label: "Dozen" },
  { value: "HUNDRED", label: "Hundred" },

  // 🔹 Power / Energy (IoT / electrical)
  { value: "WATT", label: "Watt" },
  { value: "VOLT", label: "Volt" },
  { value: "AMPERE", label: "Ampere" },

  // 🔹 Time / Service (repairs, installations)
  { value: "HOUR", label: "Hour" },
  { value: "DAY", label: "Day" },

  // 🔹 Misc / Flexible
  { value: "ROLL", label: "Roll" }, // cable rolls
  { value: "PIECE_SET", label: "Piece Set" },
];

export const PAYMENT_METHODS: {
  value: string;
  label: string;
}[] = [
  // 🔹 Basic Units (MOST USED)
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Credit/Debit Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "ONLINE_PAYMENT", label: "Online Payment" },
  { value: "MOBILE_PAYMENT", label: "Mobile Payment" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CREDIT", label: "Credit" },
  { value: "JAZZCASH", label: "JazzCash" },
  { value: "EASYPAISA", label: "EasyPaisa" },
  { value: "OTHER", label: "Other" },
];

export const PAYMENT_STATUS: {
  value: string;
  label: string;
}[] = [
  // 🔹 Basic Units (MOST USED)
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PENDING", label: "Pending" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "PARTIAL", label: "Partial Payment" },
];

export const USER_ROLES: {
  value: string;
  label: string;
}[] = [
  // 🔹 Basic Units (MOST USED)
  { value: "admin", label: "Admin User" },
  { value: "subadmin", label: "Sub-Admin User" },
];
