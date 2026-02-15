import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Crown, Trophy, Flame, Star, Snowflake, Cpu, Skull, Gem, Sparkles, Infinity, Loader2 } from 'lucide-react';

// ==============================================
// 1. КОМПОНЕНТЫ ДЛЯ ЛАЙКОВ (Like Leaderboard)
// ==============================================

/**
 * Карточка одного лайкера. Содержит логику всех стилей (Tiers).
 */
const LikerCard = ({ data, rank }) => {
  const { name, avatar, count } = data;

  // Полная конфигурация стилей от 1 до 100,000+
  const getLeaderConfig = () => {
    // 100,000+ (INFINITY) - Бесконечность
    if (count >= 100000) return {
      container: 'border-2 border-white bg-gradient-to-r from-indigo-950/80 via-purple-900/80 to-indigo-950/80 shadow-[0_0_50px_rgba(255,255,255,0.4)]', 
      text: 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]',
      heart: 'text-white fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]',
      counter: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-fuchsia-200 to-fuchsia-400',
      badge: 'bg-white text-black border-white',
      icon: <Infinity size={14} className="text-black" />,
      effect: 'particles-prism'
    };

    // 50,000+ (PLASMA) - Плазма/Огонь
    if (count >= 50000) return {
      container: 'border-2 border-orange-500 bg-gradient-to-r from-red-900/60 via-orange-900/60 to-red-900/60 shadow-[0_0_50px_rgba(249,115,22,0.6)] animate-pulse-fast',
      text: 'text-orange-50 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]',
      heart: 'text-orange-500 fill-orange-600 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]',
      counter: 'text-white drop-shadow-md',
      badge: 'bg-orange-950 text-orange-200 border-orange-500',
      icon: <Flame size={14} className="text-orange-400" />,
      effect: 'particles-fire'
    };

    // 20,000+ (CRYSTAL) - Кристалл
    if (count >= 20000) return {
      container: 'border-2 border-cyan-300 bg-slate-900/80 shadow-[0_0_40px_rgba(34,211,238,0.5)]',
      text: 'text-cyan-50 font-black',
      heart: 'text-cyan-400 fill-cyan-500/50 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]',
      counter: 'text-white drop-shadow-md',
      badge: 'bg-cyan-950 text-cyan-200 border-cyan-400',
      icon: <Gem size={14} className="text-cyan-400" />,
      effect: 'particles-ice'
    };

    // 10,000+ (EMERALD) - Изумруд/Яд
    if (count >= 10000) return {
      container: 'border-2 border-emerald-400 bg-slate-900/80 shadow-[0_0_40px_rgba(52,211,153,0.4)]',
      text: 'text-emerald-50 font-bold',
      heart: 'text-emerald-500 fill-emerald-600 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]',
      counter: 'text-white',
      badge: 'bg-emerald-950 text-emerald-200 border-emerald-500',
      icon: <Sparkles size={14} className="text-emerald-400" />,
      effect: 'toxic-ooze'
    };

    // 5,000+ (GOLD) - Золото
    if (count >= 5000) return {
      container: 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-900/40 via-amber-900/50 to-yellow-900/40 shadow-[0_0_30px_rgba(250,204,21,0.5)]',
      text: 'text-yellow-50 font-black',
      heart: 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]',
      counter: 'text-white',
      badge: 'bg-yellow-950 text-yellow-200 border-yellow-400',
      icon: <Crown size={14} className="text-yellow-400" />,
      effect: 'particles-gold'
    };
    
    // 3,000+ (PURPLE) - Космос
    if (count >= 3000) return {
      container: 'border border-fuchsia-500 bg-slate-900/80 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
      text: 'text-fuchsia-100 font-bold',
      heart: 'text-fuchsia-500 fill-fuchsia-600',
      counter: 'text-white',
      badge: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500',
      icon: <Star size={14} className="text-fuchsia-400" />,
      effect: null
    };

    // 1,000+ (BLUE) - Кибер
    if (count >= 1000) return {
      container: 'border border-blue-500 bg-slate-900/80 shadow-[0_0_15px_rgba(59,130,246,0.4)]', 
      text: 'text-blue-100 font-bold',
      heart: 'text-blue-500 fill-blue-600',
      counter: 'text-white',
      badge: 'bg-blue-950 text-blue-300 border-blue-500',
      icon: <Cpu size={14} className="text-blue-400" />,
      effect: null
    };
    
    // 500+ (PINK) - Поп-звезда
    if (count >= 500) return {
      container: 'border border-pink-500 bg-slate-900/70 shadow-[0_0_10px_rgba(236,72,153,0.4)]', 
      text: 'text-pink-100 font-bold',
      heart: 'text-pink-500 fill-pink-600',
      counter: 'text-white',
      badge: 'bg-pink-950 text-pink-300 border-pink-500',
      icon: <Zap size={14} className="text-pink-400" />,
      effect: null
    };

    // 200+ (CYAN) - Лед
    if (count >= 200) return {
      container: 'border border-cyan-600 bg-slate-900/70 shadow-lg',
      text: 'text-cyan-50 font-semibold',
      heart: 'text-cyan-400 fill-cyan-500',
      counter: 'text-white',
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-600',
      icon: <Snowflake size={14} className="text-cyan-400" />,
      effect: null
    };

    // 100+ (RED) - Огонек
    if (count >= 100) return {
      container: 'border border-red-600 bg-slate-900/70 shadow-lg',
      text: 'text-red-50 font-semibold',
      heart: 'text-red-500 fill-red-600',
      counter: 'text-white',
      badge: 'bg-red-950 text-red-300 border-red-600',
      icon: <Flame size={14} className="text-red-400" />,
      effect: null
    };

    // 50+ (BRONZE)
    if (count >= 50) return {
      container: 'border border-orange-700 bg-slate-900/70 shadow-lg',
      text: 'text-orange-100 font-semibold',
      heart: 'text-orange-600 fill-orange-700',
      counter: 'text-white',
      badge: 'bg-slate-800 text-orange-300 border-orange-700',
      icon: <Medal size={14} className="text-orange-500" />,
      effect: null
    };

    // < 50 (DEFAULT)
    return {
      container: 'border border-slate-600 bg-slate-900/70 shadow-lg',
      text: 'text-slate-200 font-semibold',
      heart: 'text-slate-400 fill-slate-500',
      counter: 'text-slate-200',
      badge: 'bg-slate-800 text-slate-300 border-slate-600',
      icon: <Trophy size={14} className="text-slate-400" />,
      effect: null
    };
  };

  // --- РЕНДЕР: 1 МЕСТО (Король) ---
  if (rank === 1) {
    const styles = getLeaderConfig();
    return (
      <div className="relative z-30 mb-6 transition-all duration-500 animate-slide-in ml-2">
        {/* ФОНОВЫЕ ЭФФЕКТЫ */}
        {styles.effect === 'particles-gold' && (
          <>
             <div className="absolute top-0 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-float-particle-1 opacity-80"></div>
             <div className="absolute bottom-2 right-20 w-1.5 h-1.5 bg-amber-200 rounded-full animate-float-particle-2 opacity-60"></div>
          </>
        )}
        {styles.effect === 'particles-prism' && (
          <div className="absolute inset-0 overflow-visible pointer-events-none">
             <div className="absolute top-0 right-10 w-4 h-4 bg-white rounded-full animate-pulse blur-[3px] opacity-80"></div>
             <div className="absolute bottom-0 left-20 w-3 h-3 bg-fuchsia-400 rounded-full animate-float-particle-1 blur-[2px] opacity-60"></div>
          </div>
        )}
        {styles.effect === 'particles-fire' && (
          <div className="absolute -bottom-4 left-1/2 w-full h-10 bg-orange-500/20 blur-xl rounded-full animate-pulse"></div>
        )}
        {styles.effect === 'toxic-ooze' && (
          <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full animate-pulse"></div>
        )}

        {/* Карточка */}
        <div 
          className={`
            relative w-[440px] h-32 flex items-center rounded-full pl-4 pr-6 py-2 overflow-visible
            transition-all duration-500 origin-left backdrop-blur-sm
            ${styles.container}
          `}
        >
          {/* Аватар */}
          <div className="relative shrink-0 mr-5">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 animate-bounce-slow">
               <Crown size={36} className={`drop-shadow-lg ${count >= 50000 ? 'text-white fill-white' : count >= 5000 ? 'text-amber-300 fill-amber-500' : 'text-yellow-400 fill-yellow-400'}`} />
             </div>
             <div className="p-1 rounded-full">
               <img src={avatar} className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover relative z-10 shadow-2xl bg-slate-800" alt="avatar" />
             </div>
             
             {/* Бейдж TOP */}
             <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-black px-3 py-1 rounded-full shadow-lg border z-20 whitespace-nowrap flex items-center gap-1 ${styles.badge}`}>
               {styles.icon}
               TOP 1
             </div>
          </div>

          {/* Инфо */}
          <div className="flex-1 min-w-0 flex flex-col justify-center relative z-20">
             <span className={`text-2xl leading-tight mb-1 truncate transition-colors duration-300 ${styles.text}`}>{name}</span>
             <span className="text-sm text-slate-400 font-medium">Король лайков</span>
          </div>

          {/* СЧЕТЧИК (СЕРДЦЕ + ЦИФРА СВЕРХУ) */}
          <div className="relative flex items-center justify-center w-24 h-24 z-20 shrink-0">
             <Heart 
               className={`w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-fast transition-colors duration-500 ${styles.heart}`} 
               strokeWidth={1.5}
             />
             <div className="relative z-10 flex flex-col items-center justify-center">
                <span 
                    key={count} 
                    className={`text-3xl font-black italic tracking-tighter animate-combo-bounce ${styles.counter}`}
                    style={{ 
                        textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
                        WebkitTextStroke: '1px rgba(0,0,0,0.2)'
                    }}
                >
                {count > 9999 ? `${(count/1000).toFixed(1)}k` : count}
                </span>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest drop-shadow-md">Likes</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- РЕНДЕР: 2 МЕСТО (Серебро) ---
  if (rank === 2) {
    return (
      <div 
        className="relative z-20 mb-3 ml-4 w-[360px] h-16 bg-slate-900/80 backdrop-blur-sm border-2 border-slate-400/50 rounded-full flex items-center px-2 shadow-lg transition-all duration-300 animate-slide-in"
      >
        <div className="relative shrink-0 mr-3">
           <img src={avatar} className="w-12 h-12 rounded-full border-2 border-slate-400 object-cover" alt="avatar" />
           <div className="absolute -bottom-1 -right-1 bg-slate-300 text-slate-900 text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-sm">
             2
           </div>
        </div>
        <div className="flex-1 min-w-0">
           <span className="text-slate-200 font-bold text-sm block truncate">{name}</span>
        </div>
        <div className="pr-4 flex items-center gap-1.5">
           <Heart size={16} className="text-slate-400 fill-slate-400 animate-pulse" />
           <span key={count} className="text-xl font-bold text-slate-300 animate-combo-bounce">{count}</span>
        </div>
      </div>
    );
  }

  // --- РЕНДЕР: 3-15 МЕСТО (УЛЬТРА-КОМПАКТНЫЕ) ---
  return (
    <div 
      className="relative z-10 mb-1.5 ml-6 w-[240px] h-10 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-r-full rounded-l-md flex items-center px-2 transition-all duration-300 animate-slide-in"
    >
      {/* Rank */}
      <div className="relative shrink-0 w-6 flex justify-center">
         <span className={`font-black text-xs italic ${rank === 3 ? 'text-amber-500 drop-shadow' : 'text-slate-600'}`}>#{rank}</span>
      </div>
      
      {/* Avatar */}
      <div className="relative shrink-0 mr-2">
         <img src={avatar} className={`w-8 h-8 rounded-full border object-cover ${rank === 3 ? 'border-amber-500/50' : 'border-slate-600'}`} alt="avatar" />
      </div>
      
      {/* Name */}
      <div className="flex-1 min-w-0 mr-2">
         <span className={`font-bold text-[11px] block truncate ${rank === 3 ? 'text-slate-200' : 'text-slate-400'}`}>{name}</span>
      </div>
      
      {/* Likes Capsule (УВЕЛИЧЕННАЯ) */}
      <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800 shadow-inner min-w-[70px] justify-center">
         <Heart size={14} className="text-rose-500 fill-rose-500" />
         <span key={count} className="text-xs font-black text-slate-200 animate-combo-bounce">{count > 9999 ? `${(count/1000).toFixed(0)}k` : count}</span>
      </div>
    </div>
  );
};

// Компонент списка лайков (обертка)
const LikeOverlay = () => {
  // Logic is handled in parent App component via state sharing, 
  // but for cleaner separation, App passes data or we use context.
  // In this single-file version, App renders the list directly.
  return null; 
};

// ==============================================
// 2. КОМПОНЕНТЫ ДЛЯ ПОДАРКОВ (Gift Overlay)
// ==============================================

const GiftCard = ({ data, onRemove }) => {
  const { user, gift, combo, id } = data;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsExiting(false);
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(id), 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [combo, id, onRemove]);

  const intensity = combo >= 50 ? 'border-amber-400 bg-gradient-to-r from-red-900/80 to-slate-900' : 
                    combo >= 10 ? 'border-yellow-400 bg-slate-900/90' : 
                    'border-purple-500 bg-slate-900/80';

  return (
    <div className={`relative w-[400px] h-24 flex items-center mb-6 transition-all duration-500 ease-out z-50 ${isExiting ? 'opacity-0 translate-x-[-100%]' : 'opacity-100 translate-x-0 animate-slide-in'}`} style={{ zIndex: combo }}>
      <div className={`flex items-center backdrop-blur-md border rounded-full pl-2 pr-6 py-2 relative overflow-visible w-full transition-all duration-300 ${intensity} shadow-2xl`}>
        {/* Аватар */}
        <div className="relative shrink-0">
          <img src={user.avatar} alt="Avatar" className={`w-14 h-14 rounded-full border-2 object-cover z-10 relative border-white`} />
        </div>
        {/* Текст */}
        <div className="ml-3 mr-6 flex flex-col justify-center min-w-0 flex-1">
          <span className="font-bold text-base leading-tight truncate text-white">{user.name}</span>
          <span className="text-xs text-slate-300 font-medium truncate">sent <span className="font-bold text-white">{gift.name}</span></span>
        </div>
        {/* Подарок + Комбо */}
        <div className={`relative -mr-8 -my-8 z-30 group shrink-0 transition-transform duration-200 ${combo >= 10 ? 'scale-125' : 'scale-110'}`}>
           <img key={combo} src={gift.image} className="w-24 h-24 object-contain drop-shadow-2xl z-10 relative animate-elastic-pop origin-bottom" alt="Gift" />
           <div className="absolute bottom-2 right-0 flex flex-col items-center justify-center pointer-events-none">
              <div key={combo} className={`text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-400 drop-shadow-lg animate-combo-bounce`}>
                x{combo}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GiftOverlay = ({ username, gifts, removeGift }) => {
  return (
    <div className="absolute left-6 top-16 flex flex-col items-start">
      {gifts.length === 0 && (
        <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-sm p-4 rounded-xl border border-purple-500/30">
           <span className="text-purple-200 font-semibold text-xs tracking-widest uppercase animate-pulse">Waiting for gifts...</span>
        </div>
      )}
      {gifts.map(g => <GiftCard key={g.id} data={g} onRemove={removeGift} />)}
    </div>
  );
};

// ==============================================
// 3. ГЛАВНОЕ ПРИЛОЖЕНИЕ (ROUTING + WS + LOGIC)
// ==============================================

export default function App() {
  // State for Likes
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]);

  // State for Gifts
  const [gifts, setGifts] = useState([]);
  const giftsRef = useRef([]);

  // General State
  const [mode, setMode] = useState('likes'); // 'likes' | 'gift'
  const [targetUsername, setTargetUsername] = useState('');
  const [status, setStatus] = useState('connecting');

  // --- HANDLER: LIKES ---
  const handleLike = useCallback((username, avatarUrl, amount) => {
    const currentUsers = [...usersRef.current];
    const existingIndex = currentUsers.findIndex(u => u.name === username);
    
    if (existingIndex >= 0) {
      currentUsers[existingIndex].count += amount;
      currentUsers[existingIndex].lastUpdate = Date.now();
    } else {
      currentUsers.push({ 
        id: username, 
        name: username, 
        avatar: avatarUrl || 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7065997232230301701~c5_100x100.jpeg', 
        count: amount, 
        lastUpdate: Date.now() 
      });
    }
    
    // Sort & Limit
    currentUsers.sort((a, b) => b.count - a.count);
    if (currentUsers.length > 50) currentUsers.length = 50; // Keep memory low
    
    usersRef.current = currentUsers;
    setUsers([...currentUsers]);
  }, []);

  // --- HANDLER: GIFTS ---
  const handleGift = useCallback((sender, avatar, giftName, giftImg, combo) => {
    const currentGifts = [...giftsRef.current];
    const uniqueKey = `${sender}-${giftName}`;
    const existingIndex = currentGifts.findIndex(g => g.uniqueKey === uniqueKey);

    if (existingIndex >= 0) {
      currentGifts[existingIndex].combo = combo;
      currentGifts[existingIndex].trigger = Date.now();
    } else {
      const newGift = {
        id: Date.now(),
        uniqueKey,
        user: { name: sender, avatar },
        gift: { name: giftName, image: giftImg },
        combo
      };
      currentGifts.push(newGift);
    }

    if (currentGifts.length > 2) currentGifts.shift();

    giftsRef.current = currentGifts;
    setGifts([...currentGifts]);
  }, []);

  const removeGift = useCallback((id) => {
    const filtered = giftsRef.current.filter(g => g.id !== id);
    giftsRef.current = filtered;
    setGifts([...filtered]);
  }, []);

  // --- WEBSOCKET CONNECTION ---
  useEffect(() => {
    const path = window.location.pathname;
    let user = '';
    
    if (path.startsWith('/gift/')) {
      setMode('gift');
      user = path.split('/gift/')[1];
    } else {
      setMode('likes');
      user = path.substring(1) || new URLSearchParams(window.location.search).get('u');
    }

    if (!user) { setStatus('error'); return; }
    setTargetUsername(user);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      setStatus('connected');
      ws.send(JSON.stringify({ type: 'connect', username: user }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.targetUser === user) {
        if (data.type === 'like') {
          // Вычисляем дельту или просто добавляем 1, если TikTok не прислал total
          const amount = 1; // Упрощенно считаем каждый эвент за лайк/батч
          handleLike(data.nickname, data.profilePictureUrl, amount);
        }
        if (data.type === 'gift') {
          handleGift(data.nickname, data.profilePictureUrl, data.giftName, data.giftPictureUrl, data.repeatCount);
        }
      }
    };

    ws.onclose = () => setStatus('disconnected');
    
    // Debug helpers
    window.onTikTokLike = (username, avatar, count) => handleLike(username, avatar, count);
    window.onTikTokGift = (username, avatar, giftName, img, combo) => handleGift(username, avatar, giftName, img, combo);

    return () => {
      ws.close();
      window.onTikTokLike = null;
      window.onTikTokGift = null;
    };
  }, [handleLike, handleGift]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-100 overflow-hidden relative">
      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -5px); } }
        @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }
        @keyframes combo-bounce { 0% { transform: scale(1); } 30% { transform: scale(1.4); } 60% { transform: scale(0.9); } 100% { transform: scale(1); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes elastic-pop { 0% { transform: scale(0.8); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes float-particle-1 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } }
        @keyframes float-particle-2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-15px) translateX(-5px); } }
      `}</style>

      {/* --- STATUS INDICATOR (Hidden if connected/data exists) --- */}
      {status !== 'connected' && (
        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs text-white z-50">
          Status: {status}
        </div>
      )}

      {/* --- GIFT MODE --- */}
      {mode === 'gift' && (
        <GiftOverlay username={targetUsername} gifts={gifts} removeGift={removeGift} />
      )}

      {/* --- LIKE MODE (DEFAULT) --- */}
      {mode === 'likes' && (
        <>
          {users.length === 0 && status === 'connected' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-pulse">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="text-white font-bold text-sm">Waiting for likes for @{targetUsername}...</span>
              </div>
            </div>
          )}
          <div className="absolute left-6 top-16 flex flex-col items-start scale-75 origin-top-left transition-all duration-500">
            {users.slice(0, 15).map((user, index) => (
              <LikerCard key={user.id} data={user} rank={index + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
