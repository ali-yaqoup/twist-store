const stroke = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconDashboard(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function IconOrders(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.3 7 12 12l8.7-5M12 22V12" />
    </svg>
  );
}

export function IconMessages(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconProducts(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function IconCategories(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconGallery(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

export function IconHome(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function IconAbout(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

export function IconStar(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="m12 3 2.6 6.3L21 10l-4.8 4.4L17.5 21 12 17.8 6.5 21l1.3-6.6L3 10l6.4-.7Z" />
    </svg>
  );
}

export function IconSettings(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

export function IconMenu(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconClose(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconStore(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <path d="M3 9 5 3h14l2 6" />
      <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

export function IconSearch(props: { className?: string }) {
  return (
    <svg {...stroke} className={props.className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

export function AdminNavIcon({ href, className }: { href: string; className?: string }) {
  switch (href) {
    case "/admin/orders":
      return <IconOrders className={className} />;
    case "/admin/messages":
      return <IconMessages className={className} />;
    case "/admin/products":
      return <IconProducts className={className} />;
    case "/admin/categories":
      return <IconCategories className={className} />;
    case "/admin/gallery":
      return <IconGallery className={className} />;
    case "/admin/homepage":
      return <IconHome className={className} />;
    case "/admin/about":
      return <IconAbout className={className} />;
    case "/admin/testimonials":
      return <IconStar className={className} />;
    case "/admin/settings":
      return <IconSettings className={className} />;
    default:
      return <IconDashboard className={className} />;
  }
}
