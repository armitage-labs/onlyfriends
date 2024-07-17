"use client"

import "../globals.css";
import PrivyProviderImpl from "../providers/privy-provider";


export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PrivyProviderImpl>
          {children}
        </PrivyProviderImpl>
      </body>
    </html>
  );
}
