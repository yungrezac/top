import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Crown, Trophy, Flame, Star, Snowflake, Cpu, Skull, Gem, Sparkles, Infinity, Loader2 } from 'lucide-react';

const LikerCard = ({ data, rank }) => {
  const { name, avatar, count } = data;
  const getLeaderConfig = () => {
    if (count >= 100000) return { container: 'border-2 border-white bg-gradient-to-r from-indigo-950/80 via-purple-900/80 to-indigo-950/80 shadow-[0_0_50px_rgba(255,255,255,0.4)]', text: 'text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]', heart: 'text-white fill-white', counter: 'text-transparent bg-clip-text bg-gradient-to-b from-white via-fuchsia-200 to-fuchsia-400', badge: 'bg-white text-black border-white', icon: <Infinity size={14} className="text-black" />, effect: 'particles-prism' };
    if (count >= 5000) return { container: 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-900/40 via-amber-900/50 to-yellow-900/40 shadow-[0_0_30px_rgba(250,204,21,0.5)]', text: 'text-yellow-50 font-black', heart: 'text-yellow-500 fill-yellow-500', counter: 'text-white', badge: 'bg-yellow-950 text-yellow-200 border-yellow-400', icon: <Crown size={14} className="text-yellow-400" />, effect: 'particles-gold' };
    return { container: 'border border-slate-600 bg-slate-900/70 shadow-lg', text: 'text-slate-200 font-semibold', heart: 'text-slate-400 fill-slate-500', counter: 'text-slate-200', badge: 'bg-slate-800 text-slate-300 border-slate-600', icon: <Trophy size={14} className="text-slate-400" />, effect: null };
  };

  if (rank === 1) {
    const styles = getLeaderConfig();
    return (
      <div className="relative z-30 mb-6 transition-all duration-500 animate-slide-in ml-2">
        <div className={`relative w-[440px] h-32 flex items-center rounded-full pl-4 pr-6 py-2 overflow-visible transition-all duration-500 origin-left backdrop-blur-sm ${styles.container}`}>
          <div className="relative shrink-0 mr-5">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 animate-bounce-slow"><Crown size={36} className="text-yellow-400 fill-yellow-400" /></div>
             <img src={avatar} className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover relative z-10 shadow-2xl bg-slate-800" alt="avatar" />
             <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-black px-3 py-1 rounded-full shadow-lg border z-20 flex items-center gap-1 ${styles.badge}`}>{styles.icon} TOP 1</div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center relative z-20">
             <span className={`text-2xl leading-tight mb-1 truncate transition-colors duration-300 ${styles.text}`}>{name}</span>
             <span className="text-sm text-slate-400 font-medium">Король лайков</span>
          </div>
          <div className="relative flex items-center justify-center w-24 h-24 z-20 shrink-0">
             <Heart className={`w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-fast ${styles.heart}`} strokeWidth={1.5} />
             <div className="relative z-10 flex flex-col items-center justify-center">
                <span key={count} className={`text-3xl font-black italic tracking-tighter animate-combo-bounce ${styles.counter}`}>{count > 9999 ? `${(count/1000).toFixed(1)}k` : count}</span>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Likes</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mb-1.5 ml-6 w-[240px] h-10 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-r-full rounded-l-md flex items-center px-2 transition-all duration-300 animate-slide-in">
      <div className="relative shrink-0 w-6 flex justify-center"><span className="font-black text-xs italic text-slate-600">#{rank}</span></div>
      <div className="relative shrink-0 mr-2"><img src={avatar} className="w-8 h-8 rounded-full border border-slate-600 object-cover" alt="avatar" /></div>
      <div className="flex-1 min-w-0 mr-2"><span className="font-bold text-[11px] block truncate text-slate-400">{name}</span></div>
      <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800 shadow-inner min-w-[70px] justify-center">
         <Heart size={14} className="text-rose-500 fill-rose-500" />
         <span key={count} className="text-xs font-black text-slate-200 animate-combo-bounce">{count > 9999 ? `${(count/1000).toFixed(0)}k` : count}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [targetUsername, setTargetUsername] = useState('');
  const usersRef = useRef([]);

  const handleLike = useCallback((username, avatarUrl, amount) => {
    const currentUsers = [...usersRef.current];
    const existingIndex = currentUsers.findIndex(u => u.name === username);
    if (existingIndex >= 0) {
      currentUsers[existingIndex].count += amount;
      currentUsers[existingIndex].lastUpdate = Date.now();
    } else {
      currentUsers.push({ id: username, name: username, avatar: avatarUrl, count: amount, lastUpdate: Date.now() });
    }
    currentUsers.sort((a, b) => b.count - a.count);
    if (currentUsers.length > 50) currentUsers.length = 50;
    usersRef.current = currentUsers;
    setUsers([...currentUsers]);
  }, []);

  useEffect(() => {
    const userToConnect = window.location.pathname.substring(1) || new URLSearchParams(window.location.search).get('u');
    if (!userToConnect) { setConnectionStatus('error'); return; }
    
    setTargetUsername(userToConnect);
    
    // Подключение к вашему серверу (Railway подставит правильный хост)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      setConnectionStatus('connected');
      ws.send(JSON.stringify({ type: 'connect', username: userToConnect }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'like' && data.targetUser === userToConnect) {
        handleLike(data.nickname, data.profilePictureUrl, data.likeCount);
      }
    };

    ws.onclose = () => setConnectionStatus('disconnected');
    return () => ws.close();
  }, [handleLike]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-slate-100 overflow-hidden relative">
      {users.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <span className="text-white font-bold text-sm">Waiting for likes for @{targetUsername}...</span>
          </div>
        </div>
      )}
      <div className="absolute left-6 top-16 flex flex-col items-start scale-75 origin-top-left transition-all duration-500">
        {users.slice(0, 15).map((user, index) => <LikerCard key={user.id} data={user} rank={index + 1} />)}
      </div>
    </div>
  );
}
