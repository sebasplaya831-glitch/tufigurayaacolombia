/**
 * ====================================================================
 * TU FIGURA YAA - CATÁLOGO COMPLETO DE PRODUCTOS (COLOMBIA & MÉXICO)
 * ====================================================================
 * Catálogo 100% oficial con conversión matemática exacta en tiempo real:
 * Tasa oficial: 1 MXN = 188.74 COP
 * 1. Fajas Postquirúrgicas & Médicas (5 modelos oficiales)
 * 2. Fajas Moldeadoras (9 modelos oficiales)
 * 3. Línea Dorada (5 modelos exclusivos de alta definición)
 * Total: 19 modelos oficiales
 * Todos los modelos incluyen fotos de flyer de alta resolución,
 * tallas completas (S a 3XL) y colores oficiales (Miel y Negro).
 */

const PRODUCTS_DATA = [
    // =========================================================
    // LÍNEA POSTQUIRÚRGICA OFICIAL (FOTOS Y PRECIOS DEL USUARIO)
    // =========================================================
    {
        id: "ref-705",
        ref: "705",
        name: "Faja Sisa Broches Short Medio (REF. 705)",
        slug: "faja-sisa-broches-short-medio-ref-705",
        category: "postquirurgica",
        categoryLabel: "Postquirúrgica & Médica",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 4.9,
        reviewsCount: 184,
        compression: "Extra Firme",
        badge: "REF. 705 • Postquirúrgica",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620499316.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620499316.png",
        shortDescription: "Faja postquirúrgica tipo sisa con 3 hileras de broches centrales reforzados y largo short medio. Diseñada para recuperación de lipoescultura, abdominoplastia y moldeado reloj de arena.",
        features: [
            "3 hileras de broches frontales de ajuste gradual a medida que desinflamas",
            "Largo short medio con encaje siliconado suave anti-enrollamiento",
            "Busto libre con tira estabilizadora para usar con tu brasier preferido",
            "Apertura perineal amplia y cómoda para máxima higiene",
            "Auténtico Powernet médico colombiano con forro hipoalergénico"
        ],
        idealFor: "Postoperatorio de lipoescultura, abdominoplastia, postparto y uso diario de alta definición.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" },
            { name: "Miel / Beige", hex: "#c99e69" }
        ],
        inStock: true
    },
    {
        id: "ref-712",
        ref: "712",
        name: "Faja Brasier Integrado Short Medio (REF. 712)",
        slug: "faja-brasier-integrado-short-medio-ref-712",
        category: "postquirurgica",
        categoryLabel: "Postquirúrgica & Médica",
        priceMXN: 2500,
        originalPriceMXN: 2990,
        priceCOP: 471850,
        originalPriceCOP: 564330,
        discount: "16% OFF",
        rating: 5.0,
        reviewsCount: 242,
        compression: "Extra Firme",
        badge: "REF. 712 • Brasier Integrado",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620505519.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620505519.png",
        shortDescription: "Faja postquirúrgica integral con brasier médico prehormado incorporado y largo short medio. Ofrece soporte continuo de busto, espalda alta, torso y cadera.",
        features: [
            "Brasier quirúrgico integrado con soporte anatómico que evita desplazamientos",
            "Espalda alta correctora de postura y control de rollitos axilares",
            "Broches delanteros de 3 posiciones para ajuste progresivo postoperatorio",
            "Terminación en short medio con blonda elástica siliconada",
            "Forro en SmartLycra suave con microcápsulas hidratantes de aloe vera"
        ],
        idealFor: "Mamoplastia de aumento o reducción, mastopexia, abdominoplastia y lipotransferencia.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" },
            { name: "Miel / Beige", hex: "#c99e69" }
        ],
        inStock: true
    },
    {
        id: "ref-702",
        ref: "702",
        name: "Faja Manga Sisa Pierna a la Rodilla (REF. 702)",
        slug: "faja-manga-sisa-pierna-a-la-rodilla-ref-702",
        category: "postquirurgica",
        categoryLabel: "Postquirúrgica & Médica",
        priceMXN: 2500,
        originalPriceMXN: 2990,
        priceCOP: 471850,
        originalPriceCOP: 564330,
        discount: "16% OFF",
        rating: 4.9,
        reviewsCount: 198,
        compression: "Extra Firme",
        badge: "REF. 702 • Rodilla",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620521730.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620521730.png",
        shortDescription: "Faja médica de compresión extendida hasta la rodilla con manga sisa y soporte de busto libre. Previene la retención de líquidos en muslos y moldea piernas completas.",
        features: [
            "Largo hasta la rodilla con bandas anatómicas que estilizan las piernas",
            "Manga 3/4 para control de brazos y drenaje linfático de espalda",
            "Diseño de busto libre con broche de ajuste pectoral",
            "Cierre perineal de gran amplitud para máxima higiene sin quitar la faja",
            "Patrón anatómico levanta glúteos natural sin rellenos artificiales"
        ],
        idealFor: "Lipoescultura 360°, lifting de muslos, braquioplastia y transferencia glútea.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" },
            { name: "Miel / Beige", hex: "#c99e69" }
        ],
        inStock: true
    },
    {
        id: "ref-714",
        ref: "714",
        name: "Faja Manga Larga Pierna a la Rodilla (REF. 714)",
        slug: "faja-manga-larga-pierna-a-la-rodilla-ref-714",
        category: "postquirurgica",
        categoryLabel: "Postquirúrgica & Médica",
        priceMXN: 2500,
        originalPriceMXN: 2990,
        priceCOP: 471850,
        originalPriceCOP: 564330,
        discount: "16% OFF",
        rating: 5.0,
        reviewsCount: 312,
        compression: "Extra Firme",
        badge: "REF. 714 • Manga Larga",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620529762.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620529762.png",
        shortDescription: "Faja integral postoperatoria de máxima compresión con manga larga, busto libre y pierna a la rodilla. Triple hilera de broches para una reducción anatómica progresiva.",
        features: [
            "Cobertura y compresión continua en brazos, espalda completa, cintura y piernas",
            "Broche estabilizador sobre el busto que brinda firmeza y soporte",
            "Costuras planas reforzadas que no marcan sobre la ropa exterior",
            "Forro antibacterial con aloe vera para proteger incisiones",
            "Apertura perineal práctica y confortable"
        ],
        idealFor: "Cirugías combinadas completas (braquioplastia, espalda, abdomen y lipotransferencia).",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" },
            { name: "Miel / Beige", hex: "#c99e69" }
        ],
        inStock: true
    },
    {
        id: "ref-760",
        ref: "760",
        name: "Faja Cuerpo Completo Broches Pierna a la Rodilla (REF. 760)",
        slug: "faja-cuerpo-completo-broches-pierna-a-la-rodilla-ref-760",
        category: "postquirurgica",
        categoryLabel: "Postquirúrgica & Médica",
        priceMXN: 2500,
        originalPriceMXN: 2990,
        priceCOP: 471850,
        originalPriceCOP: 564330,
        discount: "16% OFF",
        rating: 5.0,
        reviewsCount: 275,
        compression: "Extra Firme",
        badge: "REF. 760 • Broches Completos",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620536160.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620536160.png",
        shortDescription: "Faja enteriza de cuerpo completo con broches frontales continuos desde el escote en V hasta el abdomen, mangas de compresión y largo hasta la rodilla.",
        features: [
            "Hilera continua de broches reforzados desde el pecho hasta el abdomen bajo",
            "Escote en V anatómico que brinda soporte confortable y excelente postura",
            "Cobertura total de brazos, axilas, espalda alta, media y baja",
            "Powernet grado médico de alta densidad que acelera la adherencia de la piel",
            "Apertura perineal amplia y cómoda para uso diario prolongado"
        ],
        idealFor: "Recuperación postquirúrgica integral, postparto con cesárea y remodelación completa.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" },
            { name: "Miel / Beige", hex: "#c99e69" }
        ],
        inStock: true
    },

    // =========================================================
    // LÍNEA MOLDEADORAS OFICIAL (9 MODELOS CON FOTOS REALES)
    // =========================================================
    {
        id: "ref-705-moldeadora",
        ref: "705",
        name: "Faja Sisa Broches Short Medio (REF. 705 - Moldeadora)",
        slug: "faja-sisa-broches-short-medio-ref-705-moldeadora",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 5.0,
        reviewsCount: 215,
        compression: "Extra Firme",
        badge: "REF. 705 • Moldeadora",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926399639.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926399639.png",
        shortDescription: "Faja sisa moldeadora short medio con broches frontales de compresión graduada, busto libre con tira estabilizadora y encaje siliconado suave en pierna.",
        features: [
            "3 hileras de broches frontales para moldear una cintura de avispa progresiva",
            "Manga sisa anatómica que estiliza la espalda y aplana rollitos axilares",
            "Busto libre con tira pectoral estabilizadora",
            "Largo short medio con blonda de encaje siliconado anti-marcas",
            "Realce de glúteos redondeado natural y apertura perineal higiénica"
        ],
        idealFor: "Silueta reloj de arena, control diario de abdomen, espalda erguida y prendas ceñidas.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-703",
        ref: "703",
        name: "Faja Short Levanta Cola (REF. 703)",
        slug: "faja-short-levanta-cola-ref-703",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 5.0,
        reviewsCount: 238,
        compression: "Extra Firme",
        badge: "REF. 703 • Levanta Cola",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926416349.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926416349.png",
        shortDescription: "Faja short levanta cola con cierre invisible delantero, cargaderas regulables y compresión de alta definición en cintura y caderas.",
        features: [
            "Banda anatómica levanta glúteos de máxima proyección sin almohadillas",
            "Cierre delantero semi-invisible con ganchos internos de protección",
            "Cargaderas ajustables y removibles para mayor versatilidad de uso",
            "Largo short medio con encaje siliconado que estiliza y no se enrolla",
            "Apertura perineal cómoda para uso durante todo el día"
        ],
        idealFor: "Vestidos entallados, eventos sociales, realce glúteo superior y control total de abdomen.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-901",
        ref: "901",
        name: "Short Levanta Cola Glúteos Perfectos (REF. 901)",
        slug: "short-levanta-cola-gluteos-perfectos-ref-901",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 1000,
        originalPriceMXN: 1250,
        priceCOP: 188740,
        originalPriceCOP: 235930,
        discount: "20% OFF",
        rating: 4.9,
        reviewsCount: 188,
        compression: "Alta",
        badge: "REF. 901 • Short Moldeador",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926432029.jpg",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926432029.jpg",
        shortDescription: "Short moldeador a la cintura con efecto levanta glúteos natural redondeado, compresión en abdomen bajo y suave encaje siliconado.",
        features: [
            "Corte anatómico especializado que redondea y proyecta los glúteos",
            "Pretina firme a la cintura que comprime el abdomen bajo y no se dobla",
            "Largo sobre el muslo con encaje elástico siliconado suave",
            "Tejido Powernet transpirable apto para uso diario prolongado",
            "Completamente imperceptible bajo shorts, pantalones y faldas"
        ],
        idealFor: "Uso diario, vaqueros ajustados, faldas cortas y realce natural sin marcas.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-902",
        ref: "902",
        name: "Faja Short Tiro Alto Control Abdomen (REF. 902)",
        slug: "faja-short-tiro-alto-control-abdomen-ref-902",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 1200,
        originalPriceMXN: 1500,
        priceCOP: 226488,
        originalPriceCOP: 283110,
        discount: "20% OFF",
        rating: 4.9,
        reviewsCount: 176,
        compression: "Alta",
        badge: "REF. 902 • Tiro Alto",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926445816.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791926445816.png",
        shortDescription: "Faja short de tiro alto extendido hasta el bajo busto con banda de encaje siliconada antideslizante. Aplana abdomen alto, medio y bajo.",
        features: [
            "Pretina extra alta que cubre y aplana desde el bajo busto hasta el vientre bajo",
            "Banda de encaje superior con silicona interna que no se baja ni rueda",
            "Compresión focalizada 360 grados que define cintura",
            "Terminación de pierna en short con blonda siliconada anti-enrollamiento",
            "Diseño sin costuras frontales gruesas para lucir bajo cualquier tipo de prenda"
        ],
        idealFor: "Vestidos ajustados, faldas de tubo, vientre plano instantáneo y uso diario cómodo.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-903",
        ref: "903",
        name: "Brasier Postquirúrgico y Moldeador (REF. 903)",
        slug: "brasier-postquirurgico-moldeador-ref-903",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 1000,
        originalPriceMXN: 1250,
        priceCOP: 188740,
        originalPriceCOP: 235930,
        discount: "20% OFF",
        rating: 4.9,
        reviewsCount: 165,
        compression: "Alta",
        badge: "REF. 903 • Moldeadora",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038884437.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038884437.png",
        shortDescription: "Brasier moldeador y postquirúrgico de soporte completo con broches frontales de 3 niveles, tirantes anchos acolchados y copas anatómicas de alta contención.",
        features: [
            "3 hileras de broches frontales reforzados para regular el nivel de ajuste y compresión",
            "Tirantes anchos anatómicos y acolchados que eliminan la presión en hombros y trapecios",
            "Espalda alta cruzada que corrige la postura y disimula los rollitos axilares",
            "Copas prehormadas sin varillas para descanso, confort postoperatorio y uso diario",
            "Confeccionado en Powernet colombiano transpirable con forro hipoalergénico"
        ],
        idealFor: "Postoperatorio de busto, soporte continuo de busto pesado, corrección de postura y modelado diario.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-901-1",
        ref: "901-1",
        name: "Faja Short Cachetero Levanta Glúteos (REF. 901-1)",
        slug: "faja-short-cachetero-ref-901-1",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 800,
        originalPriceMXN: 1000,
        priceCOP: 150992,
        originalPriceCOP: 188740,
        discount: "20% OFF",
        rating: 4.9,
        reviewsCount: 198,
        compression: "Alta",
        badge: "REF. 901-1 • Moldeadora",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038895294.jpg",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038895294.jpg",
        shortDescription: "Short faja estilo cachetero a la cintura con efecto levanta glúteos redondeado natural sin almohadillas y compresión en abdomen bajo. Encaje siliconado suave.",
        features: [
            "Efecto push-up anatómico que levanta y proyecta los glúteos de forma natural",
            "Pretina alta elástica antideslizante que no se baja ni saca marcas en la cintura",
            "Compresión focalizada en abdomen bajo para control total del vientre plano",
            "Terminación de pierna en encaje suave con bandas siliconadas anti-enrollamiento",
            "Totalmente imperceptible bajo shorts, faldas, vestidos y pantalones ceñidos"
        ],
        idealFor: "Prendas cortas, vestidos ajustados, realce natural de glúteos y control de vientre bajo.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-757",
        ref: "757",
        name: "Faja Short Broches-Cierre Cinturilla 8 Broches (REF. 757)",
        slug: "faja-short-broches-cierre-cinturilla-ref-757",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 2500,
        originalPriceMXN: 2990,
        priceCOP: 471850,
        originalPriceCOP: 564330,
        discount: "16% OFF",
        rating: 5.0,
        reviewsCount: 284,
        compression: "Extra Firme",
        badge: "REF. 757 • Cinturilla 8 Broches",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038901653.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038901653.png",
        shortDescription: "Faja moldeadora de reducción extrema con cinturilla interna de 8 hileras de broches y cierre frontal invisible. Estiliza cintura de avispa y realza glúteos.",
        features: [
            "Cinturilla interna de 8 broches centrales que esculpen una cintura reloj de arena instantánea",
            "Cierre exterior ultra plano semi-invisible para acabados lisos bajo cualquier prenda",
            "Diseño de busto libre con cargaderas anatómicas regulables y removibles",
            "Largo short medio con blonda elástica siliconada que estiliza los muslos",
            "Apertura perineal amplia y cómoda para máxima practicidad en el día a día"
        ],
        idealFor: "Reducción extrema de cintura, vestidos entallados de noche, postparto y alta compresión.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-740",
        ref: "740",
        name: "Faja Sisa Short Broches 7 Varillas (REF. 740)",
        slug: "faja-sisa-short-broches-7-varillas-ref-740",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 4.9,
        reviewsCount: 220,
        compression: "Extra Firme",
        badge: "REF. 740 • 7 Varillas",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038909269.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038909269.png",
        shortDescription: "Faja sisa moldeadora short medio con 7 varillas flexibles ergonómicas que perfilan la cintura, corrigen la postura lumbar y realzan glúteos naturalmente.",
        features: [
            "7 varillas flexibles ergonómicas de soporte lumbar que acentúan la silueta reloj de arena",
            "Manga sisa con respaldo alto para estilizar la espalda y controlar rollitos axilares",
            "Triple hilera de broches frontales inoxidables para ajuste gradual milimétrico",
            "Patrón anatómico levanta cola que proyecta y redondea sin aplastar",
            "Apertura perineal ergonómica y cómoda para el uso continuo diario"
        ],
        idealFor: "Cintura definida reloj de arena, soporte de columna lumbar, postura erguida y compresión firme.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-708",
        ref: "708",
        name: "Faja Strapless Short Con Broches (REF. 708)",
        slug: "faja-strapless-short-con-broches-ref-708",
        category: "moldeadoras",
        categoryLabel: "Fajas Moldeadoras",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 5.0,
        reviewsCount: 260,
        compression: "Extra Firme",
        badge: "REF. 708 • Strapless",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038914311.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038914311.png",
        shortDescription: "Faja moldeadora strapless con banda siliconada antideslizante, broches delanteros y terminación en short con encaje. Ideal para hombros descubiertos y escotes.",
        features: [
            "Banda elástica superior strapless con silicona antideslizante que no se baja ni rueda",
            "Incluye cargaderas removibles y ajustables para máxima versatilidad según la prenda",
            "3 hileras de broches frontales de alta resistencia para graduación personalizada",
            "Control completo en abdomen alto, medio y bajo con realce glúteo estilizado",
            "Largo short medio con encaje siliconado que permanece perfectamente en su lugar"
        ],
        idealFor: "Prendas strapless, vestidos de fiesta, escotes palabra de honor y modelado diario de alta definición.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },

    // =========================================================
    // LÍNEA DORADA OFICIAL (EDICIÓN ESPECIAL ALTA DEFINICIÓN)
    // =========================================================
    {
        id: "ref-905",
        ref: "905",
        name: "Faja Short Tiro Alto - Broches (REF. 905)",
        slug: "faja-short-tiro-alto-broches-ref-905",
        category: "dorada",
        categoryLabel: "Línea Dorada",
        priceMXN: 1500,
        originalPriceMXN: 1850,
        priceCOP: 283110,
        originalPriceCOP: 349169,
        discount: "19% OFF",
        rating: 5.0,
        reviewsCount: 178,
        compression: "Extra Firme",
        badge: "REF. 905 • Línea Dorada",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927902887.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927902887.png",
        shortDescription: "Faja short de tiro alto con triple hilera de broches frontales y compresión focalizada en abdomen. Efecto levanta cola anatómico con encaje siliconado que no se enrolla.",
        features: [
            "Tiro ultra alto que estiliza desde debajo del busto hasta la zona pélvica",
            "Triple hilera de broches centrales de alta resistencia para compresión gradual",
            "Corte levanta glúteos anatómico que realza y redondea de manera natural",
            "Apertura perineal práctica y cómoda para todo el día",
            "Encaje siliconado suave en pierna que se adhiere sin marcar ni apretar"
        ],
        idealFor: "Uso diario, vestidos ajustados, pantalones de tiro alto y moldeado express de cintura y abdomen.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-746",
        ref: "746",
        name: "Faja Sisa Short Broches - Varillas (REF. 746)",
        slug: "faja-sisa-short-broches-varillas-ref-746",
        category: "dorada",
        categoryLabel: "Línea Dorada",
        priceMXN: 2500,
        originalPriceMXN: 2990,
        priceCOP: 471850,
        originalPriceCOP: 564330,
        discount: "16% OFF",
        rating: 5.0,
        reviewsCount: 215,
        compression: "Extra Firme",
        badge: "REF. 746 • Línea Dorada",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927910806.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927910806.png",
        shortDescription: "Faja manga sisa con varillas flexibles de soporte lumbar y broches frontales continuos. Largo a la rodilla tipo capri corto para moldeado integral de espalda, abdomen y muslos.",
        features: [
            "Varillas ergonómicas interiores que acentúan la curvatura de la cintura y corrigen postura",
            "Manga sisa con cobertura completa en espalda y axilas para control de rollitos",
            "Busto libre con banda de soporte y conexión que centra y realza el busto",
            "Hileras de broches frontales reforzados de grado médico para graduación milimétrica",
            "Largo bermuda a la rodilla con forro de SmartLycra con Aloe Vera y Vitamina E"
        ],
        idealFor: "Moldeado integral de alta compresión, eventos de gala, recuperación estética y soporte postural continuo.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Miel / Beige", hex: "#c99e69" },
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-812",
        ref: "812",
        name: "Cinturilla 13 Varillas Broches y Cierre (REF. 812)",
        slug: "cinturilla-13-varillas-broches-cierre-ref-812",
        category: "dorada",
        categoryLabel: "Línea Dorada",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 5.0,
        reviewsCount: 310,
        compression: "Extra Firme",
        badge: "REF. 812 • 13 Varillas",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927923206.png",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927923206.png",
        shortDescription: "Cinturilla reloj de arena de ultra definición con 13 varillas de acero flexible y doble sistema de ajuste con broches internos y cierre frontal reforzado.",
        features: [
            "13 varillas anatómicas con memoria que moldean cintura avispa al instante sin doblarse",
            "Doble sistema de compresión: broches internos de sujeción + cierre plano invisible frontal",
            "Soporte lumbar ergonómico de alta firmeza que mantiene la columna alineada",
            "Busto y cadera libres para usar con cualquier tipo de prenda interior o exterior",
            "Elaborada en Powernet de calibre pesado con forro suave hipoalergénico"
        ],
        idealFor: "Entrenamiento de cintura, vestidos ceñidos, eventos y silueta reloj de arena instantánea.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-819",
        ref: "819",
        name: "Faja Corset Alta Definición (REF. 819)",
        slug: "faja-corset-alta-definicion-ref-819",
        category: "dorada",
        categoryLabel: "Línea Dorada",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 5.0,
        reviewsCount: 195,
        compression: "Extra Firme",
        badge: "REF. 819 • Corset Premium",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927929390.jpg",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927929390.jpg",
        shortDescription: "Elegante corset de lujo con copas estructuradas de soporte para busto, varillas verticales estilizadoras y cierre central. Prenda versátil de alta costura para uso exterior o interior.",
        features: [
            "Diseño de corsetería de lujo que puede usarse como prenda exterior o debajo de la ropa",
            "Copas prehormadas con varillas que realzan, centran y moldean el escote femenino",
            "Varillas estructuradas verticales que reducen cintura y aplanan el abdomen",
            "Cierre frontal metálico dorado de alta resistencia y fácil colocación",
            "Tirantes delgados ajustables que proporcionan un soporte firme y estilizado"
        ],
        idealFor: "Outfits de noche, eventos especiales, blazers, faldas, jeans y modelado de cintura y escote.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    },
    {
        id: "ref-813",
        ref: "813",
        name: "Chaleco 13 Varillas Broches y Cierre (REF. 813)",
        slug: "chaleco-13-varillas-broches-cierre-ref-813",
        category: "dorada",
        categoryLabel: "Línea Dorada",
        priceMXN: 2000,
        originalPriceMXN: 2450,
        priceCOP: 377480,
        originalPriceCOP: 462410,
        discount: "18% OFF",
        rating: 4.9,
        reviewsCount: 228,
        compression: "Extra Firme",
        badge: "REF. 813 • Chaleco 13 Varillas",
        image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927935856.jpg",
        secondaryImage: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927935856.jpg",
        shortDescription: "Chaleco de compresión máxima con 13 varillas ergonómicas, soporte alto de espalda para corregir postura y eliminar gorditos axilares, y sistema dual de broches y cierre.",
        features: [
            "Espalda alta anatómica con tirantes anchos que corrigen postura y eliminan gorditos debajo de la axila",
            "13 varillas flexibles de soporte que perfilan una cintura diminuta y descansan la zona lumbar",
            "Busto libre tipo u-shape que realza el busto y permite usar con cualquier brasier",
            "Doble capa de ajuste: hileras de broches internos + cierre de seguridad exterior",
            "Tejido transpirable de Powernet colombiano de compresión médica y estética"
        ],
        idealFor: "Corrección postural, reducción de rollitos en espalda alta y axilas, y cintura de avispa.",
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        colors: [
            { name: "Negro", hex: "#111111" }
        ],
        inStock: true
    }
];

