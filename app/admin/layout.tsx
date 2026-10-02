import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KyuFlorist Admin Dashboard",
  description: "Panel admin KyuFlorist - kelola pesanan, produk, dan pelanggan.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.variable} font-poppins min-h-screen bg-slate-900`}>
      {children}
    </div>
  );
}
