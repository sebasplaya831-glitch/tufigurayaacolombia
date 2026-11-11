/**
 * ====================================================================
 * TU FIGURA YAA COLOMBIA - CALCULADORA Y GUÍA INTERACTIVA DE TALLAS
 * ====================================================================
 * Estándar colombiano de alta compresión Powernet.
 * Basado en medidas anatómicas en centímetros (Cintura y Cadera).
 * Recomienda la talla exacta y la faja perfecta con su nombre oficial.
 */

const SIZE_CHART = [
    { size: "2XS", waistMin: 55, waistMax: 61, hipMin: 80, hipMax: 86, bustMin: 78, bustMax: 84 },
    { size: "XS",  waistMin: 62, waistMax: 68, hipMin: 87, hipMax: 93, bustMin: 85, bustMax: 91 },
    { size: "S",   waistMin: 69, waistMax: 75, hipMin: 94, hipMax: 100, bustMin: 92, bustMax: 97 },
    { size: "M",   waistMin: 76, waistMax: 82, hipMin: 101, hipMax: 107, bustMin: 98, bustMax: 103 },
    { size: "L",   waistMin: 83, waistMax: 89, hipMin: 108, hipMax: 114, bustMin: 104, bustMax: 109 },
    { size: "XL",  waistMin: 90, waistMax: 97, hipMin: 115, hipMax: 122, bustMin: 110, bustMax: 116 },
    { size: "2XL", waistMin: 98, waistMax: 106, hipMin: 123, hipMax: 130, bustMin: 117, bustMax: 124 },
    { size: "3XL", waistMin: 107, waistMax: 118, hipMin: 131, hipMax: 142, bustMin: 125, bustMax: 134 }
];

function determinePerfectFaja(waist, hip, goal = "general", calculatedSize = "M") {
    const diff = hip - waist;

    if (goal === "postquirurgica") {
        return {
            id: "ref-705",
            ref: "705",
            name: "Faja Sisa Broches Short Medio (REF. 705)",
            image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620499316.png",
            categoryLabel: "Línea Postquirúrgica & Médica",
            priceMXN: 2000,
            priceCOP: 377480,
            reason: `Faja médica número uno para recuperación de cirugías, postparto y lipoescultura. Sus 3 hileras de broches permiten ajustar gradualmente a medida que desinflamas en talla ${calculatedSize}.`
        };
    }

    if (goal === "cintura_varillas") {
        return {
            id: "ref-812",
            ref: "812",
            name: "Cinturilla 13 Varillas Broches y Cierre (REF. 812)",
            image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927923206.png",
            categoryLabel: "Línea Dorada • Edición Especial",
            priceMXN: 2000,
            priceCOP: 377480,
            reason: `Sus 13 varillas de acero flexible con memoria y doble ajuste (broches + cierre plano) esculpen cintura de avispa instantánea para tu medida de ${waist} cm.`
        };
    }

    if (goal === "corset") {
        return {
            id: "ref-819",
            ref: "819",
            name: "Faja Corset Alta Definición (REF. 819)",
            image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927929390.jpg",
            categoryLabel: "Línea Dorada • Edición Especial",
            priceMXN: 2000,
            priceCOP: 377480,
            reason: `Diseño exclusivo de corsetería de lujo con copas prehormadas de realce para lucir con escotes, blazers o vestidos en talla ${calculatedSize}.`
        };
    }

    if (goal === "levanta_cola") {
        return {
            id: "ref-905",
            ref: "905",
            name: "Faja Short Tiro Alto - Broches (REF. 905)",
            image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927902887.png",
            categoryLabel: "Línea Dorada • Edición Especial",
            priceMXN: 1500,
            priceCOP: 283110,
            reason: `Tiro ultra alto que controla el abdomen bajo y realza naturalmente los glúteos con encaje siliconado para tus ${hip} cm de cadera.`
        };
    }

    // Por defecto según proporción anatómica
    if (diff >= 28) {
        return {
            id: "ref-746",
            ref: "746",
            name: "Faja Sisa Short Broches - Varillas (REF. 746)",
            image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927910806.png",
            categoryLabel: "Línea Dorada • Reloj de Arena",
            priceMXN: 2500,
            priceCOP: 471850,
            reason: `Tus medidas (${waist} cm cintura / ${hip} cm cadera) corresponden a una silueta curvilínea. Este modelo con varillas internas y largo a la rodilla perfila una figura reloj de arena perfecta en talla ${calculatedSize}.`
        };
    } else {
        return {
            id: "ref-740",
            ref: "740",
            name: "Faja Sisa Short Broches 7 Varillas (REF. 740)",
            image: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1790038901653.png",
            categoryLabel: "Línea Moldeadora",
            priceMXN: 2000,
            priceCOP: 377480,
            reason: `Sus 7 varillas ergonómicas reducen el contorno abdominal y mejoran la postura para tus ${waist} cm de cintura en talla ${calculatedSize}.`
        };
    }
}

