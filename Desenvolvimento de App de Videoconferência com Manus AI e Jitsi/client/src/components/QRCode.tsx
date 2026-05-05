import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { QrCode, Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QRCodeComponentProps {
  roomCode: string;
  roomName: string;
}

export default function QRCodeComponent({ roomCode, roomName }: QRCodeComponentProps) {
  const [open, setOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${window.location.origin}/rooms/join?code=${roomCode}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg") as SVGSVGElement;
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `cinesync-${roomCode}.png`;
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="w-8 h-8 text-muted-foreground hover:text-gold hover:bg-white/10"
        title="QR Code da sala"
      >
        <QrCode className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-panel border-border/40 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              QR Code — {roomName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {/* QR Code */}
            <div
              ref={qrRef}
              className="p-4 bg-white rounded-lg"
            >
              <QRCodeSVG
                value={shareUrl}
                size={256}
                level="H"
                includeMargin={true}
                fgColor="#0a0a12"
                bgColor="#ffffff"
              />
            </div>

            {/* URL */}
            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-2">URL da sala:</p>
              <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/40 break-all text-xs text-foreground/70">
                {shareUrl}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gold text-primary-foreground hover:bg-gold/90 text-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Baixar
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-border/60 text-sm"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Fechar
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 text-center">
              Compartilhe este QR Code com seus amigos para que entrem na sala instantaneamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
