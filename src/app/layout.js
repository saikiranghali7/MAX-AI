import "./globals.css";

import { APP } from "@/constants/app";

import { UIProvider } from "@/context/UIContext";
import { ChatProvider } from "@/context/ChatContext";

export const metadata = {
  title: APP.NAME,
  description: APP.DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UIProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </UIProvider>
      </body>
    </html>
  );
}