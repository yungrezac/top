import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Crown, Trophy, Flame, Star, Snowflake, Cpu, Gem, Sparkles, Infinity, Loader2, Zap, Medal, Swords, Timer, Volume2, WifiOff } from 'lucide-react';

// ==============================================
// 1. КОМПОНЕНТЫ ДЛЯ ЛАЙКОВ (LikerCard)
// ==============================================

const LikerCard = ({ data, rank }) => {
  const { name, avatar, count } = data;

  const getLeaderConfig = () => {
    if (count >= 100000) return {
      container: 'border-2 border-white bg-gradient-to-r from-indigo-950/80 via-purple-900/80 to-indigo-950/80 shadow-[0_0_50px_rgba(255,255,255,0.4)]', 
      text: 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]',
      heart: 'text-white fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]',
      counter: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-fuchsia-200 to-fuchsia-400',
      badge: 'bg-white text-black border-white',
      icon: <Infinity size={14} className="text-black" />,
    };
    if (count >= 50000) return {
      container: 'border-2 border-orange-500 bg-gradient-to-r from-red-900/60 via-orange-900/60 to-red-900/60 shadow-[0_0_50px_rgba(249,115,22,0.6)] animate-pulse-fast',
      text: 'text-orange-50 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]',
      heart: 'text-orange-500 fill-orange-600 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]',
      counter: 'text-white drop-shadow-md',
      badge: 'bg-orange-950 text-orange-200 border-orange-500',
      icon: <Flame size={14} className="text-orange-400" />,
    };
    if (count >= 20000) return {
      container: 'border-2 border-cyan-300 bg-slate-900/80 shadow-[0_0_40px_rgba(34,211,238,0.5)]',
      text: 'text-cyan-50 font-black',
      heart: 'text-cyan-400 fill-cyan-500/50 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]',
      counter: 'text-white drop-shadow-md',
      badge: 'bg-cyan-950 text-cyan-200 border-cyan-400',
      icon: <Gem size={14} className="text-cyan-400" />,
    };
    if (count >= 10000) return {
      container: 'border-2 border-emerald-400 bg-slate-900/80 shadow-[0_0_40px_rgba(52,211,153,0.4)]',
      text: 'text-emerald-50 font-bold',
      heart: 'text-emerald-500 fill-emerald-600 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]',
      counter: 'text-white',
      badge: 'bg-emerald-950 text-emerald-200 border-emerald-500',
      icon: <Sparkles size={14} className="text-emerald-400" />,
    };
    if (count >= 5000) return {
      container: 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-900/40 via-amber-900/50 to-yellow-900/40 shadow-[0_0_30px_rgba(250,204,21,0.5)]',
      text: 'text-yellow-50 font-black',
      heart: 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]',
      counter: 'text-white',
      badge: 'bg-yellow-950 text-yellow-200 border-yellow-400',
      icon: <Crown size={14} className="text-yellow-400" />,
    };
    if (count >= 3000) return {
      container: 'border border-fuchsia-500 bg-slate-900/80 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
      text: 'text-fuchsia-100 font-bold',
      heart: 'text-fuchsia-500 fill-fuchsia-600',
      counter: 'text-white',
      badge: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500',
      icon: <Star size={14} className="text-fuchsia-400" />,
    };
    if (count >= 1000) return {
      container: 'border border-blue-500 bg-slate-900/80 shadow-[0_0_15px_rgba(59,130,246,0.4)]', 
      text: 'text-blue-100 font-bold',
      heart: 'text-blue-500 fill-blue-600',
      counter: 'text-white',
      badge: 'bg-blue-950 text-blue-300 border-blue-500',
      icon: <Cpu size={14} className="text-blue-400" />,
    };
    if (count >= 500) return {
      container: 'border border-pink-500 bg-slate-900/70 shadow-[0_0_10px_rgba(236,72,153,0.4)]', 
      text: 'text-pink-100 font-bold',
      heart: 'text-pink-500 fill-pink-600',
      counter: 'text-white',
      badge: 'bg-pink-950 text-pink-300 border-pink-500',
      icon: <Zap size={14} className="text-pink-400" />,
    };
    if (count >= 200) return {
      container: 'border border-cyan-600 bg-slate-900/70 shadow-lg',
      text: 'text-cyan-50 font-semibold',
      heart: 'text-cyan-400 fill-cyan-500',
      counter: 'text-white',
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-600',
      icon: <Snowflake size={14} className="text-cyan-400" />,
    };
    if (count >= 100) return {
      container: 'border border-red-600 bg-slate-900/70 shadow-lg',
      text: 'text-red-50 font-semibold',
      heart: 'text-red-500 fill-red-600',
      counter: 'text-white',
      badge: 'bg-red-950 text-red-300 border-red-600',
      icon: <Flame size={14} className="text-red-400" />,
    };
    if (count >= 50) return {
      container: 'border border-orange-700 bg-slate-900/70 shadow-lg',
      text: 'text-orange-100 font-semibold',
      heart: 'text-orange-600 fill-orange-700',
      counter: 'text-white',
      badge: 'bg-slate-800 text-orange-300 border-orange-700',
      icon: <Medal size={14} className="text-orange-500" />,
    };
    return {
      container: 'border border-slate-600 bg-slate-900/70 shadow-lg',
      text: 'text-slate-200 font-semibold',
      heart: 'text-slate-400 fill-slate-500',
      counter: 'text-slate-200',
      badge: 'bg-slate-800 text-slate-300 border-slate-600',
      icon: <Trophy size={14} className="text-slate-400" />,
    };
  };

  const styles = getLeaderConfig();

  return (
    <div 
      className={`relative z-10 mb-1.5 ml-0 w-[280px] h-11 backdrop-blur-sm rounded-r-full rounded-l-md flex items-center px-2 transition-all duration-300 animate-slide-in ${styles.container}`}
    >
      <div className="relative shrink-0 w-8 flex justify-center">
         <span className={`font-black text-xs italic ${rank === 3 ? 'text-amber-500 drop-shadow' : 'text-slate-400'}`}>#{rank}</span>
      </div>
      <div className="relative shrink-0 mr-2">
         <img src={avatar} className={`w-8 h-8 rounded-full border object-cover ${rank === 3 ? 'border-amber-500/50' : 'border-slate-600'}`} alt="avatar" />
      </div>
      <div className="flex-1 min-w-0 mr-2">
         <span className={`font-bold text-[11px] block truncate ${styles.text}`}>{name}</span>
      </div>
      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10 shadow-inner min-w-[70px] justify-center">
         <div className="animate-pulse">{styles.icon}</div>
         <span key={count} className={`text-xs font-black animate-combo-bounce ${styles.counter}`}>
           {count > 9999 ? `${(count/1000).toFixed(1)}k` : count}
         </span>
      </div>
    </div>
  );
};

