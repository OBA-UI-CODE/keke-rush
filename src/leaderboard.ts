export type ScoreEntry={name:string;time:number;completedAt:string};
const STORAGE_KEY="keke-rush-leaderboard-v1";
export function rankScores(scores:ScoreEntry[]){return [...scores].filter(score=>score.name.trim()&&Number.isFinite(score.time)&&score.time>0).sort((a,b)=>a.time-b.time).slice(0,5)}
export function loadScores():ScoreEntry[]{try{const parsed:unknown=JSON.parse(localStorage.getItem(STORAGE_KEY)??"[]");return Array.isArray(parsed)?rankScores(parsed as ScoreEntry[]):[]}catch{return[]}}
export function recordScore(name:string,time:number){const scores=loadScores(),existing=scores.find(score=>score.name.toLowerCase()===name.toLowerCase());if(existing&&existing.time<=time)return scores;const without=scores.filter(score=>score.name.toLowerCase()!==name.toLowerCase());const ranked=rankScores([...without,{name,time,completedAt:new Date().toISOString()}]);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(ranked))}catch{}return ranked}
