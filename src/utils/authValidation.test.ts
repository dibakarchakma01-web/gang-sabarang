import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatAuthErrorMessage,
  validateAdminLoginForm,
} from './authValidation';

test('validateAdminLoginForm validates email and password presence', () => {
  const empty = validateAdminLoginForm('', '');
  assert.equal(empty.ok, false);
  assert.ok(empty.errors.email);
  assert.ok(empty.errors.password);

  const badEmail = validateAdminLoginForm('not-an-email', 'secret');
  assert.equal(badEmail.ok, false);
  assert.ok(badEmail.errors.email);
  assert.equal(badEmail.errors.password, undefined);

  const valid = validateAdminLoginForm('staff@gangsabarang.com', 'password123');
  assert.equal(valid.ok, true);
  assert.deepEqual(valid.errors, {});
});

test('formatAuthErrorMessage maps technical Supabase messages to friendly English', () => {
  assert.match(
    formatAuthErrorMessage('Invalid login credentials'),
    /Incorrect email or password/i,
  );
  assert.match(
    formatAuthErrorMessage('Email not confirmed'),
    /not been confirmed/i,
  );
  assert.match(formatAuthErrorMessage(''), /Unable to sign in/i);
});
