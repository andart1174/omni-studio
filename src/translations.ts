export type Language = 'en' | 'fr';

export interface StudioTranslation {
    name: string;
    description: string;
    howToUse: string;
}

export const translations: Record<Language, any> = {
    en: {
        common: {
            new_task: "New Task",
            download: "Download",
            pro_badge: "Studio Pro",
            upload_msg: "Drop file for processing",
            secure_msg: "Secure Environment Active",
        },
        studios: {
            privacy: {
                name: "Privacy Studio",
                description: "Intelligent Face & Data Blurring",
                howToUse: "Upload a photo. The AI will automatically detect faces and sensitive data, applying a professional blur to protect privacy."
            },
            visual: {
                name: "Visual Studio",
                description: "Artistic Photo Transformations",
                howToUse: "Select an artistic style (Sketch, Anime, etc.), then upload your photo to see it transformed into a work of art."
            },
            ocr: {
                name: "OCR Studio",
                description: "Extract Text from Images",
                howToUse: "Drop an image containing text. The engine will read the characters and provide them in a clear, copyable text format."
            },
            document: {
                name: "Document Studio",
                description: "PDF & Word Generation",
                howToUse: "Choose your output format. Upload images to create a professional PDF, or upload text to generate a formatted Word document."
            },
            data: {
                name: "Data Master",
                description: "Excel & JSON Converter",
                howToUse: "Upload an Excel or CSV file to convert it to structured JSON, or paste JSON to generate a downloadable spreadsheet."
            },
            audio: {
                name: "Audio Studio",
                description: "Voice & Real-time Visualizer",
                howToUse: "Type text to hear it spoken by an AI voice, or upload an audio file to see a dynamic frequency visualization."
            },
            '3d': {
                name: "3D Studio",
                description: "Interactive Model Viewer",
                howToUse: "Upload a 3D model (.obj) to view it in an interactive environment. You can rotate and inspect the model in real-time."
            },
            security: {
                name: "Security 2.0",
                description: "PGP Encryption & Shredding",
                howToUse: "Set a vault password and upload your sensitive files to encrypt them with military-grade security."
            },
            code: {
                name: "Code Studio",
                description: "Language Transformer",
                howToUse: "Paste or upload code in one language (e.g., JavaScript) to automatically transform it into another (e.g., TypeScript/Python)."
            },
            architecture: {
                name: "Architecture Studio",
                description: "Code to Diagram Hub",
                howToUse: "Upload your source code to automatically generate UML diagrams and flowcharts representing your logic."
            },
            font: {
                name: "Font Studio",
                description: "SVG to WOFF2 Converter",
                howToUse: "Upload your vector icons (SVG) to package them into a high-performance web font (WOFF2)."
            },
            seo: {
                name: "SEO Studio",
                description: "Advanced Image Optimization",
                howToUse: "Upload high-resolution images to compress them for the web without losing visible quality, boosting your site's SEO."
            },
            game: {
                name: "Game Asset Studio",
                description: "Sprites & Atlas Generator",
                howToUse: "Upload multiple frames or sprites to generate a optimized texture atlas ready for game engines."
            },
            math: {
                name: "Math Studio",
                description: "LaTeX to SVG Renderer",
                howToUse: "Type or upload LaTeX formulas (like E=mc²) to perfectly render them as high-quality vector graphics (SVG)."
            },
            color: {
                name: "Color Master",
                description: "LCH & Accessibility Studio",
                howToUse: "Design accessible color palettes using the modern LCH color space. Check contrast ratios for WCAG compliance."
            },
            automation: {
                name: "Automation Studio",
                description: "Multi-step Node Workflows",
                howToUse: "Design complex logical workflows using a drag-and-drop node interface to automate repetitive tasks."
            },
            branding: {
                name: "Branding Studio",
                description: "Logo & Asset Generator",
                howToUse: "Create professional brand assets. Convert photos to minimalist logos, extract color palettes, and add watermarks to protect your work."
            },
            mockup: {
                name: "Mockup Studio",
                description: "Device & Product Previews",
                howToUse: "Visualize your brand on real objects. Upload your logo to see it instantly rendered on an iPhone, MacBook, or a high-end Billboard."
            },
            analytics: {
                name: "Analytics Studio",
                description: "Data Visualization Hub",
                howToUse: "Turn CSV or JSON files into beautiful charts. Upload your data to generate Bar, Line, or Pie charts using your brand colors."
            },
            cyber: {
                name: "Cyber Studio",
                description: "Security & ASCII Art",
                howToUse: "Advanced security tools. Generate SHA-256 hashes, create secure passwords, or transform any image into terminal-style ASCII art."
            },
            qr: {
                name: "QR Magic",
                description: "Branded QR Generator",
                howToUse: "Create professional QR codes. Customize colors and embed your logo to make your QR codes scanable and branded."
            },
            motion: {
                name: "Motion Studio",
                description: "Reactive Audiograms",
                howToUse: "Turn audio into video. Upload an MP3/WAV to generate a professional video with a reactive waveform, perfect for social media sharing."
            },
            pdf: {
                name: "PDF Master",
                description: "Clean Document Tools",
                howToUse: "Merge and convert documents. Batch upload images to combine them into a single high-quality PDF file instantly."
            }
        }
    },
    fr: {
        common: {
            new_task: "Nouvelle Tâche",
            download: "Télécharger",
            pro_badge: "Studio Pro",
            upload_msg: "Déposez le fichier pour traitement",
            secure_msg: "Environnement Sécurisé Actif",
        },
        studios: {
            privacy: {
                name: "Studio Confidentialité",
                description: "Floutage Intelligent des Visages",
                howToUse: "Téléchargez une photo. L'IA détectera automatiquement les visages et les données sensibles pour les flouter."
            },
            visual: {
                name: "Studio Visuel",
                description: "Transformations Artistiques",
                howToUse: "Sélectionnez un style artistique (Croquis, Anime, etc.), puis téléchargez votre photo pour la transformer en œuvre d'art."
            },
            ocr: {
                name: "Studio OCR",
                description: "Extraire le Texte des Images",
                howToUse: "Déposez une image contenant du texte. Le moteur lira les caractères et les fournira dans un format texte clair."
            },
            document: {
                name: "Studio Document",
                description: "Génération PDF & Word",
                howToUse: "Choisissez votre format. Téléchargez des images pour créer un PDF, ou du texte pour générer un document Word."
            },
            data: {
                name: "Maître des Données",
                description: "Convertisseur Excel & JSON",
                howToUse: "Téléchargez un fichier Excel ou CSV pour le convertir en JSON, ou collez du JSON pour générer un tableur."
            },
            audio: {
                name: "Studio Audio",
                description: "Voix & Visualiseur Temps Réel",
                howToUse: "Saisissez du texte pour l'entendre par une voix IA, ou téléchargez un fichier audio pour voir sa visualisation."
            },
            '3d': {
                name: "Studio 3D",
                description: "Visualiseur de Modèles Interactif",
                howToUse: "Téléchargez un modèle 3D (.obj) pour le visualiser. Vous pouvez faire pivoter le modèle en temps réel."
            },
            security: {
                name: "Sécurité 2.0",
                description: "Chiffrement PGP & Destruction",
                howToUse: "Définissez un mot de passe et téléchargez vos fichiers pour les chiffrer avec une sécurité de niveau militaire."
            },
            code: {
                name: "Studio Code",
                description: "Transformateur de Langage",
                howToUse: "Collez ou téléchargez du code pour le transformer automatiquement dans un autre langage de programmation."
            },
            architecture: {
                name: "Architecture Studio",
                description: "Diagrammes de Code",
                howToUse: "Téléchargez votre code source pour générer automatiquement des diagrammes UML et des flux logiques."
            },
            font: {
                name: "Studio de Police",
                description: "Convertisseur SVG vers WOFF2",
                howToUse: "Téléchargez vos icônes vectorielles (SVG) pour les transformer en une police web haute performance (WOFF2)."
            },
            seo: {
                name: "Studio SEO",
                description: "Optimisation Image Avancée",
                howToUse: "Téléchargez des images pour les compresser sans perte de qualité visible, améliorant ainsi le SEO de votre site."
            },
            game: {
                name: "Studio de Jeu",
                description: "Générateur de Sprites & Atlas",
                howToUse: "Téléchargez plusieurs frames pour générer un atlas de textures optimisé pour les moteurs de jeu."
            },
            math: {
                name: "Studio Math",
                description: "Rendu LaTeX vers SVG",
                howToUse: "Saisissez des formules LaTeX (ex: E=mc²) pour les convertir en graphiques vectoriels de haute qualité (SVG)."
            },
            color: {
                name: "Maître des Couleurs",
                description: "Studio LCH & Accessibilité",
                howToUse: "Créez des palettes de couleurs accessibles via l'espace LCH. Vérifiez la conformité aux normes WCAG."
            },
            automation: {
                name: "Studio Automation",
                description: "Workflows Logiques par Nœuds",
                howToUse: "Concevez des workflows complexes avec une interface glisser-déposer pour automatiser vos tâches répétitives."
            },
            branding: {
                name: "Studio Branding",
                description: "Logo & Identité Visuelle",
                howToUse: "Créez vos actifs de marque. Transformez des photos en logos, extrayez des palettes de couleurs et protégez vos créations."
            },
            mockup: {
                name: "Studio Mockup",
                description: "Aperçus de Produits & Appareils",
                howToUse: "Visualisez votre marque pe des objets réels. Téléchargez votre logo pentru a-l vedea redat pe un iPhone, MacBook sau panou publicitar."
            },
            analytics: {
                name: "Studio Analytics",
                description: "Hub de Visualisation de Données",
                howToUse: "Transformez vos fichiers CSV sau JSON în grafice superbe. Încărcați datele pentru a genera grafice Bar, Line sau Pie."
            },
            cyber: {
                name: "Studio Cyber",
                description: "Sécurité & Art ASCII",
                howToUse: "Outils de sécurité avancés. Générez des hachages SHA-256, créez des mots de passe sécurisés sau transformez des imagini în artă ASCII."
            },
            qr: {
                name: "QR Magic",
                description: "Générateur de QR Branded",
                howToUse: "Créez des coduri QR profesioniste. Personalizați culorile și integrați logo-ul pentru un branding complet."
            },
            motion: {
                name: "Studio Motion",
                description: "Audiogrammes Réactifs",
                howToUse: "Transformez l'audio en vidéo. Téléchargez un MP3 pentru a genera un videoclip profesional cu o formă de undă reactivă."
            },
            pdf: {
                name: "Maître PDF",
                description: "Outils de Documents Pro",
                howToUse: "Fusionnez et convertissez des documents. Combinați mai multe imagini într-un singur fișier PDF de înaltă calitate."
            }
        }
    }
};