// ==============================================
// 2. КОМПОНЕНТЫ ДЛЯ ПОДАРКОВ (GiftOverlay)
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
    <div className={`relative w-[400px] h-24 flex items-center mb-6 transition-all duration-500 ease-out z-50 ${isExiting ? 'opacity-0 translate-y-10' : 'opacity-100 translate-x-0 animate-slide-in-left'}`} style={{ zIndex: combo }}>
      <div className={`flex items-center backdrop-blur-md border rounded-full pl-2 pr-6 py-2 relative overflow-visible w-full transition-all duration-300 ${intensity} shadow-2xl`}>
        <div className="relative shrink-0">
          <img src={user.avatar} alt="Avatar" className={`w-14 h-14 rounded-full border-2 object-cover z-10 relative border-white`} />
        </div>
        <div className="ml-4 mr-6 flex flex-col justify-center min-w-0 flex-1">
          <span className="font-black text-2xl leading-tight truncate text-white drop-shadow-md">{user.name}</span>
          <span className="text-lg text-slate-200 font-bold truncate">
            sent <span className="font-black text-white">{gift.name}</span>
          </span>
        </div>
        <div className={`relative -mr-8 -my-8 z-30 group shrink-0 transition-transform duration-200 ${combo >= 10 ? 'scale-125' : 'scale-110'}`}>
           <img key={combo} src={gift.image} className="w-24 h-24 object-contain drop-shadow-2xl z-10 relative animate-elastic-pop origin-bottom" alt="Gift" />
           <div className="absolute -top-8 right-0 flex flex-col items-center justify-center pointer-events-none">
              <div key={combo} className={`text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-400 drop-shadow-lg animate-combo-bounce`}>
                x{combo}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GiftOverlay = ({ gifts, removeGift }) => {
  return (
    <div className="absolute left-6 top-16 flex flex-col items-start z-[100]">
      {gifts.map(g => <GiftCard key={g.id} data={g} onRemove={removeGift} />)}
    </div>
  );
};

