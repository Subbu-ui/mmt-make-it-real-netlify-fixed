/**
 * Synthetic and curated test media for MakeMyTrip Travel Vision verification
 */

// Helper to render a high-quality test card into base64 data-URL with visible text overlays
export function generateTestImage(type: 'bangalore' | 'goa' | 'generic_beach'): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (type === 'bangalore') {
    // Urban rooftop evening with vibrant nightlife lighting
    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#0a192f');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 800);

    // City lights and bokeh
    for (let i = 0; i < 40; i++) {
      const x = (i * 37) % 640;
      const y = 300 + ((i * 53) % 450);
      const r = 5 + (i % 12);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 180, 50, 0.3)' : 'rgba(230, 50, 80, 0.25)';
      ctx.fill();
    }

    // Modern glass building silhouettes
    ctx.fillStyle = '#020617';
    ctx.fillRect(40, 350, 100, 450);
    ctx.fillRect(160, 260, 140, 540);
    ctx.fillRect(320, 310, 110, 490);
    ctx.fillRect(450, 220, 150, 580);

    // Rooftop cocktail lounge table & glass
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 650, 640, 150);

    // Visible Reel Overlay (OCR Target)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.roundRect(40, 80, 560, 130, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Bangalore Rooftop Cafe & Bar', 65, 135);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 22px sans-serif';
    ctx.fillText('📍 Indiranagar, Bengaluru • Weekend Nightlife Guide', 65, 175);

    // Reel creator tag
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('@bangalore.foodie • Trending Cocktails & Ambiance', 40, 720);
  } else if (type === 'goa') {
    // Golden hour tropical beach with shacks and palms
    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(0.35, '#fb923c');
    grad.addColorStop(0.6, '#fef08a');
    grad.addColorStop(0.75, '#0284c7');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 800);

    // Golden Sun over the sea
    ctx.beginPath();
    ctx.arc(320, 440, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#fff7ed';
    ctx.fill();

    // Sea water & sunset reflections
    ctx.fillStyle = 'rgba(251, 146, 60, 0.4)';
    ctx.fillRect(0, 500, 640, 80);

    // Sandy beach & beach shack
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 580, 640, 220);

    // Beach shack silhouette
    ctx.fillStyle = '#78350f';
    ctx.fillRect(60, 520, 180, 80);
    // Shack roof
    ctx.beginPath();
    ctx.moveTo(40, 520);
    ctx.lineTo(150, 470);
    ctx.lineTo(260, 520);
    ctx.closePath();
    ctx.fill();

    // Coconut palm silhouettes
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(520, 360, 90, 0, Math.PI * 2);
    ctx.fill();

    // Visible Reel Overlay (OCR Target)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.roundRect(40, 80, 560, 130, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Sunset Shack & Waves in Goa', 65, 135);

    ctx.fillStyle = '#fde047';
    ctx.font = '600 22px sans-serif';
    ctx.fillText('📍 Vagator Beach, North Goa • Arabian Sea Sunset', 65, 175);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('@goa_diaries • Beach shack chilling & sunset drinks', 40, 720);
  } else {
    // Generic tropical beach (No text, no distinctive landmarks -> vibe only)
    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.5, '#bae6fd');
    grad.addColorStop(0.7, '#0ea5e9');
    grad.addColorStop(1, '#fde047');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 800);

    // Turquoise water
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 480, 640, 160);

    // Clean white sand
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 640, 640, 160);

    // Ambient water ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 520 + i * 20);
      ctx.bezierCurveTo(200, 510 + i * 20, 400, 530 + i * 20, 640, 520 + i * 20);
      ctx.stroke();
    }
  }

  return canvas.toDataURL('image/jpeg', 0.85);
}
