import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  Flag,
  Globe,
  Languages,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { US_STATES, WORLD_COUNTRIES, WORLD_LANGUAGES } from "../../types";
import type { LetterFormData } from "../../types";

interface JurisdictionStepProps {
  data: LetterFormData;
  onChange: (data: Partial<LetterFormData>) => void;
}

export function JurisdictionStep({ data, onChange }: JurisdictionStepProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const selectedLanguage = data.language || "English";
  const selectedCountryCode = data.country || "US";
  const selectedCountry =
    WORLD_COUNTRIES.find((c) => c.code === selectedCountryCode) ??
    WORLD_COUNTRIES.find((c) => c.code === "US")!;

  return (
    <div className="space-y-6" data-ocid="jurisdiction_step.section">
      {/* ── Jurisdiction ─────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Jurisdiction
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your state determines which statutes and consumer protection laws
            apply to your letter.
          </p>
        </div>

        <div className="form-group">
          <Label htmlFor="jurisdictionSelect" className="text-sm font-medium">
            State / Jurisdiction <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.jurisdiction}
            onValueChange={(v) => onChange({ jurisdiction: v })}
          >
            <SelectTrigger
              id="jurisdictionSelect"
              data-ocid="jurisdiction_step.state_select"
            >
              <SelectValue placeholder="Select state…" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="INT">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
                  International / Other
                </span>
              </SelectItem>
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {data.jurisdiction && data.jurisdiction !== "INT" && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 flex items-start gap-3">
            <MapPin
              className="w-4 h-4 text-accent shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="text-sm text-foreground">
              <strong className="font-medium text-accent">
                {US_STATES.find((s) => s.code === data.jurisdiction)?.name} law
                applies.
              </strong>{" "}
              Relevant statutes and consumer protection codes for this state
              will be automatically cited in your demand letter.
            </div>
          </div>
        )}

        {data.jurisdiction === "INT" && (
          <div className="p-4 rounded-lg bg-muted border border-border flex items-start gap-3">
            <Globe
              className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              International jurisdiction selected. The letter will reference
              general legal principles. Consider consulting a local attorney for
              jurisdiction-specific citations.
            </p>
          </div>
        )}
      </div>

      {/* ── Country ──────────────────────────────────────── */}
      <div className="space-y-3 border-t border-border pt-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-5 h-5 text-accent" aria-hidden="true" />
            Country
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select your country so we can auto-cite the correct national laws
            and regulations in your demand letter.
          </p>
        </div>

        <div className="form-group">
          <Label htmlFor="countryCombobox" className="text-sm font-medium">
            Country <span className="text-destructive">*</span>
          </Label>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <Button
                id="countryCombobox"
                variant="outline"
                aria-expanded={countryOpen}
                aria-label="Select country"
                aria-haspopup="listbox"
                className="w-full justify-between font-normal bg-background border-input hover:bg-accent/5"
                data-ocid="jurisdiction_step.country_select"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-base leading-none shrink-0"
                    aria-hidden="true"
                  >
                    {selectedCountry.name.split(" ")[0]}
                  </span>
                  <span className="truncate">
                    {selectedCountry.name.replace(/^[^\s]+\s/, "")}
                  </span>
                </span>
                <ChevronsUpDown
                  className="ml-2 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput
                  placeholder="Search countries…"
                  className="h-9"
                  data-ocid="jurisdiction_step.country_search_input"
                />
                <CommandList className="max-h-60">
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {WORLD_COUNTRIES.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={`${country.name} ${country.code}`}
                        onSelect={() => {
                          onChange({ country: country.code });
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            selectedCountryCode === country.code
                              ? "opacity-100 text-accent"
                              : "opacity-0",
                          )}
                          aria-hidden="true"
                        />
                        <span>{country.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2.5">
          <Globe
            className="w-4 h-4 text-primary shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-foreground">
            Country-specific laws for{" "}
            <strong className="text-primary">
              {selectedCountry.name.replace(/^[^\s]+\s/, "")}
            </strong>{" "}
            will be automatically cited in the Legal Basis section of your
            letter.
          </p>
        </div>
      </div>

      {/* ── Language ─────────────────────────────────────── */}
      <div className="space-y-3 border-t border-border pt-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Languages className="w-5 h-5 text-accent" aria-hidden="true" />
            Letter Language
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Choose the language your demand letter will be written in.
          </p>
        </div>

        <div className="form-group">
          <Label htmlFor="languageCombobox" className="text-sm font-medium">
            Language <span className="text-destructive">*</span>
          </Label>
          <Popover open={langOpen} onOpenChange={setLangOpen}>
            <PopoverTrigger asChild>
              <Button
                id="languageCombobox"
                variant="outline"
                aria-expanded={langOpen}
                aria-label="Select language"
                aria-haspopup="listbox"
                className="w-full justify-between font-normal bg-background border-input hover:bg-accent/5"
                data-ocid="jurisdiction_step.language_select"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Languages
                    className="w-4 h-4 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{selectedLanguage}</span>
                </span>
                <ChevronsUpDown
                  className="ml-2 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput
                  placeholder="Search languages…"
                  className="h-9"
                  data-ocid="jurisdiction_step.language_search_input"
                />
                <CommandList className="max-h-60">
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {WORLD_LANGUAGES.map((lang) => (
                      <CommandItem
                        key={lang}
                        value={lang}
                        onSelect={(val) => {
                          const match =
                            WORLD_LANGUAGES.find(
                              (l) => l.toLowerCase() === val.toLowerCase(),
                            ) ?? val;
                          onChange({ language: match });
                          setLangOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLanguage === lang
                              ? "opacity-100 text-accent"
                              : "opacity-0",
                          )}
                          aria-hidden="true"
                        />
                        {lang}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedLanguage !== "English" && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-start gap-2.5">
            <Languages
              className="w-4 h-4 text-accent shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-foreground">
              Your letter will be generated in{" "}
              <strong className="text-accent">{selectedLanguage}</strong>. Legal
              terminology will be adapted for the selected language.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
