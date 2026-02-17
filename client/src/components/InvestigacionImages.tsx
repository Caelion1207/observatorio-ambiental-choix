import { Card } from "@/components/ui/card";

interface InvestigacionImagesProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

/**
 * Componente de galería de imágenes para investigaciones
 * Muestra imágenes relevantes con captions descriptivos
 */
export default function InvestigacionImages({ images }: InvestigacionImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-64 object-cover"
          />
          {image.caption && (
            <div className="p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">{image.caption}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
