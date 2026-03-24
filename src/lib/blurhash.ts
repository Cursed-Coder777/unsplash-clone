import { decode } from 'blurhash';

/**
 * Converts a blurhash string to a base64 data URL suitable for use as a
 * Next.js Image blurDataURL placeholder.
 */
export function blurhashToDataURL(hash: string, width = 32, height = 32): string {
    try {
        const pixels = decode(hash, width, height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    } catch {
        return '';
    }
}
