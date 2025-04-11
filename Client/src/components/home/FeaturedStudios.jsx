import { Link } from "react-router-dom";

const FeaturedStudios = ({
    studios,
    isLoading,
    isError,
    ErrorComponent,
    LoadingComponent,
}) => {
    console.log(studios);

    // const [averageRating, setAverageRating] = useState(0);
    // const [reviewsCount, setReviewsCount] = useState(0);

    // useEffect(() => {
    //     const averageRating =
    //         studios.reduce((acc, studio) => acc + studio.rating, 0) /
    //         studios.length;
    //     const reviewsCount = studios.reduce(
    //         (acc, studio) => acc + studio.reviews.length,
    //         0
    //     );
    //     setAverageRating(averageRating);
    //     setReviewsCount(reviewsCount);
    // }, [studios]);

    // console.log(averageRating, reviewsCount);
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-8">
            <h2 className="font-normal font-montserrat text-2xl tracking-wide text-gray-800 mb-6 text-center">
                Studios Mis en Avant
            </h2>

            {isLoading && (
                <div className="py-4 text-center">{LoadingComponent}</div>
            )}

            {isError && (
                <div className="py-4 text-center">{ErrorComponent}</div>
            )}

            {studios && !isLoading && !isError && (
                <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10">
                        <span className="sr-only">Précédent</span>
                        &lt;
                    </button>

                    <div className="overflow-x-auto py-2">
                        <div className="flex gap-4 w-max md:w-full md:grid md:grid-cols-2 lg:grid-cols-3">
                            {studios.map((studio) => (
                                <Link
                                    key={studio._id}
                                    to={`/studio/${studio._id}`}
                                    className="bg-white rounded-lg shadow-md p-4 min-w-[280px] max-w-full flex flex-col"
                                >
                                    <img
                                        src={studio.image}
                                        alt={studio.name}
                                        className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                        {studio.name || "Studio Pro Paris"}
                                    </h3>
                                    <div className="text-sm text-gray-500 mb-1">
                                        {studio.city} - {studio.address}
                                    </div>
                                    <div className="text-lg font-bold text-primary-600 mb-2">
                                        {studio.hourly_rate}€/h
                                    </div>
                                    <div className="flex items-center mb-3">
                                        <span className="bg-primary-500 text-white font-bold rounded px-2 py-1 text-sm mr-2">
                                            {studio.rating || 4.9}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({studio.reviews?.length || 156}{" "}
                                            avis)
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 flex-1">
                                        {studio.description ||
                                            "Studio d'enregistrement professionnel avec équipement haut de gamme et acoustique exceptionnelle."}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                                            Pro
                                        </span>
                                        <span className="bg-success-light text-success-dark px-2 py-1 rounded-full text-xs">
                                            Tendance
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-10">
                        <span className="sr-only">Suivant</span>
                        &gt;
                    </button>
                </div>
            )}
        </section>
    );
};

export default FeaturedStudios;
