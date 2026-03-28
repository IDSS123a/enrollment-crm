import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisitorFormData } from '@/types/visitor';
import { countries } from '@/lib/countries';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChildInfoSectionProps {
  formData: VisitorFormData;
  onChange: (data: Partial<VisitorFormData>) => void;
  t: (key: string) => string;
}

export function ChildInfoSection({ formData, onChange, t }: ChildInfoSectionProps) {
  const [countryOpen, setCountryOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">{t('childInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="child_first_name">{t('firstName')} *</Label>
          <Input
            id="child_first_name"
            value={formData.child_first_name}
            onChange={(e) => onChange({ child_first_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="child_last_name">{t('lastName')} *</Label>
          <Input
            id="child_last_name"
            value={formData.child_last_name}
            onChange={(e) => onChange({ child_last_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="child_date_of_birth">{t('dateOfBirth')} *</Label>
          <Input
            id="child_date_of_birth"
            type="date"
            value={formData.child_date_of_birth}
            onChange={(e) => onChange({ child_date_of_birth: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>{t('citizenship')} *</Label>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countryOpen}
                className="w-full justify-between font-normal"
              >
                {formData.child_citizenship || t('citizenship')}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country}
                        value={country}
                        onSelect={() => {
                          onChange({ child_citizenship: country });
                          setCountryOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", formData.child_citizenship === country ? "opacity-100" : "opacity-0")} />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="child_address">{t('address')} *</Label>
          <Input
            id="child_address"
            value={formData.child_address}
            onChange={(e) => onChange({ child_address: e.target.value })}
            placeholder={t('addressPlaceholder')}
            required
          />
        </div>
      </div>
    </div>
  );
}
