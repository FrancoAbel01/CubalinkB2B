import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import pros from '../img/1-removebg-preview.png';
import barcelo from '../img/2-removebg-preview.png';
import applause from '../img/3-removebg-preview.png';
import crownpeak from '../img/4-removebg-preview.png';
import double from '../img/5-removebg-preview.png';
import front10 from '../img/front10.png';
import adavec from '../img/adavec.png';

export const FeaturedCompaniesCarousel = () => {
    const t: Record<string, string> = {
        sectionLabel: 'Sección de clientes, Carrusel de logos empresariales',
        carouselLabel: 'Logos de empresas colaboradoras',
        logoDescription: 'Logo de la empresa {name}',
        logoLive: 'Mostrando el logo de los clientes',
        previousButton: 'boton anterior',
        nextButton: 'boton siguiente',
        play: 'Iniciar rotación automática',
        pause: 'Pausar rotación automática',
        instruction: 'Usa los botones anterior y siguiente para navegar',
    };

    const originalPartners = [
        { name: 'Empresa', logo: pros },
        { name: 'Empresa', logo: barcelo },
        { name: 'Empresa', logo: applause },
        { name: 'Empresa', logo: crownpeak },
        { name: 'Empresa', logo: double },
        { name: 'Empresa', logo: adavec },
        { name: 'Empresa', logo: front10 },
    ];

    const partners = [...originalPartners, ...originalPartners];
    const maxIndex = originalPartners.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [visibleItems, setVisibleItems] = useState(6);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [activeDescription, setActiveDescription] = useState('');

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);

    const scrollIntoView = () => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const updateLiveDescription = (key: keyof typeof t, name?: string) => {
        let message = t[key] ?? '';
        if (name) message = message.replace('{name}', name);
        setActiveDescription('');
        setTimeout(() => {
            setActiveDescription(message);
            if (descriptionRef.current) descriptionRef.current.textContent = message;
        }, 10);
    };

    useEffect(() => {
        const onResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Móvil: mostramos más logos (logos más pequeños) — ajusta si quieres
            setVisibleItems(mobile ? 6 : 8);
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (isAutoPlay) {
            intervalRef.current = setInterval(() => {
                slideTo(currentIndex + 1);
            }, 3000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentIndex, isAutoPlay]);

    const slideTo = (toIndex: number) => {
        if (toIndex >= maxIndex) {
            setTransitionEnabled(true);
            setCurrentIndex(toIndex);
            setTimeout(() => {
                setTransitionEnabled(false);
                setCurrentIndex(0);
            }, 500);
        } else if (toIndex < 0) {
            setTransitionEnabled(true);
            setCurrentIndex(toIndex + maxIndex);
            setTimeout(() => {
                setTransitionEnabled(false);
                setCurrentIndex(maxIndex - 1);
            }, 500);
        } else {
            setTransitionEnabled(true);
            setCurrentIndex(toIndex);
        }
    };

    const handlePrev = () => {
        setIsAutoPlay(false);
        slideTo(currentIndex - 1);
        updateLiveDescription('previousButton');
    };

    const handleNext = () => {
        setIsAutoPlay(false);
        slideTo(currentIndex + 1);
        updateLiveDescription('nextButton');
    };

    const toggleAutoPlay = () => {
        const newState = !isAutoPlay;
        setIsAutoPlay(newState);
        updateLiveDescription(newState ? 'play' : 'pause');
    };

    const itemWidth = 100 / visibleItems;

    // ajustes visuales según isMobile
    const sectionPaddingClass = isMobile ? 'py-3' : 'py-6';
    const cellHeight = isMobile ? 50 : 96; // reducido en móvil
    const imgMaxHeight = isMobile ? 36 : 64;
    const imgMaxWidthPct = isMobile ? '36%' : '60%';
    // espaciamiento: en móvil usamos menos padding lateral (2px)
    const cellPaddingInline = isMobile ? '0 0.125rem' : '0 0.5rem';

    return (
        <section
            ref={sectionRef}
            className={`bg-black ${sectionPaddingClass} relative w-full overflow-hidden rounded-xl`}
            id="clients"
            aria-label={t.sectionLabel}
        >
            <div
                ref={descriptionRef}
                aria-live="polite"
                className="sr-only"
                aria-atomic="true"
            />

            <div className="w-full overflow-hidden">
                <div
                    className="flex"
                    style={{
                        width: `${partners.length * itemWidth}%`,
                        transform: `translateX(-${currentIndex * itemWidth}%)`,
                        transition: transitionEnabled
                            ? 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
                            : 'none',
                    }}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label={t.carouselLabel}
                >
                    {partners.map((partner, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 flex justify-center items-center"
                            style={{ width: `${itemWidth}%`, padding: cellPaddingInline }}
                        >
                            <div
                                className="w-full flex justify-center items-center"
                                role="img"
                                aria-label={t.logoDescription.replace('{name}', partner.name)}
                                onMouseEnter={() =>
                                    updateLiveDescription('logoLive', partner.name)
                                }
                                onMouseLeave={() => updateLiveDescription('logoLive')}
                                style={{ height: `${cellHeight}px` }}
                            >
                                <img
                                    src={partner.logo}
                                    alt={t.logoDescription.replace('{name}', partner.name)}
                                    className="w-auto filter brightness-0 invert hover:opacity-100 transition-opacity duration-300 object-contain"
                                    style={{
                                        maxHeight: `${imgMaxHeight}px`,
                                        maxWidth: imgMaxWidthPct,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {activeDescription}
            </div>
        </section>
    );
};
