import categoryFood from "../../assets/images/category-food.png";
import categoryDrinks from "../../assets/images/category-drinks.png";
import categoryPackaging from "../../assets/images/category-packaging.png";
import categoryCleaning from "../../assets/images/category-cleaning.png";
import categoryProduce from "../../assets/images/category-produce.png";
import productOil from "../../assets/images/product-oil.png";
import productRice from "../../assets/images/product-rice.png";
import productWater from "../../assets/images/product-water.png";
import productTissues from "../../assets/images/product-tissues.png";

export const storeCategories = [
  {
    id: 1,
    name: "خضار وفواكه",
    suppliersCount: 128,
    image: categoryProduce,
  },
  {
    id: 2,
    name: "منظفات",
    suppliersCount: 96,
    image: categoryCleaning,
  },
  {
    id: 3,
    name: "تغليف",
    suppliersCount: 72,
    image: categoryPackaging,
  },
  {
    id: 4,
    name: "مشروبات",
    suppliersCount: 110,
    image: categoryDrinks,
  },
  {
    id: 5,
    name: "مواد غذائية",
    suppliersCount: 256,
    image: categoryFood,
  },
];

export const suggestedSuppliers = [
  {
    id: 1,
    name: "شركة موسى حميد",
    shortName: "م",
    description: "مورد مواد غذائية",
    location: "غزة",
    avatarClass: "bg-[#5B69C5]",
  },
  {
    id: 2,
    name: "شركة الصافي",
    shortName: "ص",
    description: "مورد منظفات وتغليف",
    location: "خانيونس",
    avatarClass: "bg-[#36965D]",
  },
  {
    id: 3,
    name: "شركة خيار الشنطي",
    shortName: "ن",
    description: "لتجارة الخضار والفواكه",
    location: "دير البلح",
    avatarClass: "bg-[#2569B9]",
  },
  {
    id: 4,
    name: "شركة المدينة",
    shortName: "م",
    description: "للمشروبات والعصائر",
    location: "رفح",
    avatarClass: "bg-[#FF8736]",
  },
];

export const suggestedProducts = [
  {
    id: 1,
    name: "زيت دوار الشمس 1.8 لتر",
    price: 10.25,
    supplier: "مؤسسة النور للتجارة",
    stockStatus: "متوفر",
    image: productOil,
  },
  {
    id: 2,
    name: "أرز بسمتي 5 كيلو",
    price: 32,
    supplier: "شركة عهد العالمية",
    stockStatus: "متوفر",
    image: productRice,
  },
  {
    id: 3,
    name: "مياه معدنية 330 مل (24 عبوة)",
    price: 14.5,
    supplier: "الخليج للتجارة",
    stockStatus: "متوفر",
    image: productWater,
  },
  {
    id: 4,
    name: "مناديل ناعمة 200 منديل",
    price: 10.25,
    supplier: "مؤسسة التموين",
    stockStatus: "متوفر",
    image: productTissues,
  },
];

export const latestStoreOrders = [
  {
    id: 1,
    orderNumber: "#ORD-10245",
    supplier: "مؤسسة النور للتجارة",
    supplierInitial: "م",
    supplierClass: "bg-[#5B69C5]",
    status: "تم التوصيل",
    statusClass: "bg-[#DDF8E8] text-[#15803D]",
    total: 287.5,
  },
  {
    id: 2,
    orderNumber: "#ORD-10244",
    supplier: "شركة عهد العالمية",
    supplierInitial: "ع",
    supplierClass: "bg-[#36965D]",
    status: "قيد الشحن",
    statusClass: "bg-[#FFF6C9] text-[#9A6C00]",
    total: 156.75,
  },
  {
    id: 3,
    orderNumber: "#ORD-10243",
    supplier: "سماء الخليج للتجارة",
    supplierInitial: "س",
    supplierClass: "bg-[#2569B9]",
    status: "مكتمل",
    statusClass: "bg-[#DDF8E8] text-[#15803D]",
    total: 98.25,
  },
];

export const aiSuggestion = {
  title: "زيادة الطلب المتوقع",
  message: "يتوقع النظام زيادة بنسبة 25% على أرز بسمتي في الأسبوع القادم",
  actionLabel: "تحضير طلبية إضافية",
};

export const restockAlert = {
  title: "تنبيه إعادة تموين",
  message:
    "صنف زيت دوار الشمس متبقي منه 35 وحدة فقط، يفضل إعادة الطلب اليوم لتجنب النقص.",
  actionLabel: "طلب الآن",
};

export const bestOffers = [
  {
    id: 1,
    supplier: "شركة النور لتوزيع الدواجن",
    delivery: "توصيل خلال 24 ساعة",
    price: 15.5,
  },
  {
    id: 2,
    supplier: "مجموعة الإمام",
    delivery: "توصيل خلال 48 ساعة",
    price: 16.2,
  },
];

export const recentPurchases = [
  {
    id: 1,
    text: "تم بيع 5 وحدات من أرز بسمتي",
    time: "منذ 3 دقائق",
  },
  {
    id: 2,
    text: "تم بيع 2 وحدة من زيت دوار الشمس",
    time: "منذ 12 دقيقة",
  },
];

export const supplierPromo = {
  title: "نصيحة الموردين",
  message: "احصل على خصم 10% عند الشراء من موردين في نفس منطقتك!",
  linkLabel: "استعراض الموردين المحليين",
};