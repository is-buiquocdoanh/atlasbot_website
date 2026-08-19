// Bộ icon SVG inline dùng chung cho trang chi tiết sản phẩm — không phụ
// thuộc thư viện icon ngoài. `Icon` nhận field `icon` (string) tự do từ CMS
// (docs/product-detail-page-spec.md mục 5) và map sang icon phù hợp nhất;
// key lạ/không khớp sẽ rơi về icon chấm tròn mặc định, không vỡ layout.

type IconProps = { className?: string };

const paths: Record<string, string> = {
  voltage: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
  speed: "M12 3a9 9 0 1 0 9 9M12 3v3m9 6h-3M12 12l4-4",
  encoder: "M12 12V4m0 16a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-8 3 2",
  torque: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.6-.6-.6-2.6 2.1-2.1Z",
  range: "M3 12h4m10 0h4M12 3v4m0 10v4M7 7l2.5 2.5M17 7l-2.5 2.5M7 17l2.5-2.5M17 17l-2.5-2.5",
  "scan-rate": "M4 12a8 8 0 0 1 14.5-4.5M20 12a8 8 0 0 1-14.5 4.5M14 3l4.5 4.5M10 21l-4.5-4.5",
  resolution: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  connector: "M9 3v4M15 3v4M6 7h12v3a6 6 0 0 1-12 0V7ZM9 20v-3M15 20v-3",
  cpu: "M8 3v3M16 3v3M8 18v3M16 18v3M3 8h3M3 16h3M18 8h3M18 16h3M7 7h10v10H7z",
  gpu: "M3 7h18v10H3zM7 10v4M11 10v4M15 10v4",
  ram: "M4 8h16v8H4zM7 8V5M11 8V5M15 8V5M17 8V5M7 16v3M11 16v3M15 16v3M17 16v3",
  material: "M12 2 3 7l9 5 9-5-9-5ZM3 7v10l9 5V12M21 7v10l-9 5",
  size: "M4 20 20 4M4 4h6M4 4v6M20 20h-6M20 20v-6",
  layers: "M12 2 2 8l10 6 10-6-10-6ZM2 14l10 6 10-6M2 11l10 6 10-6",
  load: "M4 20h16M8 20V9a4 4 0 0 1 8 0v11M6 9h12",
  wheel: "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 3v3M12 18v3M3 12h3M18 12h3",
  roller: "M12 12m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0M12 4v16M8 6l8 12M16 6 8 18",
  shaft: "M4 12h11M15 8v8M17 8v8M19 8v8",
  capacity: "M7 7h8v14H7zM11 3h4l1 4h-6l1-4zM9 11h4M9 15h4",
  current: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
  protection: "M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3ZM9 12l2 2 4-4",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.6-2.5c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  warranty: "M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3ZM9 12l2 2 4-4",
  shipping: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  support: "M4 13a8 8 0 0 1 16 0M4 13v3a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1ZM20 13v3a2 2 0 0 1-2 2h-1v-6h1a1 1 0 0 1 2 1ZM9 20h4",
  gpio: "M4 4h16v4H4zM6.5 8v12M9.5 8v12M12.5 8v12M15.5 8v12M18.5 8v12",
};

const defaultPath = "M12 8v4M12 16h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z";

export function Icon({ name, className = "w-5 h-5" }: { name: string } & IconProps) {
  const d = paths[name] ?? defaultPath;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

// Icon lớn dùng cho fallback khi sản phẩm chưa có ảnh — hình khối linh kiện
// đơn giản trên nền lưới nhạt (docs/product-detail-page-spec.md mục 3.2).
export function ProductPlaceholderIcon({ className = "w-16 h-16" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2 3 7l9 5 9-5-9-5ZM3 7v10l9 5 9-5V7M12 12v10" />
    </svg>
  );
}
