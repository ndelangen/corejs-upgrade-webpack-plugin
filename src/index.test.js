import CoreJsAutoUpgradePlugin, { rewriteCoreJsRequest } from './index';

describe('rewriteCoreJsRequest', () => {
  const fakeRequire = jest.mock();

  describe('rewrite `core-js/modules/*`', () => {
    it('should rewrite `core-js/modules/es6.*` import to `core-js/modules/es.*`', () => {
      expect(rewriteCoreJsRequest('core-js/modules/es6.object.is-frozen.js')).toBe(
        'core-js/modules/es.object.is-frozen.js'
      );
    });

    it('should rewrite `core-js/modules/es7.*` import to `core-js/modules/esnext.*`', () => {
      expect(rewriteCoreJsRequest('core-js/modules/es7.math.iaddh.js')).toBe(
        'core-js/modules/esnext.math.iaddh.js'
      );
    });
  });

  describe('rewrite `core-js/library/fn/*`', () => {
    it('should rewrite `core-js/library/*` import to `core-js-pure/features/*`', () => {
      expect(rewriteCoreJsRequest('core-js/library/fn/object/assign')).toBe(
        'core-js-pure/features/object/assign'
      );
    });
  });

  describe('rewrite `core-js/es(5|6|7)/*`', () => {
    it('should not rewrite `core-js/es5` import', () => {
      expect(rewriteCoreJsRequest('core-js/es5')).toBeNull();
    });

    it('should rewrite `core-js/es6/*` import to `core-js/es/*`', () => {
      expect(rewriteCoreJsRequest('core-js/es6/object.js')).toBe('core-js/es/object');

      expect(rewriteCoreJsRequest('core-js/es6/parse-int')).toBe('core-js/es/parse-int');
    });

    it('should not rewrite `core-js/es7` import`', () => {
      expect(rewriteCoreJsRequest('core-js/es7/array.js')).toBeNull();
    });
  });

  describe('rewrite `core-js/object/*`', () => {
    it('should rewrite `core-js/object/*` import to `core-js/features/*`', () => {
      expect(rewriteCoreJsRequest('core-js/object/assign.js')).toBe(
        'core-js/features/object/assign.js'
      );

      expect(rewriteCoreJsRequest('../core-js/object/assign')).toBe(
        '../core-js/features/object/assign'
      );
    });
  });

  it('should preserve request prefix when upgrading the request', () => {
    expect(rewriteCoreJsRequest('../foo/core-js/modules/es6.bar.js')).toBe(
      '../foo/core-js/modules/es.bar.js'
    );
  });
});
