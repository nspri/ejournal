

export function extractImagesAndStrip(obj) {
    const images = [];
    const cleanObj = {};

    for (const key in obj) {
        const value = obj[key];

        if (
            typeof value === "string" &&
            value.startsWith("data:image/") &&
            value.includes("base64")
        ) {
            images.push({ path: [key], data: value });
            continue;
        }

        if (typeof value === "object" && value !== null) {
            const { clean, foundImages } = extractImagesAndStrip(value);
            cleanObj[key] = clean;
            // Prefix the path with current key
            foundImages.forEach((img) => {
                images.push({ path: [key, ...img.path], data: img.data });
            });
        } else {
            cleanObj[key] = value;
        }
    }

    return { clean: cleanObj, foundImages: images };
}
export const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
