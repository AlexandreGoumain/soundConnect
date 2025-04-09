import "./StudioCard.scss";

export default function StudioCard() {
    const studios = [
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 1,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
                {
                    rating: 3,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
        {
            _id: {
                $oid: "67f62a28fe58d7d007416c75",
            },
            name: "Studio Harmony",
            description:
                "Un studio professionnel équipé pour tous vos besoins musicaux",
            address: "123 Rue de la Musique, Paris",
            hourly_rate: 50,
            phone: "0123456789",
            email: "contact@studioharmony.com",
            website: "www.studioharmony.com",
            owner_id: {
                $oid: "67f62a27fe58d7d007416c57",
            },
            operating_hours: {
                monday: {
                    open: "09:00",
                    close: "18:00",
                },
                tuesday: {
                    open: "09:00",
                    close: "18:00",
                },
                wednesday: {
                    open: "09:00",
                    close: "18:00",
                },
                thursday: {
                    open: "09:00",
                    close: "18:00",
                },
                friday: {
                    open: "09:00",
                    close: "18:00",
                },
                saturday: {
                    open: "10:00",
                    close: "16:00",
                },
                sunday: {
                    open: "10:00",
                    close: "16:00",
                },
            },
            reviews: [
                {
                    rating: 4,
                    comment:
                        "Excellent studio, bon équipement et personnel accueillant",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c56",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c89",
                    },
                },
                {
                    rating: 5,
                    comment:
                        "Parfait pour l'enregistrement vocal, excellente acoustique",
                    created_at: {
                        $date: "2025-04-09T08:04:56.122Z",
                    },
                    reviewer_id: {
                        $oid: "67f62a27fe58d7d007416c58",
                    },
                    _id: {
                        $oid: "67f62a28fe58d7d007416c8a",
                    },
                },
            ],
            created_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            updated_at: {
                $date: "2025-04-09T08:04:56.044Z",
            },
            __v: 0,
        },
    ];

    console.log(studios);

    const ReviewAverage = (reviews) => {
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    return (
        <>
            {studios.map((studio) => (
                <article key={studio._id} className="studio-card">
                    <img src={studio.image} alt={studio.name} />
                    <h3>{studio.name}</h3>
                    <p>Adresse: {studio.address}</p>

                    <div>
                        <p>{studio.hourly_rate}€/h</p>
                        <p>
                            {ReviewAverage(studio.reviews)} (
                            {studio.reviews.length} avis)
                        </p>
                    </div>

                    <p>{studio.description}</p>
                </article>
            ))}
        </>
    );
}
