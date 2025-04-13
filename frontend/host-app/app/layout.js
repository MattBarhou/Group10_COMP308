import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Community Engagement App",
  description: "Connect with your local community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
