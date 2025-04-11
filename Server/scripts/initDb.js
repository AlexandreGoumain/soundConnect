const connectDB = require("../config/db");
const dotenv = require("dotenv");
const User = require("../models/User");
const Role = require("../models/Role");
const EquipmentCategory = require("../models/EquipmentCategory");
const Equipment = require("../models/Equipment");
const Studio = require("../models/Studio");
const StudioEquipment = require("../models/StudioEquipment");
const Reservation = require("../models/Reservation");
const Image = require("../models/Image");
const UserReview = require("../models/UserReview");
const StudioReview = require("../models/StudioReview");
const bcrypt = require("bcryptjs");

dotenv.config();

connectDB();

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const seedDatabase = async () => {
    try {
        await Role.deleteMany({});
        await User.deleteMany({});
        await EquipmentCategory.deleteMany({});
        await Equipment.deleteMany({});
        await Studio.deleteMany({});
        await StudioEquipment.deleteMany({});
        await Reservation.deleteMany({});
        await Image.deleteMany({});
        await UserReview.deleteMany({});
        await StudioReview.deleteMany({});

        console.log("Base de données nettoyée");

        const roles = await Role.insertMany([
            {
                name: "Admin",
                description: "Administrateur avec tous les droits",
            },
            {
                name: "Artiste",
                description:
                    "Utilisateur standard pouvant réserver des sessions studios",
            },
            {
                name: "Studio",
                description:
                    "Propriétaire de studio avec droits de gestion des sessions",
            },
        ]);

        console.log("Rôles créés");

        const hashedPassword = await hashPassword("password123");
        const users = await User.insertMany([
            {
                username: "admin",
                email: "admin@soundconnect.com",
                password: hashedPassword,
                firstName: "Admin",
                lastName: "Système",
                roles: [roles[0]._id],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: "Artiste1",
                email: "Artiste1@example.com",
                password: hashedPassword,
                firstName: "Jean",
                lastName: "Dupont",
                roles: [roles[1]._id],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: "Studio1",
                email: "Studio1@example.com",
                password: hashedPassword,
                firstName: "Marie",
                lastName: "Martin",
                roles: [roles[2]._id],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: "Multi_role",
                email: "Multi_role@example.com",
                password: hashedPassword,
                firstName: "Paul",
                lastName: "Bernard",
                roles: [roles[1]._id, roles[2]._id],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: "Multi_role2",
                email: "Multi_role2@example.com",
                password: hashedPassword,
                firstName: "Sophie",
                lastName: "Dubois",
                roles: [roles[0]._id, roles[1]._id],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                username: "test_user",
                email: "login@letes.net",
                password: await hashPassword("Coucou123@"),
                firstName: "Test",
                lastName: "Utilisateur",
                roles: [roles[1]._id, roles[2]._id],
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log("Utilisateurs créés");

        const categories = await EquipmentCategory.insertMany([
            {
                name: "Microphones",
                description: "Microphones pour enregistrement",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Interfaces Audio",
                description: "Interfaces audio pour enregistrement",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Instruments",
                description: "Instruments de musique",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Moniteurs",
                description: "Moniteurs de studio",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Processeurs",
                description: "Processeurs de signal audio",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Consoles",
                description: "Consoles de mixage",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Casques",
                description: "Casques de monitoring",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Câbles",
                description: "Câbles et connectiques",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Logiciels",
                description: "Logiciels audio",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Traitement Acoustique",
                description: "Équipements de traitement acoustique",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Synthétiseurs",
                description: "Synthétiseurs et contrôleurs MIDI",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log("Catégories d'équipements créées");

        const equipments = await Equipment.insertMany([
            {
                name: "Neumann U87",
                category_id: categories[0]._id,
                description: "Microphone à condensateur professionnel",
                brand: "Neumann",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Universal Audio Apollo",
                category_id: categories[1]._id,
                description: "Interface audio haut de gamme",
                brand: "Universal Audio",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Piano à queue Yamaha C7",
                category_id: categories[2]._id,
                description: "Piano à queue pour enregistrement professionnel",
                brand: "Yamaha",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Genelec 8040",
                category_id: categories[3]._id,
                description: "Moniteurs de studio actifs haute fidélité",
                brand: "Genelec",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Universal Audio 1176LN",
                category_id: categories[4]._id,
                description: "Compresseur/limiteur analogique légendaire",
                brand: "Universal Audio",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "SSL AWS 948",
                category_id: categories[5]._id,
                description:
                    "Console de mixage analogique hybride haut de gamme",
                brand: "Solid State Logic",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Beyerdynamic DT 770 Pro",
                category_id: categories[6]._id,
                description: "Casque de studio fermé pour monitoring précis",
                brand: "Beyerdynamic",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Mogami Gold Studio",
                category_id: categories[7]._id,
                description: "Câbles audio professionnels de haute qualité",
                brand: "Mogami",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Pro Tools Ultimate",
                category_id: categories[8]._id,
                description:
                    "Station de travail audio numérique professionnelle",
                brand: "Avid",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "GIK Acoustics Panneaux",
                category_id: categories[9]._id,
                description:
                    "Panneaux acoustiques pour traitement sonore du studio",
                brand: "GIK Acoustics",
                isVerified: true,
                created_by: users[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Shure SM58",
                category_id: categories[0]._id,
                description: "Microphone dynamique polyvalent pour voix",
                brand: "Shure",
                isVerified: true,
                created_by: users[2]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Focusrite Scarlett 2i2",
                category_id: categories[1]._id,
                description: "Interface audio USB compacte et abordable",
                brand: "Focusrite",
                isVerified: true,
                created_by: users[2]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: "Moog Grandmother",
                category_id: categories[10]._id,
                description: "Synthétiseur analogique semi-modulaire",
                brand: "Moog",
                isVerified: false,
                created_by: users[2]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log("Équipements créés");

        const studios = await Studio.insertMany([
            {
                name: "Studio Harmony",
                description:
                    "Un studio professionnel équipé pour tous vos besoins musicaux",
                address: "123 Rue de la Musique",
                city: "Paris",
                hourly_rate: 50,
                phone: "0123456789",
                email: "contact@studioharmony.com",
                website: "www.studioharmony.com",
                owner_id: users[2]._id,
                tags: ["professionnel", "acoustique", "mixage", "mastering"],
                reviews: [],
                operating_hours: {
                    monday: {
                        is_open: true,
                        open: { hour: 9, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                    tuesday: {
                        is_open: true,
                        open: { hour: 9, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                    wednesday: {
                        is_open: false,
                        open: { hour: 9, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                    thursday: {
                        is_open: true,
                        open: { hour: 9, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                    friday: {
                        is_open: false,
                        open: { hour: 9, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                    saturday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 16, minute: 0 },
                    },
                    sunday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 16, minute: 0 },
                    },
                },
            },
            {
                name: "Sound Factory",
                description:
                    "Studio d'enregistrement haut de gamme avec équipement professionnel",
                address: "456 Avenue du Son",
                city: "Lyon",
                hourly_rate: 75,
                phone: "0234567890",
                email: "info@soundfactory.com",
                website: "www.soundfactory.com",
                owner_id: users[3]._id,
                tags: [
                    "haut de gamme",
                    "enregistrement",
                    "production",
                    "mixage",
                ],
                reviews: [],
                operating_hours: {
                    monday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                    tuesday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                    wednesday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                    thursday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                    friday: {
                        is_open: true,
                        open: { hour: 10, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                    saturday: {
                        is_open: true,
                        open: { hour: 11, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                    sunday: {
                        is_open: true,
                        open: { hour: 11, minute: 0 },
                        close: { hour: 18, minute: 0 },
                    },
                },
            },
            {
                name: "Beat Lab",
                description:
                    "Studio spécialisé dans la production de musique électronique",
                address: "789 Boulevard des Beats",
                city: "Marseille",
                hourly_rate: 60,
                phone: "0345678901",
                email: "contact@beatlab.com",
                website: "www.beatlab.com",
                owner_id: users[3]._id,
                tags: ["électronique", "beat making", "production", "DJ"],
                reviews: [],
                operating_hours: {
                    monday: {
                        is_open: true,
                        open: { hour: 12, minute: 0 },
                        close: { hour: 22, minute: 0 },
                    },
                    tuesday: {
                        is_open: true,
                        open: { hour: 12, minute: 0 },
                        close: { hour: 22, minute: 0 },
                    },
                    wednesday: {
                        is_open: true,
                        open: { hour: 12, minute: 0 },
                        close: { hour: 22, minute: 0 },
                    },
                    thursday: {
                        is_open: true,
                        open: { hour: 12, minute: 0 },
                        close: { hour: 22, minute: 0 },
                    },
                    friday: {
                        is_open: true,
                        open: { hour: 12, minute: 30 },
                        close: { hour: 22, minute: 0 },
                    },
                    saturday: {
                        is_open: true,
                        open: { hour: 14, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                    sunday: {
                        is_open: true,
                        open: { hour: 14, minute: 0 },
                        close: { hour: 20, minute: 0 },
                    },
                },
            },
        ]);

        console.log("Studios créés");

        await StudioEquipment.insertMany([
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[0]._id,
                quantity: 2,
            },
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[1]._id,
                quantity: 1,
            },
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[2]._id,
                quantity: 1,
            },
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[3]._id,
                quantity: 2,
            },
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[4]._id,
                quantity: 1,
            },
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[5]._id,
                quantity: 1,
            },
            {
                studio_id: studios[0]._id,
                equipment_id: equipments[6]._id,
                quantity: 4,
            },
            {
                studio_id: studios[1]._id,
                equipment_id: equipments[10]._id,
                quantity: 5,
            },
            {
                studio_id: studios[1]._id,
                equipment_id: equipments[11]._id,
                quantity: 2,
            },
            {
                studio_id: studios[1]._id,
                equipment_id: equipments[6]._id,
                quantity: 3,
            },
            {
                studio_id: studios[1]._id,
                equipment_id: equipments[12]._id,
                quantity: 1,
            },
        ]);

        console.log("Équipements ajoutés aux studios");

        const oneDay = 24 * 60 * 60 * 1000;
        const now = new Date();

        await Reservation.insertMany([
            {
                studio_id: studios[0]._id,
                user_id: users[1]._id,
                start_datetime: new Date(now.getTime() - 7 * oneDay),
                end_datetime: new Date(
                    now.getTime() - 7 * oneDay + 5 * 60 * 60 * 1000
                ),
                total_price: 250,
                status: "completed",
                special_requests: "Besoin d'un microphone pour voix",
            },
            {
                studio_id: studios[0]._id,
                user_id: users[1]._id,
                start_datetime: new Date(now.getTime() + 3 * oneDay),
                end_datetime: new Date(
                    now.getTime() + 3 * oneDay + 4 * 60 * 60 * 1000
                ),
                total_price: 200,
                status: "confirmed",
                special_requests:
                    "Session de batterie, besoin de plusieurs micros",
            },

            {
                studio_id: studios[1]._id,
                user_id: users[1]._id,
                start_datetime: new Date(now.getTime() + 10 * oneDay),
                end_datetime: new Date(
                    now.getTime() + 10 * oneDay + 3 * 60 * 60 * 1000
                ),
                total_price: 120,
                status: "pending",
                special_requests: "Enregistrement de guitare électrique",
            },
        ]);

        console.log("Réservations créées");

        await Studio.findByIdAndUpdate(studios[0]._id, {
            $push: {
                reviews: [
                    {
                        reviewer_id: users[1]._id,
                        rating: 4,
                        comment:
                            "Excellent studio, bon équipement et personnel accueillant",
                        created_at: new Date(),
                    },
                    {
                        reviewer_id: users[3]._id,
                        rating: 5,
                        comment:
                            "Parfait pour l'enregistrement vocal, excellente acoustique",
                        created_at: new Date(),
                    },
                ],
            },
        });

        await Studio.findByIdAndUpdate(studios[1]._id, {
            $push: {
                reviews: {
                    reviewer_id: users[1]._id,
                    rating: 3,
                    comment:
                        "Bon studio mais un peu cher pour ce qui est proposé",
                    created_at: new Date(),
                },
            },
        });

        await User.findByIdAndUpdate(users[1]._id, {
            $push: {
                reviews: {
                    reviewer_id: studios[0]._id,
                    rating: 5,
                    comment: "Excellent artiste, ponctuel et professionnel",
                    created_at: new Date(),
                },
            },
        });

        console.log("Avis intégrés aux documents");

        await Image.insertMany([
            {
                filename: "studio_melodie_main.jpg",
                alt_text: "Vue principale du Studio Mélodie",
                studio_id: studios[0]._id,
            },
            {
                filename: "studio_melodie_control.jpg",
                alt_text: "Salle de contrôle du Studio Mélodie",
                studio_id: studios[0]._id,
            },
            {
                filename: "rock_studio_main.jpg",
                alt_text: "Salle principale du Rock & Roll Studio",
                studio_id: studios[1]._id,
            },
        ]);

        console.log("Images créées");

        // Création des reviews utilisateurs sur les studios
        await UserReview.insertMany([
            {
                rating: 4,
                comment:
                    "Excellent studio, bon équipement et personnel accueillant",
                reviewer_id: users[1]._id,
                studio_id: studios[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                rating: 5,
                comment:
                    "Parfait pour l'enregistrement vocal, excellente acoustique",
                reviewer_id: users[3]._id,
                studio_id: studios[0]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                rating: 3,
                comment: "Bon studio mais un peu cher pour ce qui est proposé",
                reviewer_id: users[1]._id,
                studio_id: studios[1]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        // Création des reviews studios sur les utilisateurs
        await StudioReview.insertMany([
            {
                rating: 5,
                comment: "Excellent artiste, ponctuel et professionnel",
                reviewer_id: studios[0]._id,
                user_id: users[1]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                rating: 4,
                comment: "Très bon musicien, respectueux du matériel",
                reviewer_id: studios[1]._id,
                user_id: users[1]._id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log("Reviews créées");

        console.log("Base de données initialisée avec succès!");
        process.exit(0);
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        process.exit(1);
    }
};

seedDatabase();
