/**
 * Shared product/story detail data model.
 * 
 * All future product/category cards must use ProductCard and ProductDetailModal
 * with this shared ProductDetail data model.
 */
export type ProductDetail = {
  id: string;
  category: string;
  title: string;
  cardTitle?: string;
  shortDescription: string;
  fullDescription: string;
  inspiration?: string;
  image: string;
  imageAlt: string;
  size?: string;
  materials?: string;
  finish?: string;
  tags?: string[];
  disclaimer?: string;
  requestHref?: string;
  requestLabel?: string;
  accent?: string;
};
