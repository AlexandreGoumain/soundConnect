import Header from "../components/header/Header";
export default function UserDashboard({ children }) {
    return (
        <main className="user-dashboard">
            <Header />
            {children}
        </main>
    );
}
