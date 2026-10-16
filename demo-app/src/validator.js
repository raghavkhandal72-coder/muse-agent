'use strict';

class Validator {
  static sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static isNonEmptyString(val) {
    return typeof val === 'string' && val.trim().length > 0;
  }

  static isHex(val, expectedLen = null) {
    if (typeof val !== 'string') return false;
    const isHexMatch = /^[0-9a-fA-F]+$/.test(val);
    if (!isHexMatch) return false;
    if (expectedLen !== null && val.length !== expectedLen) return false;
    return true;
  }

  static isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }
}

module.exports = Validator;
