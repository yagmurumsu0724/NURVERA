export const products = [
  {
    id: 1,
    slug: 'hayit-tenturu',
    name: 'Hayıt Tentürü',
    description: '%100 Doğal • Alkolsüz',
    shortDescription: 'Özellikle kadınların döngüsel dönemlerinde rahatlama sağlamak amacıyla kullanılan, tamamen doğal ve katkısız olarak elde edilen Hayıt ekstraktı.',
    price: '350,00 ₺',
    image: '/images/product_hayit.png',
    images: [
      '/images/product_hayit.png'
    ],
    badge: 'Yeni',
    volume: '100 ml',
    ingredients: '%100 Vitex agnus-castus (Hayıt) tohumu ekstraktı, bitkisel gliserin. Alkol, şeker, koruyucu ve renklendirici içermez.',
    usage: 'Günde 1 kez, yarım çay bardağı suya 20-30 damla damlatılarak tüketilmesi tavsiye edilir. Kullanmadan önce şişeyi iyice çalkalayınız.',
    warnings: 'Hamile ve emziren kadınların, kronik rahatsızlığı olanların kullanmadan önce hekime danışması önerilir. Çocukların ulaşamayacağı, serin ve güneş görmeyen yerde saklayınız. İlaç değildir.'
  },
  {
    id: 2,
    slug: 'papatya-hidrosolu',
    name: 'Papatya Hidrosolü',
    description: 'Saf & Katkısız',
    shortDescription: 'Hassas ciltleri yatıştırır ve rahatlatır. %100 saf ve doğal, bakır imbikte odun ateşinde distile edilmiştir.',
    price: '240,00 ₺',
    image: '/images/product_papatya.png',
    images: [
      '/images/product_papatya.png'
    ],
    badge: 'Çok Satan',
    volume: '100 ml',
    ingredients: '%100 Matricaria recutita (Papatya) uçucu yağı altı suyu (Hidrosol). Paraben, sülfat, sentetik koku ve boya içermez.',
    usage: 'Temizlenmiş cildinize 15-20 cm uzaktan doğrudan püskürtebilir veya pamuk yardımıyla yüzünüze uygulayabilirsiniz. Gün içinde cildinizi ferahlatmak için dilediğiniz sıklıkta kullanabilirsiniz.',
    warnings: 'Sadece harici kullanım içindir. Göz ile temasından kaçınınız. Buzdolabında saklanması raf ömrünü uzatır ve ferahlatıcı etkisini artırır.'
  },
  {
    id: 3,
    slug: 'alic-sirkesi',
    name: 'Alıç Sirkesi',
    description: 'Doğal Fermente',
    shortDescription: 'Doğal fermentasyon yöntemiyle aylarca bekletilerek elde edilen, filtrelenmemiş ve pastörize edilmemiş canlı sirkedir.',
    price: '180,00 ₺',
    image: '/images/product_alic.png',
    images: [
      '/images/product_alic.png'
    ],
    badge: '',
    volume: '500 ml',
    ingredients: '%100 Doğal Alıç meyvesi, içme suyu. Sirke anası (canlı maya) içerebilir.',
    usage: 'Sabahları aç karnına veya öğün aralarında bir bardak ılık suya 1-2 tatlı kaşığı ekleyerek tüketebilirsiniz. Salatalarınıza sos olarak kullanabilirsiniz.',
    warnings: 'Güneş ışığından uzak, serin ve kuru yerde muhafaza ediniz. Kapak açıldıktan sonra buzdolabında saklayınız. Tortu yapması doğal fermentasyonun kanıtıdır, bozulma belirtisi değildir.'
  },
  {
    id: 4,
    slug: 'elma-sirkesi',
    name: 'Elma Sirkesi',
    description: 'Doğal Fermente',
    shortDescription: 'Mevsiminde toplanan en kaliteli elmalardan doğal fermentasyonla elde edilen, probiyotik açısından zengin canlı sirke.',
    price: '160,00 ₺',
    image: '/images/product_elma.png',
    images: [
      '/images/product_elma.png'
    ],
    badge: '',
    volume: '500 ml',
    ingredients: '%100 Doğal Elma, içme suyu. Katkı, koruyucu ve suni asetik asit içermez.',
    usage: 'Cilt toniği olarak yarı yarıya su ile seyreltilerek kullanılabilir. Beslenmede ise salatalara ve içme suyuna eklenerek tüketilmesi önerilir.',
    warnings: 'Mide hassasiyeti olanların dikkatli tüketmesi önerilir. Doğal yapısından dolayı renk değişimi ve tortulaşma olabilir.'
  },
  {
    id: 5,
    slug: 'sari-kantaron-yagi',
    name: 'Sarı Kantaron Yağı',
    description: 'Soğuk Sıkım',
    shortDescription: 'Güneşte bekletilerek sızma zeytinyağında maserasyon yöntemiyle elde edilen, cilt onarıcı etkisiyle bilinen mucizevi yağ.',
    price: '290,00 ₺',
    image: '/images/product_kantaron.png',
    images: [
      '/images/product_kantaron.png'
    ],
    badge: 'Çok Satan',
    volume: '100 ml',
    ingredients: 'Hypericum perforatum (Sarı Kantaron) çiçekleri, Soğuk sıkım sızma zeytinyağı.',
    usage: 'İhtiyaç duyulan bölgeye birkaç damla damlatılarak hafif masaj hareketleriyle cilde yedirilir. Geceleri kullanılması tavsiye edilir.',
    warnings: 'Işığa duyarlılığı artırabileceğinden, ürünü kullandıktan sonra güneşe çıkılması tavsiye edilmez (Leke yapabilir). Serin ve karanlık yerde saklayınız.'
  }
];

export const getProductById = (id) => products.find(p => p.id === parseInt(id));
export const getProductBySlug = (slug) => products.find(p => p.slug === slug);
