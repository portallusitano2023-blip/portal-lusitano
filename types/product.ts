/** Imagem de produto Shopify */
export interface ProductImage {
  url: string;
  altText?: string;
}

/** Variante de produto Shopify */
export interface ProductVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode?: string };
  availableForSale: boolean;
  image?: ProductImage;
}

/** Produto Shopify (detalhe completo) */
export interface Product {
  id: string;
  title: string;
  description?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

/** Produto Shopify (listagem) */
export interface ProductListing {
  id: string;
  handle: string;
  title: string;
  description?: string;
  images: { url: string }[];
  priceRange: { minVariantPrice: { amount: string } };
  variants?: { id: string; title: string; price: { amount: string } }[];
}
