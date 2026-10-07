 "use client";

 import React, { useEffect, useState } from "react";
 import Link from "next/link";
 import { usePathname, useRouter } from "next/navigation";
 import {
   Menu,
   X,
   Home as HomeIcon,
   Map as MapIcon,
   Gamepad2,
   LayoutDashboard,
   Terminal,
   Globe,
   ChevronDown,
   Check,
   LogOut,
   BarChart3,
 } from "lucide-react";

 const LANGS = [
   { code: "en", name: "English", nativeName: "English" },
   { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
   { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
   { code: "bn", name: "Bengali", nativeName: "বাংলা" },
   { code: "te", name: "Telugu", nativeName: "తెలుగు" },
   { code: "mr", name: "Marathi", nativeName: "मराठी" },
 ];

 type DesktopLinkProps = {
   href: string;
   label: string;
   active: boolean;
 };

 type MobileNavItemProps = {
   href: string;
   icon: React.ReactNode;
   label: string;
   active: boolean;
 };

 type SheetItemProps = {
   href: string;
   icon: React.ReactNode;
   label: string;
 };

 const NavbarShell: React.FC = () => {
  const pathname = usePathname();
   const router = useRouter();
   const [scrolled, setScrolled] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [langOpen, setLangOpen] = useState(false);
   const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

   const isActive = (path: string) => {
     if (path === "/") return pathname === "/";
     return pathname?.startsWith(path);
   };

   const selectedLanguage =
     LANGS.find((l) => l.code === currentLang) ?? LANGS[0];

   const desktopBase =
     "hidden lg:flex fixed top-5 inset-x-0 mx-auto w-fit max-w-[95vw] z-[60] items-center p-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)] gap-2";
   const desktopScrolled = scrolled
     ? " bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-xl shadow-slate-900/5 h-12"
     : " bg-white/80 backdrop-blur-lg border border-white/40 shadow-lg shadow-slate-900/5 h-14";

   return (
     <>
       <nav className={desktopBase + desktopScrolled}>
         <Link href="/" className="flex items-center gap-2 px-3 shrink-0 group">
           <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
             N
           </div>
           <span className="font-bold text-base text-slate-800 tracking-tight">
             Neta
           </span>
         </Link>

        <div className="flex items-center px-1 shrink-0 h-full gap-1">
          <DesktopLink href="/" label="Home" active={isActive("/")} />
          <DesktopLink
            href="/state-ranking"
            label="States"
            active={isActive("/state-ranking")}
          />
          <DesktopLink
            href="/governance-dashboard"
            label="Governance"
            active={isActive("/governance-dashboard")}
          />
          <DesktopLink
            href="/public-metrics"
            label="System metrics"
            active={isActive("/public-metrics")}
          />
          <DesktopLink
            href="/admin"
            label="Admin"
            active={isActive("/admin")}
          />
        </div>

         <div className="h-4 w-px bg-slate-200 mx-1" />

         <div className="flex items-center gap-2 pr-1 shrink-0">
           <button
             type="button"
             onClick={() => router.push("/open-data.json")}
             className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
           >
             <Terminal size={14} />
             Dev API
           </button>
           <div className="relative">
             <button
               type="button"
               onClick={() => setLangOpen((v) => !v)}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
             >
               <Globe size={14} />
               {selectedLanguage.code.toUpperCase()}
               <ChevronDown size={12} />
             </button>
             {langOpen && (
               <div className="absolute top-full mt-2 right-0 w-48 max-h-64 overflow-y-auto no-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200 p-1 z-50">
                 {LANGS.map((lang) => (
                   <button
                     key={lang.code}
                     type="button"
                     onClick={() => {
                       setCurrentLang(lang.code);
                       setLangOpen(false);
                     }}
                     className={
                       "w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between " +
                       (currentLang === lang.code
                         ? "bg-blue-50 text-blue-600"
                         : "text-slate-600 hover:bg-slate-50")
                     }
                   >
                     <span>
                       {lang.name}{" "}
                       <span className="opacity-50 font-normal">
                         ({lang.nativeName})
                       </span>
                     </span>
                     {currentLang === lang.code && <Check size={12} />}
                   </button>
                 ))}
               </div>
             )}
           </div>
           <Link
             href="/system-transparency"
             className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
           >
             <LayoutDashboard size={14} />
            Integrity
           </Link>
         </div>
       </nav>

       <div className="lg:hidden">
         <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 z-[60] flex items-center justify-between">
           <button
             type="button"
             onClick={() => router.push("/")}
             className="flex items-center gap-2"
           >
             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
               N
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-900 leading-tight">
                 Neta
               </span>
               <span className="text-[10px] text-slate-500">
                 Know Your Leader
               </span>
             </div>
           </button>
           <button
             type="button"
             onClick={() => setIsMenuOpen((v) => !v)}
             className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
           >
             {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
           </button>
         </div>

         <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 pb-safe z-[60] flex justify-between items-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
           <MobileNavItem
             href="/"
             icon={<HomeIcon size={22} />}
             label="Home"
             active={isActive("/")}
           />
           <MobileNavItem
             href="/state-ranking"
             icon={<BarChart3 size={22} />}
            label="States"
             active={isActive("/state-ranking")}
           />
           <MobileNavItem
             href="/governance-dashboard"
             icon={<MapIcon size={22} />}
            label="Gov"
             active={isActive("/governance-dashboard")}
           />
           <MobileNavItem
             href="/public-metrics"
             icon={<Gamepad2 size={22} />}
            label="Metrics"
             active={isActive("/public-metrics")}
           />
          <MobileNavItem
            href="/admin"
            icon={<LayoutDashboard size={22} />}
            label="Admin"
            active={isActive("/admin")}
          />
         </div>

         {isMenuOpen && (
           <>
             <div
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
               onClick={() => setIsMenuOpen(false)}
             />
             <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[80] max-h-[85vh] overflow-hidden flex flex-col pb-safe">
               <div className="w-full flex justify-center pt-3 pb-1">
                 <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
               </div>
               <div className="p-6 overflow-y-auto no-scrollbar">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                   Navigation
                 </h4>
                 <div className="grid grid-cols-3 gap-4 mb-8">
                   <SheetItem
                     href="/"
                     icon={<HomeIcon className="text-slate-700" />}
                     label="Home"
                   />
                   <SheetItem
                     href="/state-ranking"
                     icon={<BarChart3 className="text-green-500" />}
                     label="Rankings"
                   />
                   <SheetItem
                     href="/governance-dashboard"
                     icon={<MapIcon className="text-orange-500" />}
                     label="Gov"
                   />
                   <SheetItem
                     href="/public-metrics"
                     icon={<LayoutDashboard className="text-purple-500" />}
                     label="Metrics"
                   />
                   <SheetItem
                     href="/system-transparency"
                     icon={<Terminal className="text-slate-600" />}
                     label="System"
                   />
                 </div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                   Language
                 </h4>
                 <div className="grid grid-cols-2 gap-3">
                   {LANGS.slice(0, 6).map((lang) => (
                     <button
                       key={lang.code}
                       type="button"
                       onClick={() => {
                         setCurrentLang(lang.code);
                         setIsMenuOpen(false);
                       }}
                       className={
                         "px-4 py-3 rounded-xl text-sm font-bold text-left border transition-all " +
                         (currentLang === lang.code
                           ? "bg-blue-50 border-blue-200 text-blue-700"
                           : "bg-white border-slate-100 text-slate-600")
                       }
                     >
                       {lang.nativeName}
                     </button>
                   ))}
                   <button
                     type="button"
                     className="px-4 py-3 rounded-xl text-sm font-bold text-center border border-dashed border-slate-300 text-slate-400"
                   >
                     +16 More
                   </button>
                 </div>
                 <button
                   type="button"
                   className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   <LogOut size={14} />
                   Close
                 </button>
               </div>
             </div>
           </>
         )}
       </div>
     </>
   );
 };

 const DesktopLink: React.FC<DesktopLinkProps> = ({ href, label, active }) => {
   return (
     <Link
       href={href}
       className={
         "px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 " +
         (active
           ? "bg-slate-900 text-white shadow-lg"
           : "text-slate-600 hover:bg-slate-100")
       }
     >
       {label}
     </Link>
   );
 };

 const MobileNavItem: React.FC<MobileNavItemProps> = ({
   href,
   icon,
   label,
   active,
 }) => {
   return (
     <Link
       href={href}
       className="flex flex-col items-center gap-1 text-xs font-medium"
     >
       <div
         className={
           "w-10 h-10 rounded-full flex items-center justify-center transition-colors " +
           (active
             ? "bg-slate-900 text-white"
             : "bg-slate-100 text-slate-600")
         }
       >
         {icon}
       </div>
       <span
         className={
           "text-[10px] " +
           (active ? "text-slate-900" : "text-slate-500")
         }
       >
         {label}
       </span>
     </Link>
   );
 };

 const SheetItem: React.FC<SheetItemProps> = ({ href, icon, label }) => {
   return (
     <Link
       href={href}
       className="flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100 hover:bg-slate-100 transition-colors"
     >
       <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
         {icon}
       </div>
       <span className="text-[11px] font-semibold text-slate-700 text-center">
         {label}
       </span>
     </Link>
   );
 };

 export default NavbarShell;
