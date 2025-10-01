"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const isAdminPage = pathname.startsWith("/admin");
  const isAdmin = user?.role === "admin";

  // Regular navigation for public/user pages
  const publicNavigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.tours"), href: "/tours" },
    { name: t("nav.about"), href: "/about" },
  ];

  // Admin navigation - only the pages we created
  const adminNavigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Tours", href: "/admin/tours" },
  ];

  const navigation =
    isAdminPage && isAdmin ? adminNavigation : publicNavigation;

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md shadow-2xl border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div
              className="text-2xl font-light tracking-widest text-white"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              GLOWETSU
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-light tracking-wide uppercase transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-amber-300 border-b border-amber-300 pb-1"
                    : "text-white hover:text-amber-300 hover:tracking-wider"
                }`}
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher - Only show on public pages */}
            {!isAdminPage && <LanguageSwitcher />}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="px-5 py-2.5 border border-gray-300 text-white bg-transparent hover:bg-gray-800 rounded-md transition-all duration-200 font-medium">
                    <User className="h-4 w-4 mr-2" />
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-black/95 backdrop-blur-md border border-gray-700/50 shadow-2xl"
                >
                  {/* Admin/User Navigation Toggle */}
                  {isAdmin && (
                    <>
                      {isAdminPage ? (
                        <DropdownMenuItem
                          className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                          asChild
                        >
                          <Link href="/">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Switch to User View
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                          asChild
                        >
                          <Link href="/admin">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            {t("nav.admin")}
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {isAdminPage && (
                    <>
                      <DropdownMenuItem
                        className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                        asChild
                      >
                        <Link href="/admin/calender">Calender View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                        asChild
                      >
                        <Link href="/admin/orders">All Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                        asChild
                      >
                        <Link href="/admin/categories">Categories</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                        asChild
                      >
                        <Link href="/admin/tours">Tours</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                        asChild
                      >
                        <Link href="/admin/users">All Users</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* User-specific options - only show on public pages */}
                  {!isAdminPage && (
                    <>
                      <DropdownMenuItem
                        className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                        asChild
                      >
                        <Link href="/orderhistory">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-white hover:text-amber-300 hover:bg-amber-700/20 focus:text-amber-300 focus:bg-amber-700/20 font-light tracking-wide"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.signout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-3">
                <Button
                 className="px-5 py-2.5 border border-gray-300 text-white bg-transparent hover:bg-gray-800 rounded-md transition-all duration-200 font-medium"
                  asChild
                >
                  <Link href="/auth/signin">{t("nav.signin")}</Link>
                </Button>
                <Button
                  className="px-5 py-2.5 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-all duration-200 font-medium"
                  asChild
                >
                  <Link href="/auth/signup">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              className="p-2.5 border border-gray-600 text-white bg-transparent hover:bg-gray-800 rounded-md transition-all duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50 bg-black/90 backdrop-blur-sm">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-light tracking-wide uppercase transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-amber-300 bg-amber-700/20 border-l-2 border-amber-300"
                      : "text-white hover:text-amber-300 hover:bg-amber-700/10 hover:tracking-wider"
                  }`}
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Bottom Section */}
              <div className="pt-4 border-t border-gray-700/50 space-y-2">
                {/* Language Switcher - Only on public pages, cleaner mobile design */}
                {!isAdminPage && (
                  <div className="px-3 py-2">
                    <div className="text-xs text-gray-300 mb-2">Language</div>
                    <LanguageSwitcher />
                  </div>
                )}

                {user ? (
                  <div className="space-y-2">
                    {/* Admin Toggle */}
                    {isAdmin && (
                      <Link
                        href={isAdminPage ? "/" : "/admin"}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        {isAdminPage ? "Switch to User View" : t("nav.admin")}
                      </Link>
                    )}

                    {/* Order History - Only on public pages */}
                    {!isAdminPage && (
                      <Link
                        href="/orders"
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        Order History
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm font-light tracking-wide text-white hover:text-amber-300 hover:bg-amber-700/20 transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {t("nav.signout")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 text-sm font-light tracking-wide text-white hover:text-amber-300 hover:bg-amber-700/20 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.signin")}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-3 py-2 text-sm font-light tracking-wide text-amber-300 bg-amber-700/20 hover:bg-amber-700/30 border-l-2 border-amber-300 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
