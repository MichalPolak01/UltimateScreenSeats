import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar/navbar";
import { AuthProvider } from "@/providers/authProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <AuthProvider>
            <Navbar />
            <main className="container mx-auto max-w-[1920] flex-grow">
              {children}
            </main>
            <footer className="z-10 container mx-auto flex flex-wrap gap-4 items-center sm:justify-between justify-center p-5 border-t-2 border-default-300 mt-10">
            {/* <footer className="relative z-10"> */}
                <span className="text-default-600">Copyright &copy; 2024</span>
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                  title="nextui.org homepage"
                >
                  <span className="text-default-600">Powered by</span>
                  <p className="text-primary">NextUI</p>
                </Link>
              </footer>
            </AuthProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html suppressHydrationWarning lang="en">
//       <head />
//       <body
//         className="min-h-screen flex flex-col bg-background font-sans antialiased"
//       >
//         <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
//           <AuthProvider>
//             <Navbar />
//             {/* Główna treść zajmuje resztę miejsca */}
//             <main className="flex-grow container mx-auto max-w-[1920px]">
//               {children}
//             </main>
//             {/* Stopka */}
//             <footer className="container mx-auto flex flex-wrap gap-4 items-center sm:justify-between justify-center p-5 border-t-2 border-default-300 mt-10">
//               <span className="text-default-600">Copyright &copy; 2024</span>
//               <Link
//                 isExternal
//                 className="flex items-center gap-1 text-current"
//                 href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
//                 title="nextui.org homepage"
//               >
//                 <span className="text-default-600">Powered by</span>
//                 <p className="text-primary">NextUI</p>
//               </Link>
//             </footer>
//           </AuthProvider>
//         </Providers>
//       </body>
//     </html>
//   );
// }