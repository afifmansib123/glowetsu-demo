'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, languageFlags, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-1 bg-transparent text-white hover:bg-orange-600/20 hover:text-orange-300 border border-gray-700 hover:border-orange-300/50 px-3 py-2 rounded-none font-light tracking-wide transition-all duration-300"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageFlags[locale]}</span>
          <span className="hidden md:inline text-sm">{languages[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="bg-black/95 backdrop-blur-md border border-gray-700/50 shadow-2xl"
      >
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code as Locale)}
            className={`flex items-center space-x-2 font-light tracking-wide cursor-pointer ${
              locale === code 
                ? 'bg-orange-600/30 text-orange-300 border-l-2 border-orange-400' 
                : 'text-white hover:text-orange-300 hover:bg-orange-600/20 focus:text-orange-300 focus:bg-orange-600/20'
            }`}
          >
            <span>{languageFlags[code as Locale]}</span>
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}