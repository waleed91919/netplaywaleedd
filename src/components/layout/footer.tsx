import Link from 'next/link';
import { FaGithub, FaTwitter, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { SiThemoviedatabase } from 'react-icons/si';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-accent-color mb-4 flex items-center">
              <span>Net</span>
              <span>play</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Die ultimative Streaming-Plattform für Filme, Serien und Anime. Entdecke neue Inhalte und genieße deine Lieblingssendungen.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/movie" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Filme
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Serien
                </Link>
              </li>
              <li>
                <Link href="/anime" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Anime
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dmca" className="text-muted-foreground hover:text-accent-color transition-colors">
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-accent-color transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4">Verbinden</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-muted-foreground hover:text-accent-color transition-colors" aria-label="Github">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent-color transition-colors" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent-color transition-colors" aria-label="Discord">
                <FaDiscord size={20} />
              </a>
              <a href="mailto:info@netplay.example" className="text-muted-foreground hover:text-accent-color transition-colors" aria-label="Email">
                <FaEnvelope size={20} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Abonniere unseren Newsletter für Updates zu neuen Filmen und Serien.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} Netplay. Alle Rechte vorbehalten.
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <SiThemoviedatabase className="mr-2 text-[#01b4e4]" size={24} />
            <p>Diese Seite verwendet die TMDB API, ist aber nicht von TMDB unterstützt oder zertifiziert.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
