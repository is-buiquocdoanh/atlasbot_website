import { getTranslations } from "next-intl/server";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProjectBySlug } from "@/lib/cms";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, project] = await Promise.all([
    getTranslations("Projects"),
    getProjectBySlug(slug),
  ]);
  if (!project) return notFound();

  const [coverImage, ...galleryImages] = project.images;

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>

      {coverImage && (
        <div className="relative aspect-video bg-surface rounded-lg overflow-hidden mb-6">
          <Image
            src={coverImage}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <p className="text-muted mb-8">{project.description}</p>

      {galleryImages.length > 0 && (
        <section className="mb-10">
          <h2 className="font-semibold mb-3">{t("galleryTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {galleryImages.map((src) => (
              <div
                key={src}
                className="relative aspect-video bg-surface rounded-lg overflow-hidden"
              >
                <Image
                  src={src}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {project.videos && project.videos.length > 0 && (
        <section className="mb-10">
          <h2 className="font-semibold mb-3">{t("videosTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {project.videos.map((video) => {
              const embedUrl = getYouTubeEmbedUrl(video.url);
              if (!embedUrl) return null;
              return (
                <div key={video.url}>
                  <div className="relative aspect-video bg-surface rounded-lg overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-muted mt-2">{video.title}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {project.content && (
        <div className="prose prose-sm sm:prose-base mb-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
        </div>
      )}

      <h2 className="font-semibold mb-2">{t("specsTitle")}</h2>
      <ul className="space-y-1 mb-6">
        {project.specs.map((spec) => (
          <li key={spec.label} className="text-sm">
            <span className="text-muted">{spec.label}:</span> {spec.value}
          </li>
        ))}
      </ul>

      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {t("githubLink")}
        </a>
      )}
    </article>
  );
}
