import Footer from "../components/footer/Footer";
import Navbar from "../components/header/Navbar/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="main-layout">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
