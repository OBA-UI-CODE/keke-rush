/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_STARTNG_CHARACTER_API_URL?:string }
interface ImportMeta { readonly env:ImportMetaEnv }
interface Window { __kekeRushTest?:{ boardAtStop(index:number):void; placeAtFinish():void; getState():{ state:string; x:number; z:number; passengers:number; boarding:number; keys:string[] } } }
