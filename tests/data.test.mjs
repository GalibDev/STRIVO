import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initial, validate, progress, validDate } from '../lib/data.ts';

test('demo data round trips through a JSON backup', () => {
  assert.equal(validate(JSON.parse(JSON.stringify(initial()))), true);
});
test('progress supports loss, gain, overshoot and equal goals', () => {
  assert.equal(progress(69, 67.5, 66), 50);
  assert.equal(progress(60, 65, 70), 50);
  assert.equal(progress(69, 65, 66), 100);
  assert.equal(progress(69, 70, 66), 0);
  assert.equal(progress(66, 66, 66), 100);
});
test('rejects malformed backups and impossible dates', () => {
  const data = initial();
  for (const value of [null, {}, { ...data, goal: NaN },
    { ...data, weights: [...data.weights, ...data.weights] },
    { ...data, measurements: [{ id: 'a', date: data.weights[0].date, values: [1] }] },
    { ...data, exercises: [{ ...data.exercises[0], duration: -1 }] }]) {
    assert.equal(validate(value), false);
  }
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2099-01-01'), false);
});

// Calendar completion uses the same workout records as the tracker.
import { calendarDates, isDayComplete, toggleDay } from '../lib/data.ts';

test('calendar dates span past and future with correct year and leap-day boundaries', () => {
  const dates = calendarDates('2026-01-01');
  assert.equal(dates.length, 365);
  assert.equal(new Set(dates).size, 365);
  assert.equal(dates[180], '2026-01-01');
  assert.equal(dates[179], '2025-12-31');
  assert.equal(dates[181], '2026-01-02');
  assert.equal(calendarDates('2024-03-01')[179], '2024-02-29');
});

test('calendar tick completes the workout, persists in backups, and can be undone', () => {
  const data = initial();
  const date = data.weights[0].date;
  const days = toggleDay(data.days, data.exercises, date);
  assert.equal(isDayComplete(days[0], data.exercises), true);
  assert.deepEqual(days[0].completed, data.exercises.map(exercise => exercise.id));
  assert.equal(validate(JSON.parse(JSON.stringify({ ...data, days }))), true);
  assert.equal(isDayComplete(toggleDay(days, data.exercises, date)[0], data.exercises), false);
  assert.equal(isDayComplete({ date, rest: true, completed: [] }, data.exercises), false);
  assert.equal(isDayComplete(undefined, []), false);
  assert.equal(toggleDay(days, data.exercises, '2099-01-01'), days);
  assert.equal(toggleDay(days, data.exercises, '2026-02-30'), days);
  assert.equal(toggleDay(days, [], date), days);
});
