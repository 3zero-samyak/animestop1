export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    heading: "EXPLORE",
    links: [
      { label: "Stories", href: "/stories" },
      { label: "Essentials", href: "/essentials" },
      { label: "Possibilities", href: "/possibilities" },
      { label: "Vault", href: "/vault" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/mission" },
      { label: "The Studio", href: "/studio" },
    ],
  },
  {
    heading: "SUPPORT",
    links: [
      {
        label: "Before You Begin",
        href: "/before-you-begin",
      },
      {
        label: "How It Works",
        href: "/how-it-works",
      },
      {
        label: "Shipping & Delivery",
        href: "/shipping",
      },
      {
        label: "Returns & Exchanges",
        href: "/returns",
      },
    ],
  },
  {
    heading: "CONNECT",
    links: [
      { label: "DM Us", href: "/contact" },
      { label: "Join The Circle", href: "/circle" },
      {
        label: "Share Your Story",
        href: "/share-story",
      },
    ],
  },
];
