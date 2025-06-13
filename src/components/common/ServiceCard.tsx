"use client";

import { useRouter } from "next/navigation";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  features: string[];
  path: string;
  color: "red" | "green" | "blue";
  isNew?: boolean;
}

export default function ServiceCard({
  title,
  subtitle,
  features,
  path,
  color,
  isNew = false,
}: ServiceCardProps) {
  const router = useRouter();
  
  const borderColorClass = `border-${color}-200`;
  const textColorClass = `text-${color}-600`;

  return (
    <div
      className={`bg-white border ${borderColorClass} shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer relative`}
      onClick={() => router.push(path)}
    >
      {isNew && (
        <div className="absolute top-2 right-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            NEW!
          </span>
        </div>
      )}

      <h2 className={`text-2xl font-semibold ${textColorClass} mb-4 flex items-center justify-center gap-2`}>
        {title}
      </h2>

      <p className="text-gray-500 text-sm mb-3">{subtitle}</p>
      <ul className="list-inside list-none space-y-2 text-sm text-gray-700 text-left">
        {features.map((feature, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
        ))}
      </ul>
    </div>
  );
}