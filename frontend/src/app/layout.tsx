import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react";

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children } :RootLayoutProps) {
    return (
        <html lang="ko">
            <head />
            <body>
            <main>{children}</main>
            <Toaster />
            </body>
        </html>
    )
}