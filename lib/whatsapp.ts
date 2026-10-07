const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254742246706";

export function waLink(message: string) {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}