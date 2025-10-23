// File: src/components/SearchHeader.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search } from 'lucide-react';

export default function SearchHeader({
  searchTerm,
  onSearchChange,
  companyTypes = [
    'Gastronomía',
    'Tecnología',
    'Software',
    'Tienda',
    'Electrónica',
    'Energía',
    'Automotriz',
  ],
  selectedTypes: selectedTypesProp,
  onFilterChange,
  allowMultiple = true,
}: {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  companyTypes?: string[];
  selectedTypes?: string[]; // cuando se proporciona, el componente opera en modo controlado
  onFilterChange?: (types: string[]) => void;
  allowMultiple?: boolean;
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function commitSearch(value: string) {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onSearchChange(value);
      debounceRef.current = null;
    }, 300);
  }

  // Modo controlado vs no controlado
  const isControlled = selectedTypesProp !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedTypesProp ?? []);

  // sincronizar internal cuando el padre cambie la prop (solo en montos controlados -> inicialización)
  useEffect(() => {
    if (selectedTypesProp !== undefined) {
      setInternalSelected(selectedTypesProp);
    }
  }, [selectedTypesProp]);

  const selectedTypes = isControlled ? (selectedTypesProp as string[]) : internalSelected;

  // Llamamos a onFilterChange cuando cambie (para modo no controlado lo hace aquí; en modo controlado
  // el padre es quien debería cambiar la prop pero igual emitimos el valor nuevo).
  const emitChange = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalSelected(next);
      if (onFilterChange) onFilterChange(next);
    },
    [isControlled, onFilterChange]
  );

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const toggleType = useCallback(
    (t: string) => {
      const has = selectedTypes.includes(t);
      let next: string[];
      if (allowMultiple) {
        next = has ? selectedTypes.filter((x) => x !== t) : [...selectedTypes, t];
      } else {
        next = has ? [] : [t];
      }
      // emitimos el nuevo array (el padre decidirá si lo aplica o no en modo controlado)
      emitChange(next);
      if (!allowMultiple) setOpen(false);
    },
    [selectedTypes, allowMultiple, emitChange]
  );

  const clearFilters = useCallback(() => {
    emitChange([]);
  }, [emitChange]);

  return (
    <header className="backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black">Directorio de Empresas</h2>
            <p className="text-Black mt-1">Descubre productos y servicios de empresas destacadas</p>
          </div>

          <div className="w-full md:w-1/2 flex gap-4 items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black" aria-hidden>
                <Search className="w-5 h-5" />
              </span>
              <input
                id="search"
                type="text"
                placeholder="Buscar empresas, productos o servicios..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  commitSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (debounceRef.current) window.clearTimeout(debounceRef.current);
                    onSearchChange(localSearch);
                    debounceRef.current = null;
                  }
                }}
                className="w-full pl-11 pr-4 py-3 border border-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                aria-label="Buscar empresas"
              />
            </div>

            <div className="relative" ref={panelRef}>
              <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full shadow-sm bg-white text-sm hover:shadow-md transition"
              >
                <span className="truncate max-w-[10rem]">
                  {selectedTypes.length === 0 ? 'Tipo: Todos' : selectedTypes.join(', ')}
                </span>
                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-20">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-sm">Filtrar por tipo</strong>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Limpiar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto pr-1" role="listbox" aria-multiselectable={allowMultiple}>
                    {companyTypes.map((t) => {
                      const checked = selectedTypes.includes(t);
                      return (
                        <label
                          key={t}
                          className="flex items-center gap-3 cursor-pointer rounded-md px-2 py-1 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleType(t)}
                            className="w-4 h-4 rounded border-slate-300"
                            aria-checked={checked}
                          />
                          <span className="text-sm truncate">{t}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
