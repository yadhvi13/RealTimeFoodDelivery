export const generateMenuData = () => {
  const baseItems = [
    { name: "Spicy Inferno Pizza", cat: "Pizza", price: 14.99, discount: 0, rating: 4.8, time: "30-40 min", type: "non-veg", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop", pop: true },
    { name: "Truffle Mushroom Burger", cat: "Burgers", price: 12.50, discount: 2.00, rating: 4.9, time: "25-30 min", type: "veg", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop", pop: true },
    { name: "Dragon Roll Sushi", cat: "Sushi", price: 18.00, discount: 0, rating: 4.7, time: "40-50 min", type: "non-veg", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Vegan Buddha Bowl", cat: "Healthy", price: 11.00, discount: 1.50, rating: 4.6, time: "20-30 min", type: "veg", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Double Choc Brownie", cat: "Desserts", price: 6.50, discount: 0, rating: 4.9, time: "15-20 min", type: "veg", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format&fit=crop", pop: true },
    { name: "Mango Tango Smoothie", cat: "Drinks", price: 8.00, discount: 0, rating: 4.5, time: "10-15 min", type: "veg", img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Butter Chicken Masala", cat: "Indian", price: 16.50, discount: 3.50, rating: 4.8, time: "35-45 min", type: "non-veg", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500&auto=format&fit=crop", pop: true },
    { name: "Crispy Szechuan Noodles", cat: "Chinese", price: 13.00, discount: 0, rating: 4.4, time: "30-40 min", type: "non-veg", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Paneer Tikka Wrap", cat: "Indian", price: 10.00, discount: 1.00, rating: 4.3, time: "20-30 min", type: "veg", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop", pop: false }, // reusing some high quality urls
    { name: "Classic Margherita", cat: "Pizza", price: 12.00, discount: 0, rating: 4.2, time: "25-35 min", type: "veg", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Ultimate BBQ Bacon", cat: "Burgers", price: 15.50, discount: 2.00, rating: 4.9, time: "25-35 min", type: "non-veg", img: "https://images.unsplash.com/photo-1594212691516-436fba2b4699?q=80&w=500&auto=format&fit=crop", pop: true },
    { name: "Dim Sum Platter", cat: "Chinese", price: 19.99, discount: 4.00, rating: 4.7, time: "40-50 min", type: "non-veg", img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Strawberry Cheesecake", cat: "Desserts", price: 7.50, discount: 0, rating: 4.8, time: "15-20 min", type: "veg", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500&auto=format&fit=crop", pop: true },
    { name: "Iced Caramel Macchiato", cat: "Drinks", price: 5.50, discount: 0, rating: 4.6, time: "10-15 min", type: "veg", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Spicy Tuna Roll", cat: "Sushi", price: 16.00, discount: 2.00, rating: 4.5, time: "30-40 min", type: "non-veg", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=500&auto=format&fit=crop", pop: false },
    { name: "Quinoa Salad Bowl", cat: "Healthy", price: 10.50, discount: 0, rating: 4.1, time: "20-30 min", type: "veg", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop", pop: false }
  ];

  let fullMenu = [];
  // Multiply this to get over 100 items for infinite scroll testing
  for (let i = 0; i < 7; i++) {
    const batch = baseItems.map(item => ({
      ...item,
      id: `${i}-${item.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random()*1000)}`,
      name: i === 0 ? item.name : `${item.name} (Variations ${i})`,
      rating: Math.max(3.0, (item.rating - (Math.random() * 0.8)).toFixed(1)),
      price: parseFloat((item.price + (Math.random() * 5)).toFixed(2)),
      discount: Math.random() > 0.5 ? parseFloat((Math.random() * 3).toFixed(2)) : 0,
      pop: Math.random() > 0.8
    }));
    fullMenu = [...fullMenu, ...batch];
  }
  
  // Shuffle randomly
  return fullMenu.sort(() => Math.random() - 0.5);
};
