import { Product } from '../types';

export const MASTER_CATALOG: Omit<Product, 'id' | 'sellerId' | 'createdAt'>[] = [
  // ELECTRONICS
  {
    name: "Apple iPhone 15 Pro",
    description: "Titanium design with A17 Pro chip, customizable Action button, and a more versatile Pro camera system. The ultimate mobile experience for performance and style.",
    price: 134900,
    stock: 12,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    specifications: ["A17 Pro Chip", "48MP Camera", "USB-C", "Titanium Frame"]
  },
  {
    name: "Sony WH-1000XM5",
    description: "Best-in-class noise cancellation headphones with 30-hour battery life. Crystal-clear hands-free calling and multipoint connection for seamless switching between devices.",
    price: 29990,
    stock: 25,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1618366712214-8c075189d0ad?auto=format&fit=crop&q=80&w=800",
    specifications: ["30-hour Battery", "Auto NC Optimizer", "Speak-to-Chat"]
  },
  {
    name: "MacBook Pro 14 (M3 Pro)",
    description: "Unrivaled performance for creative pros. The Liquid Retina XDR display is the best ever in a laptop, and the M3 Pro chip handles intense workflows with ease.",
    price: 199900,
    stock: 8,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1517336714460-4c742a1d3f52?auto=format&fit=crop&q=80&w=800",
    specifications: ["M3 Pro Chip", "14.2-inch XDR Display", "Up to 18 Hours Battery"]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "The peak of Android innovation. With Galaxy AI, a 200MP camera, and a titanium frame. Includes the S Pen for productivity and creativity on the go.",
    price: 129999,
    stock: 15,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
    specifications: ["Snapdragon 8 Gen 3", "Galaxy AI", "Built-in S Pen"]
  },
  {
    name: "Nintendo Switch OLED",
    description: "Features a vibrant 7-inch OLED screen, a wide adjustable stand, a wired LAN port, and upgraded audio for the ultimate hand-held gaming experience.",
    price: 32900,
    stock: 10,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=800",
    specifications: ["7-inch OLED Screen", "64GB Storage", "Enhanced Audio"]
  },
  {
    name: "Kindle Paperwhite (16GB)",
    description: "The best e-reader just got better. Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    price: 14999,
    stock: 45,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    specifications: ["300 ppi Display", "Waterproof (IPX8)", "USB-C Charging"]
  },
  // FASHION
  {
    name: "Nike Air Jordan 1 Retro",
    description: "The legend that started it all. Premium leather, the iconic 'Wings' logo, and Air-Sole cushioning for comfort and style that never fades.",
    price: 15995,
    stock: 12,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800",
    specifications: ["Genuine Leather", "Encapsulated Air Unit", "Iconic Wings Logo"]
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "The original straight-leg jean since 1873. A cultural icon, worn by generations, defining style for decades. Durable and timeless.",
    price: 4999,
    stock: 40,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
    specifications: ["100% Cotton", "Button Fly", "Classic 5-pocket Styling"]
  },
  {
    name: "Ray-Ban Classic Aviator",
    description: "Originally designed for U.S. aviators in 1937, provide exceptional quality, performance, and comfort. The standard of classic cool.",
    price: 10890,
    stock: 20,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1511499767390-90342f5b89a8?auto=format&fit=crop&q=80&w=800",
    specifications: ["G-15 Polarized Lenses", "Metal Frame", "UV Protection"]
  },
  {
    name: "Casio G-Shock GA-2100",
    description: "Inspired by the original DW-5000C, this slim, digital-analog hybrid watch features a carbon core guard structure and a double LED light.",
    price: 9495,
    stock: 30,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
    specifications: ["Shock Resistant", "200m Water Resistant", "World Time"]
  },
  // HOME & LIVING
  {
    name: "Herman Miller Aeron Chair",
    description: "The icon of ergonomic design. Breathable Pellicle suspension and adjustable PostureFit SL back support for peak performance and health.",
    price: 145000,
    stock: 5,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
    specifications: ["PostureFit SL Support", "Breathable Pellicle", "Harmonic Tilt"]
  },
  {
    name: "Dyson V15 Detect Vacuum",
    description: "The most powerful, intelligent cordless vacuum. Reveals invisible dust with a precisely-angled laser. Automatically adjusts suction power based on dust levels.",
    price: 58900,
    stock: 12,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1558317374-067df5f3a831?auto=format&fit=crop&q=80&w=800",
    specifications: ["Laser Dust Detection", "HEPA Filtration", "Piezo Sensor"]
  },
  {
    name: "Phillips Air Fryer XXL",
    description: "Healthy frying with the #1 Airfryer. Use up to 90% less fat. Large capacity for the whole family. Includes diverse cooking presets.",
    price: 21990,
    stock: 20,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
    specifications: ["Fat Removal Technology", "XXL Family Size", "Rapid Air Technology"]
  },
  {
    name: "Nestle Nespresso Vertuo",
    description: "Brew a range of coffee styles from espresso to 14oz large coffee. Features Centrifusion technology for a high-quality crema every time.",
    price: 18500,
    stock: 15,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    specifications: ["One-touch Brewing", "Recyclable Capsules", "Smart Connectivity"]
  },
  // SPORTS & OUTDOOR
  {
    name: "Babolat Pure Aero 2023",
    description: "The weapon of choice for spin and power. Redesigned for more feel and control while maintaining the legendary spin that Nadal made famous.",
    price: 24900,
    stock: 15,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1617083275226-622016ca58f1?auto=format&fit=crop&q=80&w=800",
    specifications: ["NF2 Tech", "Aeromodular 3", "FSI Spin"]
  },
  {
    name: "YETI Tundra 45 Cooler",
    description: "Legendary cold-holding power. Indestructible rotomolded construction and PermaFrost insulation for outdoor adventures that never end.",
    price: 32500,
    stock: 10,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=800",
    specifications: ["PermaFrost Insulation", "T-Rex Lid Latches", "NeverFail Hinge System"]
  },
  {
    name: "Hydro Flask 40oz Wide Mouth",
    description: "TempShield insulation keeps beverages cold for 24 hours or hot for 12. Durable professional-grade stainless steel construction.",
    price: 4999,
    stock: 100,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1602143399032-de0960572e0a?auto=format&fit=crop&q=80&w=800",
    specifications: ["TempShield Insulation", "BPA-Free", "Lifetime Warranty"]
  },
  // WELLNESS
  {
    name: "Theragun Pro Gen 5",
    description: "The world's most powerful percussion massage device. Scientifically proven to treat deep into the muscle to reduce soreness and improve recovery.",
    price: 49900,
    stock: 8,
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1610484826917-0f101a7bf7f4?auto=format&fit=crop&q=80&w=800",
    specifications: ["16mm Amplitude", "Smart Connectivity", "QuietForce Technology"]
  },
  {
    name: "Lululemon Align Yoga Mat",
    description: "The ultimate mat for your practice. Grippy and cushioned, providing stability for even your sweatiest sessions. Natural rubber base.",
    price: 8800,
    stock: 30,
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=800",
    specifications: ["Natural Rubber", "Cushioned Grip", "Polyurethane Top Layer"]
  },
  {
    name: "Laneige Lip Mask",
    description: "Intense moisture and antioxidants while you sleep. Formulated with Berry Mix Complex and Vitamin C for smooth, supple lips by morning.",
    price: 1850,
    stock: 60,
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800",
    specifications: ["Berry Mix Complex", "Moisture Wrap Tech", "Vitamin C Infused"]
  },
  // ART & CREATIVITY
  {
    name: "Fujifilm X100VI",
    description: "The viral sensation. 40.2MP X-Trans CMOS 5 HR sensor in a compact body. Features professional-grade film simulation modes and internal stabilization.",
    price: 149999,
    stock: 2,
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    specifications: ["40.2MP Sensor", "IBIS up to 6 stops", "20 Film Simulations"]
  },
  {
    name: "Wacom Intuos Pro (Large)",
    description: "The professional standard in creative pen tablets. Features world-class pen performance and multi-touch gestures for smooth control.",
    price: 41995,
    stock: 12,
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1542744095-2ad4870f62dd?auto=format&fit=crop&q=80&w=800",
    specifications: ["Pro Pen 2", "Multi-touch", "Bluetooth Connectivity"]
  },
  {
    name: "Winsor & Newton Professional Watercolors",
    description: "Made from the finest pigments for color brilliance and permanence. A set of 24 whole pans in a beautiful metal case for artists.",
    price: 12500,
    stock: 10,
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    specifications: ["24 Professional Colors", "Metal Case", "Finest Pigments"]
  },
  // TOYS & GAMES
  {
    name: "LEGO Star Wars Millennium Falcon",
    description: "Build the most iconic starship in the galaxy. Over 7,500 pieces for an incredibly detailed model including hidden compartments and minifigures.",
    price: 79999,
    stock: 5,
    category: "Toys",
    imageUrl: "https://images.unsplash.com/photo-1585366119957-e556f4bbecf0?auto=format&fit=crop&q=80&w=800",
    specifications: ["7,541 Pieces", "7 Minifigures", "Interior Details"]
  },
  {
    name: "Catan Board Game",
    description: "The award-winning strategy game. Build, trade, and settle to lead your explorers to victory. The perfect modern classic for game night.",
    price: 3999,
    stock: 40,
    category: "Toys",
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800",
    specifications: ["3-4 Players", "60 min Playtime", "Infinite Replayability"]
  },
  // BOOKS
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness. Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
    price: 450,
    stock: 100,
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    specifications: ["Hardcover", "Best Seller", "Personal Finance"]
  },
  {
    name: "Atomic Habits",
    description: "An easy and proven way to build good habits and break bad ones. James Clear shares practical strategies that will teach you how to form good habits.",
    price: 599,
    stock: 150,
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    specifications: ["James Clear", "Habit Formation", "Self-Help"]
  },
  // AUTOMOTIVE
  {
    name: "GoPro HERO12 Black",
    description: "The ultimate action camera. Incredible image quality, even better HyperSmooth video stabilization and a huge boost in battery life.",
    price: 45000,
    stock: 20,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1524143878510-e3b8d6312402?auto=format&fit=crop&q=80&w=800",
    specifications: ["5.3K Video", "HDR Video + Photo", "HyperSmooth 6.0"]
  }
];
