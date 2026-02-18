import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/investigaciones", label: "Investigaciones" },
    { href: "/metodologia", label: "Metodología" },
    { href: "/datos-abiertos", label: "Datos Abiertos" },
    { href: "/participacion", label: "Participación" },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">LP</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-sm leading-tight">
                  Laboratorio Público
                </span>
                <span className="text-muted-foreground text-xs">Análisis Estructural • Choix</span>
              </div>
            </div>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Theme switcher y autenticación */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="outline" size="sm">
                  Acceder
                </Button>
              </a>
            )}
          </div>

          {/* Menú móvil */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Menú móvil expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-start"
              >
                {theme === "dark" ? (
                  <><Sun className="h-4 w-4 mr-2" /> Modo Claro</>
                ) : (
                  <><Moon className="h-4 w-4 mr-2" /> Modo Oscuro</>
                )}
              </Button>
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Acceder
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
