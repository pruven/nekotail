// Shared photo collection; safe to import in browser code.
export const cats = [
  { name: 'Miso', image: '/cats/miso.jpg', mood: 'Watching the world go by', color: 'Tabby' },
  { name: 'Mochi', image: '/cats/mochi.jpg', mood: 'Taking a very important nap', color: 'Ginger' },
  { name: 'Olive', image: '/cats/olive.jpg', mood: 'Quietly judging your code', color: 'Tabby' },
  { name: 'Nori', image: '/cats/nori.jpg', mood: 'Taking a well-earned catnap', color: 'Ginger' },
  { name: 'Tofu', image: '/cats/tofu.jpg', mood: 'Too cool for a health check', color: 'Fluffy' },
  { name: 'Pip', image: '/cats/pip.jpg', mood: 'Ready for a small adventure', color: 'Calico' },
  { name: "Bean", image: '/cats/bean.jpg', mood: "A serious face for a very silly day", color: "Cream" },
  { name: "Luna", image: '/cats/luna.jpg', mood: "Keeping an eye on the afternoon", color: "Tabby" },
  { name: "Sesame", image: '/cats/sesame.jpg', mood: "Surprised that you are still working", color: "White" },
  { name: "Maple", image: '/cats/maple.jpg', mood: "Accepting chin scratches", color: "Calico" },
  { name: "Pebble", image: '/cats/pebble.jpg', mood: "Very pleased to see you", color: "Tabby" },
  { name: "Biscuit", image: '/cats/biscuit.jpg', mood: "Considering the next great adventure", color: "Tabby" },
  { name: "Cleo", image: '/cats/cleo.jpg', mood: "One paw closer to the weekend", color: "Tabby" },
  { name: "Fig", image: '/cats/fig.jpg', mood: "Small cat. Very big plans.", color: "Kitten" },
  { name: "Jasper", image: '/cats/jasper.jpg', mood: "Perfecting the art of doing nothing", color: "Ginger" },
  { name: "Wren", image: '/cats/wren.jpg', mood: "Supervising from the kitchen table", color: "Bengal" },
  { name: "Coco", image: '/cats/coco.jpg', mood: "Looking majestic. As usual.", color: "Fluffy" },
  { name: "Chai", image: '/cats/chai.jpg', mood: "A little cloud with opinions", color: "Gray" },
  { name: "Mango", image: '/cats/mango.jpg', mood: "Stretching before the next nap", color: "Ginger" },
  { name: "Suki", image: '/cats/suki.jpg', mood: "The blanket has claimed another cat", color: "Tabby" },
  { name: "Muffin", image: '/cats/muffin.jpg', mood: "Five more minutes, please", color: "Tabby" },
  { name: "Juniper", image: '/cats/juniper.jpg', mood: "Two cats are better than one", color: "Kittens" },
  { name: "Poppy", image: '/cats/poppy.jpg', mood: "Politely requesting your attention", color: "White" },
  { name: "Casper", image: '/cats/casper.jpg', mood: "Taking the scenic route home", color: "Ginger" },
];

// Keep existing device assignments stable as the random photo collection grows.
export const residentCats = cats.slice(0, 6);
