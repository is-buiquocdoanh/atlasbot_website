import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getAllProjects } from "@/lib/cms";

export default async function ProjectListPage() {
  const t = await getTranslations("Projects");
  const projects = await getAllProjects();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/du-an/${project.slug}`}
            className="block bg-surface rounded-lg overflow-hidden hover:opacity-90"
          >
            <div className="relative aspect-video bg-border">
              {project.images[0] && (
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold">{project.title}</h2>
              <p className="text-sm text-muted mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
