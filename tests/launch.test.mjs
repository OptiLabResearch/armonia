import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertLaunchReady,
  launchIssues,
  isHttpsUrl,
} from '../src/data/launch.mjs';

const ready = () => ({
  name: 'Test business',
  launchReady: true,
  copyApproved: true,
  practitionerName: 'Test practitioner',
  practitionerBio: 'Approved test bio',
  email: 'test@example.com',
  phone: '+46000000000',
  addressConfirmed: true,
  bookingUrlConfirmed: true,
  streetAddress: 'Test street 1',
  postalCode: '000 00',
  city: 'Test city',
  directions: 'Test directions',
  bookingUrl: 'https://example.com/book',
  treatments: [
    {
      id: 'massage',
      name: 'Massage',
      description: 'Approved test treatment',
      durationMinutes: 60,
      priceSek: 800,
      confirmed: true,
      bookingUrl: null,
    },
  ],
});

const draft = () => ({
  ...ready(),
  launchReady: false,
  copyApproved: false,
  bookingUrl: null,
  practitionerName: null,
});

test('a draft cannot accidentally pass the launch check', () => {
  assert.throws(() => assertLaunchReady(draft()), /not ready/);
  assert.ok(
    launchIssues(draft()).some((issue) => issue.includes('bookingUrl')),
  );
});
test('complete, approved details can pass launch validation', () => {
  assert.deepEqual(launchIssues(ready()), []);
  assert.doesNotThrow(() => assertLaunchReady(ready()));
});
test('launch flag alone cannot bypass missing business data', () => {
  assert.throws(
    () =>
      assertLaunchReady({ ...draft(), launchReady: true, copyApproved: true }),
    /Missing/,
  );
});
test('reject unsafe, incomplete or credential-bearing booking URLs', () => {
  for (const value of [
    null,
    '',
    '/book',
    'javascript:alert(1)',
    'http://example.com',
    'https://user:password@example.com',
  ]) {
    assert.equal(isHttpsUrl(value), false, `${value} must not be accepted`);
    assert.ok(launchIssues({ ...ready(), bookingUrl: value }).length > 0);
  }
});
test('treatment approval, time, price and optional URL are validated', () => {
  for (const override of [
    { confirmed: false },
    { durationMinutes: 0 },
    { durationMinutes: 0.5 },
    { priceSek: -1 },
    { priceSek: null },
    { bookingUrl: 'javascript:alert(1)' },
    { description: ' ' },
  ]) {
    const business = ready();
    Object.assign(business.treatments[0], override);
    assert.ok(launchIssues(business).length > 0, JSON.stringify(override));
  }
});
test('empty treatment list and unapproved copy prevent release', () => {
  assert.ok(launchIssues({ ...ready(), treatments: [] }).length > 0);
  assert.ok(launchIssues({ ...ready(), copyApproved: false }).length > 0);
});
test('malformed treatment collections return launch blockers', () => {
  for (const treatments of [null, {}, [null]])
    assert.ok(launchIssues({ ...ready(), treatments }).length > 0);
});

test('temporary address and booking link cannot pass the launch gate', () => {
  for (const field of ['addressConfirmed', 'bookingUrlConfirmed'])
    assert.throws(
      () => assertLaunchReady({ ...ready(), [field]: false }),
      /must be confirmed/,
    );
});
