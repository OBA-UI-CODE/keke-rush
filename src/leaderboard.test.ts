import {describe,expect,it} from "vitest";
import {rankScores,type ScoreEntry} from "./leaderboard";
const score=(name:string,time:number):ScoreEntry=>({name,time,completedAt:"2026-10-15T00:00:00.000Z"});
describe("leaderboard",()=>{it("sorts fastest first and keeps five",()=>{const ranked=rankScores([score("F",60),score("B",20),score("A",10),score("E",50),score("D",40),score("C",30)]);expect(ranked.map(item=>item.name)).toEqual(["A","B","C","D","E"])});it("rejects invalid scores",()=>{expect(rankScores([score("",12),score("Valid",22),score("Bad",-1)])).toEqual([score("Valid",22)])})});
