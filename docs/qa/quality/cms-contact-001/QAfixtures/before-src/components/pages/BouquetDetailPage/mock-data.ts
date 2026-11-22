// Mock copy from existing widget fixtures; RU and SR are unapproved semantic drafts.
const labels = {
  en: {
    fullnessLegend: 'Preferred fullness',
    fullnessHelper: 'Illustrative options; the final bouquet and quote are confirmed on enquiry.',
    fullnessOptions: { standard: 'Standard', medium: 'Medium', large: 'Large' },
    extrasLegend: 'Make it more personal',
    extraLabels: { balloons: 'Balloons', chocolates: 'Chocolates', greetingCard: 'Greeting card' },
    dateLegend: 'Preferred date (optional)',
    datePlaceholder: 'Choose a date',
    dateFormatError: 'Invalid date format. Use DD.MM.YYYY.',
    messageLegend: 'Card message (optional)',
    messagePlaceholder: 'Your message',
  },
  ru: {
    fullnessLegend: 'Предпочтительная пышность',
    fullnessHelper: 'Иллюстративные варианты; итоговый букет и цена подтверждаются при запросе.',
    fullnessOptions: { standard: 'Стандарт', medium: 'Средняя', large: 'Большая' },
    extrasLegend: 'Сделай его особенным',
    extraLabels: { balloons: 'Шары', chocolates: 'Шоколадки', greetingCard: 'Открытка' },
    dateLegend: 'Предпочтительная дата (по желанию)',
    datePlaceholder: 'Выберите дату',
    dateFormatError: 'Неверный формат даты. Используйте ДД.ММ.ГГГГ.',
    messageLegend: 'Текст открытки (по желанию)',
    messagePlaceholder: 'Ваше сообщение',
  },
  sr: {
    fullnessLegend: 'Poželjna punoća',
    fullnessHelper: 'Ilustrativne opcije; konačan buket i cena se potvrđuju na upit.',
    fullnessOptions: { standard: 'Standardna', medium: 'Srednja', large: 'Velika' },
    extrasLegend: 'Učini ga posebnim',
    extraLabels: { balloons: 'Baloni', chocolates: 'Čokolade', greetingCard: 'Čestitka' },
    dateLegend: 'Poželjni datum (opciono)',
    datePlaceholder: 'Izaberite datum',
    dateFormatError: 'Neispravan format datuma. Koristite DD.MM.GGGG.',
    messageLegend: 'Poruka na čestitci (opciono)',
    messagePlaceholder: 'Vaša poruka',
  },
};

const content = {
 en: { titles:['Flowers & seasonal variation','Date & delivery enquiry','Care guidance'], answers:['The images show an inspiration. Flowers, colours and wrapping can vary; we’ll discuss the available options with you.','Share your preferred date, time and delivery location in your enquiry. Availability, timing and delivery details are confirmed in conversation.','For care advice, tell us which bouquet or arrangement you are enquiring about. We can discuss guidance for its flowers and presentation.'], eyebrow:'MORE FLORAL INSPIRATION', relatedHeading:'You may also like', enquire:'Enquire', reason:'Enquiry is not configured.', customEyebrow:'LET OLA CREATE.', customHeading:'Something personal, made with flowers.', description:'Tell us the occasion, the mood and your budget. We can discuss a bouquet direction that feels personal to you.', signature:'Flowers made with love', customAction:'Request a custom bouquet' },
 ru: { titles:['Цветы и сезонные изменения','Дата и запрос о доставке','Советы по уходу'], answers:['Изображения служат вдохновением. Цветы, оттенки и упаковка могут отличаться; доступные варианты мы обсудим с вами.','Укажите желаемую дату, время и место доставки в запросе. Наличие, время и детали доставки уточняются в разговоре.','Для совета по уходу расскажите, какой букет или композиция вас интересует. Мы обсудим уход за цветами и оформление.'], eyebrow:'БОЛЬШЕ ЦВЕТОЧНОГО ВДОХНОВЕНИЯ', relatedHeading:'Вам также может понравиться', enquire:'Узнать', reason:'Связь для запроса пока не настроена.', customEyebrow:'ПОЗВОЛЬТЕ OLA СОЗДАТЬ', customHeading:'Что-то личное, созданное из цветов.', description:'Расскажите о событии, настроении и бюджете. Мы обсудим направление букета, которое подойдёт именно вам.', signature:'Цветы с любовью', customAction:'Запросить индивидуальный букет' },
 sr: { titles:['Cveće i sezonske promene','Datum i upit za dostavu','Saveti za negu'], answers:['Slike služe kao inspiracija. Cveće, boje i pakovanje mogu da se razlikuju; razgovaraćemo o dostupnim opcijama.','U upitu navedite željeni datum, vreme i mesto dostave. Dostupnost, vreme i detalji dostave potvrđuju se u razgovoru.','Za savet o nezi recite nam koji buket ili aranžman vas zanima. Možemo razgovarati o nezi cveća i njegovoj prezentaciji.'], eyebrow:'JOŠ CVETNE INSPIRACIJE', relatedHeading:'Možda će vam se dopasti', enquire:'Pitajte', reason:'Kontakt za upit još nije podešen.', customEyebrow:'NEKA OLA STVARA', customHeading:'Nešto lično, stvoreno od cveća.', description:'Recite nam povod, raspoloženje i budžet. Možemo razgovarati o buketu koji vam odgovara.', signature:'Cveće s ljubavlju', customAction:'Zatražite buket po meri' }
};
const galleryLabels = {
  en: ['Bouquet gallery', 'Show bouquet view', 'Bouquet in blush and cream tones, view'],
  ru: ['Галерея букета', 'Показать вид букета', 'Букет в пудровых и кремовых тонах, вид'],
  sr: ['Galerija buketa', 'Prikaži pogled na buket', 'Buket u rumenkastim i krem tonovima, pogled'],
};
export { labels, content, galleryLabels };
