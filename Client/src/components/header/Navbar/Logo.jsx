import { useNavigate } from "react-router-dom";

export default function Logo() {
    const navigate = useNavigate();

    return (
        <h1
            className="text-2xl md:text-3xl font-bold text-white cursor-pointer mb-0"
            onClick={() => navigate("/")}
        >
            SoundConnect
        </h1>
    );
}
