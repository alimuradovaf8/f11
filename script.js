const frames = document.querySelectorAll("[data-wiki]");

function initials(label) {
    return label
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
}

async function loadWikiImage(frame) {

    const title = frame.dataset.wiki;
    const label = frame.dataset.label || title;

    frame.dataset.label = initials(label);

    const url =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(title.replaceAll(" ", "_"));

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Wikipedia API error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Wikipedia:", title, data);

        const image =
            data.thumbnail?.source ||
            data.originalimage?.source;

        if (!image) {
            console.warn(
                "У статьи нет изображения:",
                title
            );

            return;
        }

        const img = document.createElement("img");

        img.src = image;
        img.alt = label;
        img.loading = "lazy";

        img.onload = function () {

            frame.innerHTML = "";

            frame.appendChild(img);

            frame.classList.add("loaded");
        };

        img.onerror = function () {

            console.error(
                "Не удалось загрузить изображение:",
                image
            );
        };

    } catch (error) {

        console.error(
            "Ошибка загрузки Wikipedia:",
            title,
            error
        );
    }
}

frames.forEach(frame => {

    loadWikiImage(frame);

});