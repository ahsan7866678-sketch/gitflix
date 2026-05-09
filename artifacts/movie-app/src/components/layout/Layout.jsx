import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children, hideFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--app-bg)", color: "var(--app-text)" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
