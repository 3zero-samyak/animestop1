export type SocialLink = {
  id: "instagram" | "discord" | "youtube" | "x";
  label: string;
  href: string;
  external?: boolean;
};

export const socialLinks: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "/connect/instagram",
  },
  {
    id: "discord",
    label: "Discord",
    href: "/connect/discord",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "/connect/youtube",
  },
  {
    id: "x",
    label: "X",
    href: "/connect/x",
  },
];
