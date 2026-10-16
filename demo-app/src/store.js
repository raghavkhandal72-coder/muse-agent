'use strict';

const crypto = require('node:crypto');

class Store {
  constructor() {
    this.items = new Map();
    this.auditLog = [];
  }

  _computeEntryHash(prevHash, action, key, timestamp) {
    return crypto
      .createHash('sha256')
      .update(`${prevHash}|${action}|${key}|${timestamp}`)
      .digest('hex');
  }

  _appendAudit(action, key, timestamp) {
    const prevHash = this.auditLog.length > 0
      ? this.auditLog[this.auditLog.length - 1].hash
      : '0'.repeat(64);
    const hash = this._computeEntryHash(prevHash, action, key, timestamp);
    const entry = {
      index: this.auditLog.length,
      action,
      key,
      timestamp,
      prevHash,
      hash
    };
    this.auditLog.push(entry);
    return entry;
  }

  set(key, value) {
    if (!key || typeof key !== 'string') {
      throw new TypeError('Store key must be a non-empty string');
    }
    const record = { value, updatedAt: new Date().toISOString() };
    this.items.set(key, record);
    this._appendAudit('SET', key, record.updatedAt);
    return record;
  }

  get(key) {
    const item = this.items.get(key);
    return item ? item.value : null;
  }

  has(key) {
    return this.items.has(key);
  }

  delete(key) {
    const existed = this.items.delete(key);
    if (existed) {
      this._appendAudit('DELETE', key, new Date().toISOString());
    }
    return existed;
  }

  getAuditTrail() {
    return this.auditLog.map(entry => ({ ...entry }));
  }

  verifyAuditIntegrity() {
    let expectedPrev = '0'.repeat(64);
    for (let i = 0; i < this.auditLog.length; i++) {
      const entry = this.auditLog[i];
      if (entry.prevHash !== expectedPrev) {
        return { valid: false, tamperedIndex: i, reason: 'Broken previous hash link' };
      }
      const recomputed = this._computeEntryHash(entry.prevHash, entry.action, entry.key, entry.timestamp);
      if (recomputed !== entry.hash) {
        return { valid: false, tamperedIndex: i, reason: 'Entry hash mismatch' };
      }
      expectedPrev = entry.hash;
    }
    return {
      valid: true,
      entriesChecked: this.auditLog.length,
      headHash: expectedPrev
    };
  }

  size() {
    return this.items.size;
  }
}

module.exports = Store;
