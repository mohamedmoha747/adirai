export const DELIVERY_FEE = 25;
export const PACKING_FEE = 15;
export const FREE_DELIVERY_MIN = 299;

export function calcFees(subtotal) {
  const deliveryFee = subtotal >= FREE_DELIVERY_MIN || subtotal === 0 ? 0 : DELIVERY_FEE;
  const packingFee = subtotal === 0 ? 0 : PACKING_FEE;
  return {
    subtotal,
    deliveryFee,
    packingFee,
    total: subtotal + deliveryFee + packingFee,
  };
}

export function getProductById(products, id) {
  return products.find((p) => p.id === id);
}
