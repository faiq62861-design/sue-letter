import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Edit3, X } from "lucide-react";
import { useEffect, useState } from "react";
import { recordDownloadLocally } from "../hooks/use-backend";
import type { LetterFormData } from "../types";
import { printLetter } from "../utils/pdfGenerator";

interface EditBeforeDownloadModalProps {
  open: boolean;
  onClose: () => void;
  letterContent: string;
  formData: LetterFormData;
  watermark?: boolean;
  /** Optional letterId — when present, download is recorded in activity log */
  letterId?: string | null;
  /** Called after a download is recorded so the dashboard can refresh */
  onDownloadRecorded?: () => void;
}

export function EditBeforeDownloadModal({
  open,
  onClose,
  letterContent,
  formData,
  watermark = true,
  letterId,
  onDownloadRecorded,
}: EditBeforeDownloadModalProps) {
  const [editedContent, setEditedContent] = useState(letterContent);

  // Sync content when modal opens with latest letter
  useEffect(() => {
    if (open) {
      setEditedContent(letterContent);
    }
  }, [open, letterContent]);

  const handleDownload = () => {
    printLetter({ formData, letterContent: editedContent, watermark });
    // Record download activity locally so dashboard shows updated count
    if (letterId) {
      recordDownloadLocally(letterId);
      onDownloadRecorded?.();
    }
    onClose();
  };

  const charCount = editedContent.length;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0 gap-0"
        data-ocid="edit_before_download.dialog"
        aria-label="Review and edit before downloading"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-0 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Edit3 className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Review &amp; Edit Before Download
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Make any final changes — then download your PDF.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Editable letter body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="relative">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={18}
              className="w-full resize-y rounded-lg border border-border bg-card text-sm text-foreground font-mono leading-relaxed p-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors placeholder:text-muted-foreground"
              placeholder="Your letter content will appear here for editing…"
              spellCheck
              data-ocid="edit_before_download.editor"
              aria-label="Editable letter content"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground pointer-events-none tabular-nums">
              {charCount.toLocaleString()} chars
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            <strong className="text-foreground">Tip:</strong> Edits only affect
            this download — they are not saved to your letter history.
          </p>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-5 pt-3 border-t border-border bg-muted/20 flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="gap-1.5"
            data-ocid="edit_before_download.cancel_button"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!editedContent.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-semibold"
            data-ocid="edit_before_download.download_button"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
