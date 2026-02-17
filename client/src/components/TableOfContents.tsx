import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

/**
 * Componente de índice de contenidos navegable
 * Permite saltar entre secciones y resalta la sección activa según scroll
 */
export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Altura del header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-20 hidden lg:block">
      <div className="border-l-2 border-border pl-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Índice de Contenidos
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "text-sm text-left w-full transition-colors hover:text-foreground",
                  activeSection === section.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