function calculateRecommendedSize(waist, hip, bust = null, isExperienced = false, goal = "general") {
    waist = parseFloat(waist);
    hip = parseFloat(hip);
    bust = bust ? parseFloat(bust) : null;

    if (isNaN(waist) || isNaN(hip) || waist <= 0 || hip <= 0) {
        return {
            error: true,
            message: "Por favor ingresa tu medida de cintura y cadera en centímetros."
        };
    }

    // Buscamos coincidencia en la tabla
    let matchedWaist = SIZE_CHART.find(row => waist >= row.waistMin && waist <= row.waistMax);
    let matchedHip = SIZE_CHART.find(row => hip >= row.hipMin && hip <= row.hipMax);

    let finalSize = "M"; // fallback
    let advice = "";

    // Si está por debajo de la mínima
    if (waist < SIZE_CHART[0].waistMin) {
        finalSize = "2XS";
        advice = "Tus medidas corresponden a nuestra talla más reducida (2XS), brindándote compresión ultra ceñida.";
    } else if (waist > SIZE_CHART[SIZE_CHART.length - 1].waistMax) {
        finalSize = "3XL";
        advice = "Tus medidas se adaptan a nuestra talla 3XL o a confección personalizada con asesoría por WhatsApp.";
    } else if (matchedWaist && matchedHip) {
        if (matchedWaist.size === matchedHip.size) {
            finalSize = matchedWaist.size;
            advice = "¡Tus proporciones de cintura y cadera coinciden con precisión milimétrica!";
        } else {
            const waistIdx = SIZE_CHART.findIndex(r => r.size === matchedWaist.size);
            const hipIdx = SIZE_CHART.findIndex(r => r.size === matchedHip.size);
            
            if (hipIdx > waistIdx) {
                finalSize = matchedHip.size;
                advice = `Tu cadera sugiere talla ${matchedHip.size} y tu cintura ${matchedWaist.size}. Para fajas enterizas recomendamos ${matchedHip.size} para proteger tus glúteos. Si eliges cinturilla o corset, puedes optar por ${matchedWaist.size}.`;
            } else {
                finalSize = matchedWaist.size;
                advice = `Recomendamos basarte principalmente en la medida de tu cintura (${matchedWaist.size}).`;
            }
        }
    } else if (matchedWaist) {
        finalSize = matchedWaist.size;
        advice = "Recomendación calculada según tu contorno de cintura.";
    } else if (matchedHip) {
        finalSize = matchedHip.size;
        advice = "Recomendación calculada según tu contorno de cadera.";
    }

    let experienceTip = isExperienced 
        ? "Como ya usas fajas colombianas de alta compresión, si estás entre dos tallas, la más ajustada te dará mayor reducción."
        : "Si es tu primera vez usando Powernet original, abrocha de abajo hacia arriba con calma; la prenda se amoldará a tu cuerpo.";

    const perfectFaja = determinePerfectFaja(waist, hip, goal, finalSize);

    return {
        error: false,
        size: finalSize,
        advice: advice,
        experienceTip: experienceTip,
        waist: waist,
        hip: hip,
        bust: bust,
        perfectFaja: perfectFaja
    };
}
