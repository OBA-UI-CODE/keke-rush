export const PASSENGER_CAPACITY=3;
export const isValidFinish=(passengerCount:number)=>passengerCount===PASSENGER_CAPACITY;
export const collisionPenalty=(kind:"traffic"|"pothole")=>kind==="traffic"?2.5:1.25;
export function maximumSpeed(passengerCount:number){const load=Math.min(Math.max(passengerCount,0),PASSENGER_CAPACITY)/PASSENGER_CAPACITY;return 25-load*4}
