"use client"

import "../globals.css";
import CreatorProviders from "../providers/creatorProviders";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const thing = "";
  return (
    <CreatorProviders>
      <html lang="en">
        <body>{children}</body>
      </html>
    </CreatorProviders>
  );
}
