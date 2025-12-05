async function includeHTML(id, url) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      document.getElementById(id).innerHTML = await res.text();
    } else {
      console.error(`Dosya yüklenemedi: ${url}`, res.status);
    }
  } catch (err) {
    console.error('includeHTML hatası:', err);
  }
}

// Header ve footer yükle
includeHTML('site-header', 'header.html');
includeHTML('site-footer', 'footer.html');

// WhatsApp numarası
const WHATSAPP_NUMBER = "905438610057"; // ülke kodu + numara

// Fiyat formatla
function formatPrice(v) {
  return v.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL';
}

// Gerçek WhatsApp açma fonksiyonu
function openWhatsApp(p) {
  const message = `Merhaba, ${p.title} hakkında detaylı bilgi almak istiyorum.\nÜrün ID: ${p.id}\nFiyat: ${formatPrice(p.price)}`;
  const text = encodeURIComponent(message);

  const url = WHATSAPP_NUMBER && /^[0-9]+$/.test(WHATSAPP_NUMBER)
    ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`
    : `https://api.whatsapp.com/send?text=${text}`;

  window.open(url, '_blank');
}

// Ürün verileri
const data = [
  {id:1,title:'Cips (200g)',price:29.90,old:39.90,img:'https://picsum.photos/seed/1/300/200',sold:120,cat:'atistirmalik'},
  {id:2,title:'Bisküvi Paket',price:18.50,old:null,img:'https://picsum.photos/seed/2/300/200',sold:86,cat:'atistirmalik'},
  {id:3,title:'Meyve Suyu (1L)',price:12.90,old:15.90,img:'https://picsum.photos/seed/3/300/200',sold:45,cat:'icecek'},
  {id:4,title:'Fındık 500g',price:149.90,old:189.90,img:'https://picsum.photos/seed/4/300/200',sold:30,cat:'kuruyemis'},
  {id:5,title:'Un (10kg)',price:249.90,old:null,img:'https://picsum.photos/seed/5/300/200',sold:10,cat:'unlu'}
];

// Ürünleri render et
function renderProducts(list = data) {
  const container = document.getElementById('products');
  const countEl = document.getElementById('count');
  
  if (!container) return;

  container.innerHTML = '';

  list.forEach(p => {
    const discount = p.old ? Math.round((p.old - p.price) / p.old * 100) : 0;

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      ${discount > 0 ? `<div class="badge">-%${discount}</div>` : ''}
      <div class="media"><img src="${p.img}" alt="${p.title}" loading="lazy"></div>
      <div class="title">${p.title}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <div>
          <div class="price">${formatPrice(p.price)}</div>
          ${p.old ? `<div class="old">${formatPrice(p.old)}</div>` : ''}
        </div>
        <div class="sold">${p.sold} adet satıldı</div>
      </div>
      <div class="actions">
        <button class="btn small" onclick="alert('${p.title} detayları...')">Detay</button>
        <button class="btn small whatsapp" onclick='openWhatsApp(${JSON.stringify(p)})'>
          WhatsApp'tan Sor
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  if (countEl) countEl.textContent = list.length;
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', () => {
  // header/footer biraz geç yüklenebilir, render'ı biraz geciktirmek iyi olur
  setTimeout(renderProducts, 300);
});
