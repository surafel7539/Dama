import { Suspense } from "react";
import Script from "next/script";
import Providers from "./providers";
import Shell from "@/components/Shell";
import "./globals.css";

export const metadata = {
  title: "Dama Marketplace",
  description: "Ethiopia's marketplace for trusted buyers and sellers.",
  icons: {
    icon: "/758853720_2533852980378695_8891268762573421557_n-removebg-preview.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="dama-theme" strategy="beforeInteractive">
          {`try{var savedTheme=localStorage.getItem("dama-theme");if(savedTheme!=="light")document.documentElement.classList.add("dark");}catch(e){}`}
        </Script>
        <Providers>
          <Shell>
            <Suspense fallback={null}>{children}</Suspense>
          </Shell>
        </Providers>
      </body>
    </html>
  );
}
