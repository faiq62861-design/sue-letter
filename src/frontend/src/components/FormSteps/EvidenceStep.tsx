import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { EVIDENCE_ITEMS } from "../../types";
import type { LetterFormData } from "../../types";

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface UploadedImage {
  id: string;
  url: string; // data URI
  filename: string;
  sizeKb: number;
  progress: number; // 0–100
}

interface EvidenceStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function EvidenceStep({ data, onChange }: EvidenceStepProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleItem = (id: string) => {
    const current = data.evidenceItems;
    const updated = current.includes(id)
      ? current.filter((e) => e !== id)
      : [...current, id];
    onChange({ evidenceItems: updated });
  };

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(files);

      const currentCount = uploadedImages.length;
      const remaining = MAX_FILES - currentCount;
      if (remaining <= 0) {
        setUploadError(`Maximum ${MAX_FILES} images allowed.`);
        return;
      }

      const toProcess = fileArray.slice(0, remaining);

      for (const file of toProcess) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setUploadError("Only JPG, PNG, GIF, and WebP images are accepted.");
          continue;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setUploadError(
            `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`,
          );
          continue;
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const sizeKb = Math.round(file.size / 1024);

        // Add with 0% progress immediately
        setUploadedImages((prev) => [
          ...prev,
          { id, url: "", filename: file.name, sizeKb, progress: 0 },
        ]);

        const reader = new FileReader();

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === id && img.progress < 90
                ? { ...img, progress: img.progress + 15 }
                : img,
            ),
          );
        }, 80);

        reader.onload = (e) => {
          clearInterval(progressInterval);
          const dataUrl = e.target?.result as string;

          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, url: dataUrl, progress: 100 } : img,
            ),
          );

          // Add to form data
          onChange({
            evidenceImages: [...data.evidenceImages, dataUrl],
          });
        };

        reader.onerror = () => {
          clearInterval(progressInterval);
          setUploadedImages((prev) => prev.filter((img) => img.id !== id));
          setUploadError(`Failed to read "${file.name}".`);
        };

        reader.readAsDataURL(file);
      }
    },
    [uploadedImages, data.evidenceImages, onChange],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = ""; // reset so same file can be re-added
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeImage = (id: string, url: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    onChange({
      evidenceImages: data.evidenceImages.filter((u) => u !== url),
    });
  };

  return (
    <div className="space-y-5" data-ocid="evidence_step.section">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Evidence & documentation
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload photos or select evidence types you have. This strengthens your
          legal position.
        </p>
      </div>

      {/* ── Image Upload Section ── */}
      <div className="space-y-3" data-ocid="evidence_step.upload_section">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <ImagePlus className="w-4 h-4 text-accent" aria-hidden="true" />
          Upload Evidence Images
          <span className="text-muted-foreground font-normal">
            (optional · max {MAX_FILES} files · {MAX_FILE_SIZE_MB}MB each)
          </span>
        </Label>

        {/* Drop Zone */}
        <label
          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring ${
            dragOver
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/60 hover:bg-muted/30"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-ocid="evidence_step.dropzone"
        >
          <Upload
            className="w-7 h-7 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drag & drop images here
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              or{" "}
              <span className="text-accent font-medium underline">
                choose files
              </span>{" "}
              · JPG, PNG, GIF, WebP
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="sr-only"
            onChange={handleFileInput}
            data-ocid="evidence_step.upload_button"
          />
        </label>

        {/* Error message */}
        {uploadError && (
          <p
            className="text-xs text-destructive"
            role="alert"
            data-ocid="evidence_step.upload_error"
          >
            {uploadError}
          </p>
        )}

        {/* Uploaded thumbnails */}
        {uploadedImages.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            data-ocid="evidence_step.image_list"
          >
            {uploadedImages.map((img, idx) => (
              <div
                key={img.id}
                className="relative rounded-lg border border-border bg-muted/30 overflow-hidden"
                data-ocid={`evidence_step.image.${idx + 1}`}
              >
                {/* Thumbnail or placeholder */}
                <div className="w-full aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-accent rounded-full animate-spin" />
                  )}
                </div>

                {/* Progress bar */}
                {img.progress < 100 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-muted"
                    aria-label={`Uploading ${img.filename}: ${img.progress}%`}
                  >
                    <div
                      className="h-full bg-accent transition-all duration-100"
                      style={{ width: `${img.progress}%` }}
                    />
                  </div>
                )}

                {/* Info + delete */}
                <div className="p-1.5 flex items-center justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-foreground truncate">
                      {img.filename}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {img.sizeKb} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id, img.url);
                    }}
                    aria-label={`Remove ${img.filename}`}
                    data-ocid={`evidence_step.delete_image.${idx + 1}`}
                  >
                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Evidence Checkboxes ── */}
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <legend className="sr-only">Evidence items</legend>
        {EVIDENCE_ITEMS.map((item, idx) => {
          const checked = data.evidenceItems.includes(item.id);
          return (
            <label
              key={item.id}
              htmlFor={`evidence-${item.id}`}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-fast ${
                checked
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
              data-ocid={`evidence_step.item.${idx + 1}`}
            >
              <Checkbox
                id={`evidence-${item.id}`}
                checked={checked}
                onCheckedChange={() => toggleItem(item.id)}
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <span className="text-sm text-foreground select-none">
                {item.label}
              </span>
            </label>
          );
        })}
      </fieldset>

      {data.evidenceItems.length > 0 && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-foreground">
          <strong className="font-medium text-accent">
            {data.evidenceItems.length} item
            {data.evidenceItems.length > 1 ? "s" : ""} selected.
          </strong>{" "}
          These will be cited as supporting evidence in your letter.
        </div>
      )}

      <div className="form-group">
        <Label htmlFor="additionalEvidence" className="text-sm font-medium">
          Additional evidence details (optional)
        </Label>
        <Textarea
          id="additionalEvidence"
          value={data.additionalEvidence}
          onChange={(e) => onChange({ additionalEvidence: e.target.value })}
          placeholder="Describe any other supporting evidence you have, including reference numbers, dates, or locations…"
          rows={3}
          data-ocid="evidence_step.additional_textarea"
        />
      </div>
    </div>
  );
}