// ==============================================
// 3. БАТТЛ КОМПОНЕНТЫ (Throne, Versus)
// ==============================================

const ChampionThrone = ({ champion, currentLeader }) => {
  if (!champion && !currentLeader) return null;

  const isNewKing = currentLeader && (!champion || currentLeader.count > champion.count);
  const displayUser = isNewKing ? currentLeader : champion;
  const title = isNewKing ? "НОВЫЙ ЛИДЕР" : "КОРОЛЬ ЧАСА";
  const subTitle = isNewKing ? "Удерживает трон!" : `Цель: побить ${champion?.count}`;

  return (
    // Убрал абсолютное позиционирование, теперь это часть флекс-колонки
    <div className="relative z-40 animate-slide-in-top w-full max-w-[450px]">
      <div className={`
        relative flex items-center gap-4 px-6 py-3 rounded-2xl border-2 
        ${isNewKing ? 'bg-gradient-to-r from-yellow-900/90 to-amber-600/90 border-yellow-400' : 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-500'}
        shadow-[0_10px_40px_rgba(0,0,0,0.5)]
      `}>
        <div className="relative">
          <Crown size={32} className={`absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce ${isNewKing ? 'text-yellow-300' : 'text-slate-400'}`} />
          <img 
            src={displayUser.avatar} 
            className={`w-16 h-16 rounded-full border-4 object-cover ${isNewKing ? 'border-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.6)]' : 'border-slate-400 grayscale-[0.3]'}`} 
            alt="King" 
          />
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className={`text-[10px] font-black tracking-widest uppercase mb-0.5 ${isNewKing ? 'text-yellow-200' : 'text-slate-400'}`}>
            {title}
          </span>
          <span className="text-xl font-black text-white drop-shadow-md truncate w-full leading-none mb-1">
            {displayUser.name}
          </span>
          <div className="flex items-center gap-2 bg-black/30 px-2 py-0.5 rounded text-sm">
            <Heart size={12} className={isNewKing ? "text-red-500 fill-red-500" : "text-slate-500"} />
            <span className="font-mono font-bold text-white">{displayUser.count}</span>
            <span className="text-[10px] opacity-70 ml-1 border-l pl-2 border-white/20">{subTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VersusBar = ({ user1, user2 }) => {
  if (!user1) return null;

  const score1 = user1.count;
  const score2 = user2 ? user2.count : 0;
  const total = score1 + score2;
  let percent1 = total === 0 ? 50 : (score1 / total) * 100;
  percent1 = Math.max(10, Math.min(90, percent1));

  return (
    // Убрал фиксированные отступы и ширину, теперь адаптивно в колонке
    <div className="w-full max-w-[450px] relative z-30 animate-slide-in my-2">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="bg-red-600 text-white font-black text-lg italic px-2 py-0.5 rounded skew-x-[-12deg] shadow-lg border-2 border-white flex items-center gap-1">
          <Swords size={16} /> VS
        </div>
      </div>

      <div className="flex justify-between items-end mb-2 px-1">
        <div className="flex items-center gap-2 max-w-[45%]">
          <img src={user1.avatar} className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
          <div className="flex flex-col min-w-0">
            <span className="text-blue-100 font-bold text-xs truncate">{user1.name}</span>
            <span className="text-xl font-black text-white leading-none">{user1.count}</span>
          </div>
        </div>

        {user2 && (
          <div className="flex items-center gap-2 flex-row-reverse text-right max-w-[45%]">
            <img src={user2.avatar} className="w-10 h-10 rounded-full border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
            <div className="flex flex-col min-w-0">
              <span className="text-rose-100 font-bold text-xs truncate">{user2.name}</span>
              <span className="text-xl font-black text-white leading-none">{user2.count}</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-full bg-slate-800 rounded-full overflow-hidden relative border border-slate-600 flex shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-800 to-blue-500 transition-all duration-700 ease-out relative"
          style={{ width: `${percent1}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]"></div>
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-400 blur-md rounded-full opacity-70"></div>
        </div>
        <div className="flex-1 h-full bg-gradient-to-l from-rose-900 to-rose-600 relative"></div>
      </div>
    </div>
  );
};

// ==============================================
// 4. ГЛАВНОЕ ПРИЛОЖЕНИЕ (Logic Glue)
// ==============================================

export default function App() {
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]); 
  const [gifts, setGifts] = useState([]);
  const giftsRef = useRef([]);

  const [champion, setChampion] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('connecting');
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [targetUsername, setTargetUsername] = useState('');
  
  // Режим работы: 'likes' (основной) или 'gift' (отдельный виджет)
  const [mode, setMode] = useState('likes'); 

  // --- BATTLE LOGIC ---
  const finishRound = useCallback(() => {
    const currentLeader = usersRef.current[0];
    if (currentLeader) {
      setChampion(currentLeader);
      const text = `Битва окончена! Победитель ${currentLeader.name}, набравший ${currentLeader.count} лайков!`;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        window.speechSynthesis.speak(utterance);
      }
    }
    usersRef.current = [];
    setUsers([]);
    console.log("Round finished. Resetting data.");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      if (minutes === 59 && seconds === 59) {
        finishRound();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [finishRound]);

  // --- DATA HANDLERS ---
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
    currentUsers.sort((a, b) => b.count - a.count);
    if (currentUsers.length > 50) currentUsers.length = 50;
    usersRef.current = currentUsers;
    setUsers([...currentUsers]);
  }, []);

  const handleGift = useCallback((sender, avatar, giftName, giftImg, combo) => {
    const currentGifts = [...giftsRef.current];
    const uniqueKey = `${sender}-${giftName}`;
    const existingIndex = currentGifts.findIndex(g => g.uniqueKey === uniqueKey);

    if (existingIndex >= 0) {
      currentGifts[existingIndex].combo = combo;
      currentGifts[existingIndex].trigger = Date.now();
    } else {
      const newGift = { id: Date.now(), uniqueKey, user: { name: sender, avatar }, gift: { name: giftName, image: giftImg }, combo };
      currentGifts.push(newGift);
    }
    if (currentGifts.length > 3) currentGifts.shift();
    giftsRef.current = currentGifts;
    setGifts([...currentGifts]);
  }, []);

  const removeGift = useCallback((id) => {
    const filtered = giftsRef.current.filter(g => g.id !== id);
    giftsRef.current = filtered;
    setGifts([...filtered]);
  }, []);

  // --- WEBSOCKET & ROUTING ---
  const reconnectTimeoutRef = useRef(null);
  const wsRef = useRef(null);

  const connectWebSocket = useCallback((user) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      ws.send(JSON.stringify({ type: 'connect', username: user }));
      if (reconnectTimeoutRef.current) { clearTimeout(reconnectTimeoutRef.current); reconnectTimeoutRef.current = null; }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.targetUser === user) {
          if (data.type === 'like') handleLike(data.nickname, data.profilePictureUrl, data.likeCount || 1);
          if (data.type === 'gift') handleGift(data.nickname, data.profilePictureUrl, data.giftName, data.giftPictureUrl, data.repeatCount);
        }
      } catch (e) { console.error(e); }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      reconnectTimeoutRef.current = setTimeout(() => connectWebSocket(user), 3000);
    };
  }, [handleLike, handleGift]);

  useEffect(() => {
    const path = window.location.pathname;
    let user = '';

    // ОПРЕДЕЛЕНИЕ РЕЖИМА И ЮЗЕРА ПО URL
    if (path.startsWith('/gift/')) {
      setMode('gift');
      user = path.split('/gift/')[1];
    } else {
      setMode('likes');
      user = path.substring(1) || new URLSearchParams(window.location.search).get('u');
    }

    if (user) {
      setTargetUsername(user);
      connectWebSocket(user);
    } else {
      setStatus('error');
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connectWebSocket]);

  const enableAudio = () => {
    setIsTTSActive(true);
    const u = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(u);
  };

  // Данные для рендера
  const leader = users[0];
  const second = users[1];
  const others = users.slice(2, 12); 

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-100 overflow-hidden relative">
      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -5px); } }
        @keyframes pulse-fast { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }
        @keyframes combo-bounce { 0% { transform: scale(1); } 30% { transform: scale(1.4); } 60% { transform: scale(0.9); } 100% { transform: scale(1); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-top { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes elastic-pop { 0% { transform: scale(0.8); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>

      {/* --- ОБЩИЕ ЭЛЕМЕНТЫ (Аудио, Статус) --- */}
      {mode === 'likes' && !isTTSActive && (
        <button onClick={enableAudio} className="absolute top-4 right-4 z-[60] bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg animate-pulse" title="Включить звук">
          <Volume2 size={20} />
        </button>
      )}

      {status === 'disconnected' && (
        <div className="absolute top-4 right-16 bg-red-900/80 p-2 rounded-full text-xs text-white z-50 flex items-center gap-2 border border-red-500">
          <WifiOff size={14} /> <span>Reconnecting...</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* РЕЖИМ 1: GIFTS ONLY (Если url /gift/...) */}
      {/* ========================================================= */}
      {mode === 'gift' && (
        <GiftOverlay gifts={gifts} removeGift={removeGift} />
      )}

      {/* ========================================================= */}
      {/* РЕЖИМ 2: LIKES BATTLE ONLY (Основной url) */}
      {/* ========================================================= */}
      {mode === 'likes' && (
        <div className="absolute top-6 left-6 flex flex-col items-start gap-4">
          
          {/* 1. ТАЙМЕР */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-sm font-mono text-white/80">
            <Timer size={14} className="text-amber-400" />
            <span>ROUND: <span className="text-white font-bold">{timeLeft}</span></span>
          </div>

          {/* 2. ТРОН ЧЕМПИОНА (ТЕПЕРЬ ТУТ, НАД СПИСКОМ) */}
          <ChampionThrone champion={champion} currentLeader={leader} />

          {/* 3. БАР ПРОТИВОСТОЯНИЯ (1 VS 2) */}
          {users.length > 0 ? (
            <VersusBar user1={leader} user2={second} />
          ) : (
             <div className="flex items-center gap-3 text-slate-400 animate-pulse py-4">
               <Loader2 className="animate-spin" />
               <span>Ждем лайков для @{targetUsername}...</span>
             </div>
          )}

          {/* 4. СПИСОК ОСТАЛЬНЫХ */}
          <div className="flex flex-col items-start w-full pl-0 mt-2">
            {others.map((u, i) => (
              <LikerCard key={u.id} data={u} rank={i + 3} />
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
