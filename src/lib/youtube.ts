// Chuyển các dạng URL YouTube phổ biến (youtu.be/ID, watch?v=ID, /embed/ID)
// thành URL nhúng chuẩn để dùng trong <iframe>. Trả về null nếu không nhận diện được.
export function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null;
}
