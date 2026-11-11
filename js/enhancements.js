/**
 * ====================================================================
 * TU FIGURA YAA — SWIPE DE GALERÍA EN QUICK VIEW (MOBILE)
 * ====================================================================
 * Permite deslizar con el dedo entre las fotos del producto
 * en la vista rápida, en lugar de tener que tocar los thumbnails.
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // Cada vez que se abre un Quick View, activar el swipe
    const contentEl = document.getElementById("quickViewContent");
    if (!contentEl) return;

    const observer = new MutationObserver(() => {
        setTimeout(attachSwipeToGallery, 100);
    });
    observer.observe(contentEl, { childList: true });

});

function attachSwipeToGallery() {
    const mainImg = document.getElementById("qvMainImage");
    if (!mainImg) return;

    const thumbs = Array.from(document.querySelectorAll(".qv-thumb"));
    if (thumbs.length < 2) return;

    const images = thumbs.map(t => t.src);
    let currentIndex = 0;

    let startX = 0;
    let startTime = 0;

    // Eliminar listeners anteriores para evitar duplicados
    if (mainImg._swipeStart) {
        mainImg.removeEventListener("touchstart", mainImg._swipeStart);
        mainImg.removeEventListener("touchend", mainImg._swipeEnd);
    }

    mainImg._swipeStart = (e) => {
        startX = e.touches[0].clientX;
        startTime = Date.now();
    };

    mainImg._swipeEnd = (e) => {
        const deltaX = e.changedTouches[0].clientX - startX;
        const elapsed = Date.now() - startTime;

        // Swipe válido: < 400ms y > 50px de desplazamiento
        if (elapsed > 400 || Math.abs(deltaX) < 50) return;

        const direction = deltaX < 0 ? 1 : -1; // 1 = siguiente, -1 = anterior
        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= images.length) return;

        currentIndex = nextIndex;

        // Animación de transición
        mainImg.style.transition = "opacity 0.15s ease, transform 0.15s ease";
        mainImg.style.opacity = "0";
        mainImg.style.transform = `translateX(${direction * -20}px)`;

        setTimeout(() => {
            mainImg.src = images[currentIndex];
            mainImg.style.transition = "opacity 0.2s ease, transform 0.2s ease";
            mainImg.style.opacity = "1";
            mainImg.style.transform = "translateX(0)";

            // Marcar thumbnail activo
            thumbs.forEach((t, i) => t.classList.toggle("active", i === currentIndex));

            // Actualizar indicador de puntos
            updateSwipeDots(currentIndex, images.length);
        }, 150);
    };

    mainImg.addEventListener("touchstart", mainImg._swipeStart, { passive: true });
    mainImg.addEventListener("touchend", mainImg._swipeEnd, { passive: true });

    // Añadir indicador de puntos (dots) si hay más de 1 imagen
    addSwipeDots(mainImg, images.length);
}

function addSwipeDots(mainImg, total) {
    const gallery = mainImg.closest(".qv-gallery");
    if (!gallery) return;

    // Eliminar dots anteriores
    const old = gallery.querySelector(".swipe-dots");
    if (old) old.remove();

    if (total < 2) return;

    const dots = document.createElement("div");
    dots.className = "swipe-dots";
    for (let i = 0; i < total; i++) {
        const dot = document.createElement("span");
        dot.className = "swipe-dot" + (i === 0 ? " active" : "");
        dots.appendChild(dot);
    }
    gallery.appendChild(dots);
}

function updateSwipeDots(activeIndex, total) {
    const dots = document.querySelectorAll(".swipe-dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === activeIndex));
}
