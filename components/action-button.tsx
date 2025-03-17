"use client";

import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
    image: string | null;
    prompt: string;
}

export function ShareButton({ image, prompt }: ActionButtonsProps) {
    const { toast } = useToast();

    const handleShare = async () => {
        if (!image) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'AI Generated Image',
                    text: prompt,
                    url: image,
                });
                toast({
                    title: "Success",
                    description: "Image shared successfully",
                });
            } else {
                await navigator.clipboard.writeText(image);
                toast({
                    title: "Success",
                    description: "Image URL copied to clipboard",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to share image",
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            onClick={handleShare}
            variant="secondary"
           className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!image}
        >
            <Share2 className="mr-2 h-4 w-4" />
            Share
        </Button>
    );
}

export function DownloadButton({ image, prompt }: ActionButtonsProps) {
    const { toast } = useToast();

    const handleDownload = async () => {
        if (!image || !image.startsWith('http')) {
            toast({
                title: "Error",
                description: "Invalid or missing image URL.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch(image, { mode: "no-cors" });
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `ai-image-${Date.now()}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            toast({
                title: "Success",
                description: "Image downloaded successfully",
            });
        } catch (error) {
            console.error("Download error:", error);
            toast({
                title: "Error",
                description: "Failed to download image. Try opening in a new tab.",
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            onClick={handleDownload}
            variant="secondary"
           className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!image}
        >
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
    );
}