export type Weight = { id: string; date: string; value: number };
export const parts = ['Neck', 'Chest', 'Belly', 'Waist', 'Upper arm', 'Thigh', 'Calf'] as const;
export type Measurement = { id: string; date: string; values: number[] };
export type Exercise = { id: string; name: string; sets: number; reps: string; duration: number };
export type Day = { date: string; rest: boolean; completed: string[] };
export type Data = { version: 1; start: number; goal: number; weightUnit: 'kg' | 'lb'; lengthUnit: 'in' | 'cm'; weights: Weight[]; measurements: Measurement[]; exercises: Exercise[]; days: Day[] };
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const initial = (): Data => ({version:1,start:69,goal:66,weightUnit:'kg',lengthUnit:'in',weights:[{id:'demo-weight',date:today(),value:69}],measurements:[{id:'demo-measurements',date:today(),values:[15,38,36.5,36,11,21.5,15]}],exercises:[{id:'walk',name:'Easy walk',sets:1,reps:'Comfortable pace',duration:15},{id:'chair',name:'Chair sit-to-stand',sets:2,reps:'8 reps',duration:0},{id:'wall',name:'Wall push-ups',sets:2,reps:'8 reps',duration:0},{id:'heel',name:'Standing heel raises',sets:2,reps:'10 reps',duration:0}],days:[]});
export function validDate(value: unknown): value is string { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value && value<=today(); }
const positive = (x: unknown): x is number => typeof x==='number' && Number.isFinite(x) && x>0 && x<10000;
export function validate(x: unknown): x is Data {
 if(!x || typeof x!=='object') return false;
 const d=x as Data;
 const ids=(a:{id:string}[])=>a.every(x=>typeof x.id==='string' && x.id.length>0)&&new Set(a.map(x=>x.id)).size===a.length;
 return d.version===1 && positive(d.start)&&positive(d.goal)&&['kg','lb'].includes(d.weightUnit)&&['in','cm'].includes(d.lengthUnit)&&Array.isArray(d.weights)&&d.weights.length<=10000&&d.weights.every(w=>w&&validDate(w.date)&&positive(w.value))&&ids(d.weights)&&Array.isArray(d.measurements)&&d.measurements.length<=10000&&d.measurements.every(m=>m&&validDate(m.date)&&Array.isArray(m.values)&&m.values.length===7&&m.values.every(positive))&&ids(d.measurements)&&Array.isArray(d.exercises)&&d.exercises.length<=100&&d.exercises.every(e=>e&&typeof e.name==='string'&&e.name.trim().length>0&&e.name.length<=100&&Number.isInteger(e.sets)&&e.sets>0&&e.sets<=100&&typeof e.reps==='string'&&e.reps.length<=100&&Number.isFinite(e.duration)&&e.duration>=0&&e.duration<=600)&&ids(d.exercises)&&Array.isArray(d.days)&&d.days.length<=10000&&d.days.every(day=>day&&validDate(day.date)&&typeof day.rest==='boolean'&&Array.isArray(day.completed)&&day.completed.every(id=>typeof id==='string'))&&new Set(d.days.map(day=>day.date)).size===d.days.length;
}
export const sorted = <T extends {date:string}>(a:T[]) => [...a].sort((a,b)=>a.date.localeCompare(b.date));
export function progress(start:number,current:number,goal:number) { return start===goal ? (current===goal?100:0) : Math.max(0,Math.min(100,(current-start)/(goal-start)*100)); }


export function isDayComplete(day: Day | undefined, exercises: Exercise[]): boolean {
  return !!day && !day.rest && exercises.length > 0 && exercises.every(exercise => day.completed.includes(exercise.id));
}

// Local noon avoids date shifts around daylight-saving changes.
export function calendarDates(anchor: string): string[] {
  const date = new Date(anchor + 'T12:00:00');
  return Array.from({ length: 365 }, (_, index) => {
    const value = new Date(date);
    value.setDate(value.getDate() + index - 180);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  });
}

export function toggleDay(days: Day[], exercises: Exercise[], date: string): Day[] {
  if (!validDate(date) || exercises.length === 0) return days;
  const existing = days.find(day => day.date === date);
  const completed = isDayComplete(existing, exercises) ? [] : exercises.map(exercise => exercise.id);
  return [...days.filter(day => day.date !== date), { date, rest: false, completed }];
}