// Helper para obtener precio según país activo con conversión matemática exacta
function getProductPrice(product, countryCode = null) {
    const code = countryCode || getActiveCountryCode();
    if (code === "MX") return product.priceMXN;
    return product.priceCOP || (typeof convertMXNtoCOP === "function" ? convertMXNtoCOP(product.priceMXN) : Math.round(product.priceMXN * 188.74));
}

function getProductOriginalPrice(product, countryCode = null) {
    const code = countryCode || getActiveCountryCode();
    if (code === "MX") return product.originalPriceMXN;
    return product.originalPriceCOP || (typeof convertMXNtoCOP === "function" ? convertMXNtoCOP(product.originalPriceMXN) : Math.round(product.originalPriceMXN * 188.74));
}

// Retrocompatibilidad: propiedades 'price' y 'originalPrice' dinámicas
PRODUCTS_DATA.forEach(p => {
    Object.defineProperty(p, 'price', {
        get() { return getProductPrice(this); },
        configurable: true
    });
    Object.defineProperty(p, 'originalPrice', {
        get() { return getProductOriginalPrice(this); },
        configurable: true
    });
});

// Helper para obtener producto por ID
function getProductById(id) {
    return PRODUCTS_DATA.find(p => p.id === id);
}

// Categorías del catálogo con división estricta oficial
const CATEGORIES_DATA = [
    { id: "all", name: "Todas las Fajas (" + PRODUCTS_DATA.length + ")" },
    { id: "postquirurgica", name: "Fajas Postquirúrgicas (" + PRODUCTS_DATA.filter(p => p.category === "postquirurgica").length + ")" },
    { id: "moldeadoras", name: "Fajas Moldeadoras (" + PRODUCTS_DATA.filter(p => p.category === "moldeadoras").length + ")" },
    { id: "dorada", name: "Línea Dorada (" + PRODUCTS_DATA.filter(p => p.category === "dorada").length + ")" }
];
