import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { temples } from "@/lib/temple-data";
import { Map, Camera } from "lucide-react";

export default function MapsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          Interactive Temple Maps
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Navigate the sacred grounds with our detailed maps and upcoming AR features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {temples.map((temple) => (
          <Card key={temple.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{temple.name}</CardTitle>
              <CardDescription>{temple.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image
                  src={temple.mapImage.imageUrl}
                  alt={temple.mapImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={temple.mapImage.imageHint}
                />
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                    <Map className="mr-2 h-4 w-4" />
                    View Map
                </Button>
                 <Button disabled>
                    <Camera className="mr-2 h-4 w-4" />
                    AR View (Coming Soon)
                  </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground mt-12">
          Our future AR navigation will guide you through the temple complex right from your phone.
        </p>
    </div>
  );
}
