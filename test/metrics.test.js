import test from 'node:test';
import assert from 'node:assert/strict';
import { netWorth, monthlyNetIncome, savingsRate, habitScore, scheduleLoadScore, runwaysMonths } from '../src/metrics.js';

test('netWorth calculates assets minus liabilities', () => {
  assert.equal(netWorth({ assets: 1000, liabilities: 300 }), 700);
});

test('monthlyNetIncome calculates income minus expenses', () => {
  assert.equal(monthlyNetIncome({ income: 5000, expenses: 3200 }), 1800);
});

test('savingsRate handles normal and zero income', () => {
  assert.equal(savingsRate({ income: 5000, expenses: 3500 }), 30);
  assert.equal(savingsRate({ income: 0, expenses: 200 }), 0);
});

test('habitScore returns completion percentage', () => {
  assert.equal(
    habitScore([
      { completed: true },
      { completed: false },
      { completed: true },
      { completed: true }
    ]),
    75
  );
});

test('scheduleLoadScore maps hours to 0-100 cap', () => {
  assert.equal(scheduleLoadScore([{ durationHours: 2 }, { durationHours: 2 }]), 50);
  assert.equal(scheduleLoadScore([{ durationHours: 12 }]), 100);
});

test('runwaysMonths handles monthly burn and no-burn case', () => {
  assert.equal(runwaysMonths({ liquidCash: 12000, monthlyBurn: 3000 }), 4);
  assert.equal(runwaysMonths({ liquidCash: 12000, monthlyBurn: 0 }), Infinity);
});
