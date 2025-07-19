import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Country {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

const countries: Country[] = [
  { name: "Brasil", flag: "🇧🇷", code: "BR", dialCode: "+55" },
  { name: "Estados Unidos", flag: "🇺🇸", code: "US", dialCode: "+1" },
  { name: "Argentina", flag: "🇦🇷", code: "AR", dialCode: "+54" },
  { name: "Chile", flag: "🇨🇱", code: "CL", dialCode: "+56" },
  { name: "Uruguai", flag: "🇺🇾", code: "UY", dialCode: "+598" },
  { name: "Paraguai", flag: "🇵🇾", code: "PY", dialCode: "+595" },
  { name: "Bolívia", flag: "🇧🇴", code: "BO", dialCode: "+591" },
  { name: "Peru", flag: "🇵🇪", code: "PE", dialCode: "+51" },
  { name: "Colômbia", flag: "🇨🇴", code: "CO", dialCode: "+57" },
  { name: "Venezuela", flag: "🇻🇪", code: "VE", dialCode: "+58" },
  { name: "Equador", flag: "🇪🇨", code: "EC", dialCode: "+593" },
  { name: "México", flag: "🇲🇽", code: "MX", dialCode: "+52" },
  { name: "Canadá", flag: "🇨🇦", code: "CA", dialCode: "+1" },
  { name: "Reino Unido", flag: "🇬🇧", code: "GB", dialCode: "+44" },
  { name: "França", flag: "🇫🇷", code: "FR", dialCode: "+33" },
  { name: "Alemanha", flag: "🇩🇪", code: "DE", dialCode: "+49" },
  { name: "Espanha", flag: "🇪🇸", code: "ES", dialCode: "+34" },
  { name: "Itália", flag: "🇮🇹", code: "IT", dialCode: "+39" },
  { name: "Portugal", flag: "🇵🇹", code: "PT", dialCode: "+351" },
  { name: "China", flag: "🇨🇳", code: "CN", dialCode: "+86" },
  { name: "Japão", flag: "🇯🇵", code: "JP", dialCode: "+81" },
  { name: "Coreia do Sul", flag: "🇰🇷", code: "KR", dialCode: "+82" },
  { name: "Índia", flag: "🇮🇳", code: "IN", dialCode: "+91" },
  { name: "Austrália", flag: "🇦🇺", code: "AU", dialCode: "+61" },
  { name: "Nova Zelândia", flag: "🇳🇿", code: "NZ", dialCode: "+64" },
  { name: "África do Sul", flag: "🇿🇦", code: "ZA", dialCode: "+27" },
  { name: "Rússia", flag: "🇷🇺", code: "RU", dialCode: "+7" },
];

interface CountrySelectorProps {
  value?: Country;
  onSelect: (country: Country) => void;
  disabled?: boolean;
}

export function CountrySelector({ value, onSelect, disabled }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  const defaultCountry = countries.find(country => country.code === "BR") || countries[0];
  const selectedCountry = value || defaultCountry;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="font-mono text-sm">{selectedCountry.dialCode}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar país..." />
          <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dialCode}`}
                  onSelect={() => {
                    onSelect(country);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{country.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {country.dialCode}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}