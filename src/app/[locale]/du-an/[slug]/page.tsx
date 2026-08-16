import { getTranslations } from "next-intl/server";
import { getProjectBySlug } from "@/lib/cms";
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

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
      <div className="aspect-video bg-surface rounded-lg mb-6" />
      <p className="text-muted mb-6">{project.description}</p>

      <h2 className="font-semibold mb-2">{t("specsTitle")}</h2>
      <ul className="space-y-1 mb-6">
        {project.specs.map((spec) => (
          <li key={spec.label} className="text-sm">
            <span className="text-muted">{spec.label}:</span> {spec.value}
          </li>
        ))}
      </ul>

      {project.githubUrl && (
        <a href={project.githubUrl} className="text-primary underline">
          {t("githubLink")}
        </a>
      )}
    </article>
  );
}
