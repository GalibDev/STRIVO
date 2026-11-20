'use client';

import { useEffect, useRef } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { today, type Day, type Exercise } from '../lib/data';
import { calendarDates, isDayComplete } from '../lib/data';

type Props = { days: Day[]; exercises: Exercise[]; onToggle: (date: string) => void };

export default function DayCalendar({ days, exercises, onToggle }: Props) {
  const rail = useRef<HTMLDivElement>(null);
  const currentDay = useRef<HTMLDivElement>(null);
  const dates = calendarDates(today());

  useEffect(() => {
    const container = rail.current;
    const current = currentDay.current;
    if (container && current) container.scrollLeft = current.offsetLeft - 2;
  }, []);

  function slide(direction: number) {
    const container = rail.current;
    if (!container) return;
    container.scrollBy({ left: direction * container.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <section className="card calendar-card" aria-labelledby="calendar-title">
    <div className="card-head">
      <div><h2 id="calendar-title"><CalendarDays size={20} /> Your daily progress</h2><p>Show up. Finish your plan. Tick off your day.</p></div>
      <div className="calendar-arrows">
        <button aria-label="Show earlier dates" onClick={() => slide(-1)}><ChevronLeft size={19} /></button>
        <button aria-label="Show later dates" onClick={() => slide(1)}><ChevronRight size={19} /></button>
      </div>
    </div>
    <div className="calendar-rail" ref={rail} role="group" aria-label="Daily completion calendar. Swipe or use the arrows to browse dates.">
      {dates.map(value => {
        const date = new Date(value + 'T12:00:00');
        const day = days.find(entry => entry.date === value);
        const complete = isDayComplete(day, exercises);
        const future = value > today();
        const current = value === today();
        const label = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        return <div key={value} ref={current ? currentDay : undefined} className={`calendar-day${current ? ' is-today' : ''}${complete ? ' is-complete' : ''}${future ? ' is-future' : ''}`}>
          <time dateTime={value} aria-current={current ? 'date' : undefined}>
            <span className="calendar-weekday">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <strong>{date.getDate()}</strong>
            <span className="calendar-month">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
          </time>
          <button className="calendar-tick" role="checkbox" aria-checked={complete} aria-label={`${label}: ${complete ? 'completed; unmark day' : day?.rest ? 'rest day; mark plan complete' : future ? 'upcoming day' : 'mark plan complete'}`} disabled={future || exercises.length === 0} onClick={() => onToggle(value)}>
            {complete ? <Check size={21} strokeWidth={3} /> : day?.rest ? <Leaf size={17} /> : <span aria-hidden="true" className="calendar-tick-empty" />}
          </button>
          <span className="calendar-day-label">{current ? 'Today' : future ? 'Upcoming' : complete ? 'Done' : day?.rest ? 'Rest' : ' '}</span>
        </div>;
      })}
    </div>
    <div className="calendar-footer"><span><i /> Completed</span><p>Tick a date to complete its workout plan. Tap again to undo.</p></div>
  </section>;
}
