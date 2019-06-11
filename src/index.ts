import { NormalModuleReplacementPlugin } from 'webpack';
import resolveFrom from 'resolve-from';

const rewriteAndPreservePrefix = (originalRequest: string, newPath: string, newModuleName = 'core-js') => {
  const result = originalRequest.match(/(.*\/)core-js\/.*/);
  const requestPrefix = result ? result[1] : '';

  return `${requestPrefix}${newModuleName}/${newPath}`;
};

export const rewriteCoreJsRequest = (originalRequest: string) => {
  if (/core-js\/modules\/es(6|7)\.(.*)/.test(originalRequest)) {
    const [,esVersion, originalPath] = originalRequest.match(/core-js\/modules\/es(6|7)\.(.*)/);

    if (esVersion === '6') {
      return rewriteAndPreservePrefix(originalRequest, `modules/es.${originalPath}`);
    }
    if (esVersion === '7') {
      return rewriteAndPreservePrefix(originalRequest, `modules/esnext.${originalPath}`);
    }
  }

  if (/core-js\/library\/fn\/(.*)/.test(originalRequest)) {
    const [,originalPath] = originalRequest.match(/core-js\/library\/fn\/(.*)/);

    return rewriteAndPreservePrefix(originalRequest, `features/${originalPath}`, 'core-js-pure');
  }

  if (/core-js\/es(5|6|7)(.*)/.test(originalRequest)) {
    const [,esVersion, originalPath] = originalRequest.match(/core-js\/es(5|6|7)(.*)?/);

    if (esVersion === '5') {
      return null;
    }
    if (esVersion === '6') {
      const asAModule = originalPath.replace('.js', '');

      return rewriteAndPreservePrefix(originalRequest, `es${asAModule}`);
    }
    if (esVersion === '7') {
      return null;
    }
  }

  if (/core-js\/(object)\/(.*)/.test(originalRequest)) {
    const [,originalPath] = originalRequest.match(/core-js\/(.*)?/);

    return rewriteAndPreservePrefix(originalRequest, `features/${originalPath}`);
  }

  return originalRequest;
};

export interface Options {
  resolveFrom: string | false;
}

const defaultOptions = {
  resolveFrom: false,
} as Options

export default function CoreJSUpgradeWebpackPlugin(options: Options) {
  options = Object.assign({}, defaultOptions, options || {});
  const resolve = options.resolveFrom ? resolveFrom.bind(null, options.resolveFrom) : require.resolve;
  
  return new NormalModuleReplacementPlugin(/core-js/, resource => {
    const originalRequest = resource.request as string;
    if (originalRequest.startsWith('./') || originalRequest.startsWith('../')) {
      return;
    }

    try {
      resolve(originalRequest);
    } catch (originalError) {
      const newRequest = rewriteCoreJsRequest(originalRequest);
      if (!newRequest) {
        throw originalError;
      }

      try {
        // eslint-disable-next-line no-param-reassign
        resource.request = resolve(newRequest);
      } catch (newRequestError) {
        throw originalError;
      }
    }
  });
};
