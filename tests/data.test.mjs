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
