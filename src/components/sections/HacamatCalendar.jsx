import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import Link from 'next/link';

// Minimalist Hacamat Kupası İkonu (Line Art + İçinde küçük yaprak)
const GoldenCupIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V7H7V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 9C6 7.89543 6.89543 7 8 7H16C17.1046 7 18 7.89543 18 9V12C18 15.866 14.866 19 11 19H11C7.68629 19 5 16.3137 5 13V9H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 23C8.5 23 6 22 6 22L6.5 19.5C6.5 19.5 8.5 20 11 20H11C13.5 20 15.5 19.5 15.5 19.5L16 22C16 22 13.5 23 11 23Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* İçindeki minik yaprak (NURVERA temsili) */}
    <path d="M11 15C9.5 15 9.5 12.5 11 12.5C12.5 12.5 12.5 15 11 15Z" fill="currentColor" opacity="0.6"/>
  </svg>
);

export default function HacamatCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalendar = async (year, month) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
      if (!response.ok) throw new Error('Takvim verisi alınamadı');
      
      const data = await response.json();
      
      const processedDays = data.data.map((item) => {
        const hijriDay = parseInt(item.hijri.day, 10);
        const weekdayEn = item.gregorian.weekday.en;
        const gregorianDate = item.gregorian.date;
        
        let type = 'uygun'; // uygun, altin, orta, kacinilmasi
        let label = 'Uygun Gün';

        if (['Wednesday', 'Friday', 'Saturday'].includes(weekdayEn)) {
          type = 'kacinilmasi';
          label = 'Kaçınılması Gereken';
        } 
        else if ([17, 19, 21].includes(hijriDay)) {
          if (weekdayEn === 'Tuesday') {
            type = 'altin';
            label = 'Altın Hacamat Günü';
          } else {
            type = 'orta';
            label = 'Özel Gün (Sünnet)';
          }
        } 
        else if (hijriDay < 5 || hijriDay > 25) {
          type = 'kacinilmasi';
          label = 'Kaçınılması Gereken';
        }

        const [d, m, y] = gregorianDate.split('-');
        const dateString = `${y}-${m}-${d}`;
        
        const dayDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const today = new Date();
        today.setHours(0,0,0,0);
        const isPast = dayDate < today;

        return {
          dayNumber: parseInt(d, 10),
          hijriDay,
          type,
          label,
          dateString,
          isPast,
          weekdayEn
        };
      });

      const firstDay = new Date(year, month - 1, 1);
      let startingDay = firstDay.getDay() - 1; 
      if (startingDay === -1) startingDay = 6;

      const fullCalendar = Array(startingDay).fill(null).concat(processedDays);
      setCalendarData(fullCalendar);

    } catch (err) {
      console.error(err);
      setError('Takvim yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // Renk Paleti (Tasarım Sisteminden)
  const colors = {
    mainGreen: '#1E4D3A',
    lightGreen: '#7FA34D',
    gold: '#D4A017',
    cream: '#FAF9F5',
    lightGray: '#F4F4F2',
    text: '#1F2937',
    border: '#E8E8E8'
  };

  return (
    <div className="w-full">
      {/* Takvim Ana Kartı */}
      <div 
        className="bg-white mx-auto relative overflow-hidden" 
        style={{ 
          borderRadius: '24px', 
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
          border: `1px solid ${colors.border}`,
          padding: '40px'
        }}
      >
        {/* Başlık Alanı */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            {/* NURVERA Logosu Temsili */}
            <div className="flex flex-col items-center">
              <Leaf className="w-8 h-8" style={{ color: colors.lightGreen }} strokeWidth={1.5} />
              <span className="font-serif tracking-[0.2em] text-xs mt-2" style={{ color: colors.mainGreen }}>NURVERA</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-2" style={{ color: colors.mainGreen }}>
            Hacamat Takvimi
          </h2>
          <p className="tracking-[0.15em] text-sm uppercase font-semibold" style={{ color: colors.gold }}>
            ALTIN GÜNLERDE ETKİLİ DESTEK
          </p>
        </div>

        {/* Ay Gezinme */}
        <div className="flex justify-between items-center mb-8 px-4">
          <button onClick={prevMonth} className="p-2 transition-colors duration-300 hover:text-[#D4A017]" style={{ color: colors.mainGreen }}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-serif" style={{ color: colors.mainGreen }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 transition-colors duration-300 hover:text-[#D4A017]" style={{ color: colors.mainGreen }}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.gold }}></div>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Haftanın Günleri */}
            <div className="grid grid-cols-7 gap-3 mb-3">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-bold uppercase tracking-wider py-2" style={{ color: colors.mainGreen }}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Günler */}
            <div className="grid grid-cols-7 gap-3 mb-10">
              {calendarData.map((day, index) => {
                if (!day) return <div key={index} className="aspect-[4/3] md:aspect-[3/2]"></div>;
                
                const isClickable = !day.isPast && day.type !== 'kacinilmasi';
                const isGold = day.type === 'altin';
                const isSuitable = day.type === 'uygun' || day.type === 'orta';
                const isAvoid = day.type === 'kacinilmasi';

                // Dinamik Stiller
                let boxStyle = {
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  color: colors.text,
                  opacity: day.isPast ? 0.4 : 1,
                };

                if (isGold && !day.isPast) {
                  boxStyle.border = `1px solid ${colors.gold}`;
                  boxStyle.backgroundColor = '#FAF7F0'; // Çok açık altın
                  boxStyle.color = colors.gold;
                } else if (isAvoid) {
                  boxStyle.backgroundColor = '#FAFAFA';
                  boxStyle.color = '#A0A0A0';
                }

                const DayContent = (
                  <div 
                    className={`relative flex flex-col items-center justify-start pt-3 pb-2 aspect-[4/3] md:aspect-[3/2] rounded-[16px] transition-all duration-300 ease-out ${isClickable ? 'hover:scale-[1.02]' : 'cursor-default'}`}
                    style={{
                      ...boxStyle,
                      boxShadow: isClickable ? 'hover:0 5px 15px rgba(212, 160, 23, 0.15)' : 'none'
                    }}
                  >
                    <span className="text-lg md:text-2xl font-serif">{day.dayNumber}</span>
                    <span className="text-[10px] opacity-60 mt-0.5">H. {day.hijriDay}</span>

                    {/* Alt Kısımdaki İkonlar */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center w-full">
                      {isGold && (
                        <GoldenCupIcon className="w-5 h-5 md:w-6 md:h-6" style={{ color: colors.gold }} />
                      )}
                      {!isGold && isSuitable && (
                        <Leaf className="w-3 h-3 md:w-4 md:h-4 opacity-70" style={{ color: colors.lightGreen }} strokeWidth={1.5} />
                      )}
                    </div>
                    
                    {/* Geçmişte kalan günlere ince bir çizgi */}
                    {day.isPast && isGold && (
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[16px]">
                        <div className="w-full h-[1px] bg-gray-300 rotate-45 transform origin-center absolute"></div>
                      </div>
                    )}
                  </div>
                );

                return isClickable ? (
                  <Link key={index} href={`/randevu?date=${day.dateString}`} title={day.label}>
                    {DayContent}
                  </Link>
                ) : (
                  <div key={index} title={day.label}>
                    {DayContent}
                  </div>
                );
              })}
            </div>

            {/* Legend (Açıklama Alanı) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: colors.border }}>
              {/* 1. Altın Hacamat Günü */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0" style={{ backgroundColor: '#FAF7F0', border: `1px solid ${colors.gold}` }}>
                  <GoldenCupIcon className="w-5 h-5" style={{ color: colors.gold }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: colors.text }}>Altın Hacamat</h4>
                  <p className="text-xs opacity-70" style={{ color: colors.text }}>Daha etkili destek için önerilen günler</p>
                </div>
              </div>

              {/* 2. Özel Gün (Sünnet) */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 bg-white" style={{ border: `1px solid ${colors.border}` }}>
                  <Leaf className="w-5 h-5" style={{ color: colors.lightGreen }} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: colors.text }}>Özel Gün (Sünnet)</h4>
                  <p className="text-xs opacity-70" style={{ color: colors.text }}>Hacamat yapılabilir</p>
                </div>
              </div>

              {/* 3. Uygun Gün */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 bg-[#F9FBF7]" style={{ border: `1px solid ${colors.border}` }}>
                  {/* Boş yeşilimsi kare temsili, veya sadece ince kenarlıklı beyaz kare */}
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: colors.text }}>Uygun Gün</h4>
                  <p className="text-xs opacity-70" style={{ color: colors.text }}>Hacamat yapılabilir</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
