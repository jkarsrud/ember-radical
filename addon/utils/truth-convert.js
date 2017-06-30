import get from 'ember-metal/get';

export default function truthConvert(result) {
  // What Ember magic is this?
  const truthy = result && get(result, 'isTruthy');
  if (typeof truthy === 'boolean') { return truthy; }

  if (Array.isArray(result)) {
    return get(result, 'length') !== 0;
  } else {
    return !!result;
  }
}
