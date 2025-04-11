import Footer from "../components/footer/Footer";
import Navbar from "../components/header/Navbar/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="container flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full mx-auto py-4">{children}</main>
            <Footer />
        </div>
    );
}
