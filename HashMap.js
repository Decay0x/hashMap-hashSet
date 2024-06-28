function HashMap() {
  const buckets = new Array(16);
  let size = 0;
  let loadFactor = 0.7;

  const data = {
    hash: (key) => {
      let hashCode = 0;
      const primeNumber = 31;
      for (let i = 0; i < key.length; i++) {
        hashCode =
          (primeNumber * hashCode + key.charCodeAt(i)) % buckets.length;
      }
      return hashCode;
    },

    set: (key, value) => {
      const index = data.hash(key);
      if (index < 0 || index >= buckets.length) {
        throw new Error('Index out of bounds');
      }
      if (!buckets[index]) {
        buckets[index] = [];
      }
      for (let i = 0; i < buckets[index].length; i++) {
        if (buckets[index][i][0] === key) {
          buckets[index][i][1] = value;
          return;
        }
      }
      buckets[index].push([key, value]);
      size++;
      if (size / buckets.length > loadFactor) {
        data.resize();
      }
    },

    get: (key) => {
      const index = data.hash(key);
      if (buckets[index]) {
        for (const [k, v] of buckets[index]) {
          if (k === key) {
            return v;
          }
        }
      }
      return null;
    },

    has: (key) => {
      const index = data.hash(key);
      if (!buckets[index]) {
        return false;
      }
      for (const [k] of buckets[index]) {
        if (k === key) {
          return true;
        }
      }
      return false;
    },

    remove: (key) => {
      const index = data.hash(key);
      if (buckets[index]) {
        for (let i = 0; i < buckets[index].length; i++) {
          if (buckets[index][i][0] === key) {
            buckets[index].splice(i, 1);
            size--;
            if (buckets[index].length === 0) {
              buckets[index] = null;
            }
            return true;
          }
        }
      }
      return false;
    },

    length: () => size,

    clear: () => {
      buckets.fill(null);
      size = 0;
    },

    keys: () => {
      return buckets.reduce((acc, bucket) => {
        if (bucket) {
          acc.push(...bucket.map(([k]) => k));
        }
        return acc;
      }, []);
    },

    values: () => {
      return buckets.reduce((acc, bucket) => {
        if (bucket) {
          acc.push(...bucket.map(([, v]) => v));
        }
        return acc;
      }, []);
    },

    entries: () => {
      return buckets.reduce((acc, bucket) => {
        if (bucket) {
          acc.push(...bucket);
        }
        return acc;
      }, []);
    },

    resize: () => {
      const newBuckets = new Array(buckets.length * 2);
      for (let i = 0; i < buckets.length; i++) {
        if (buckets[i]) {
          for (let j = 0; j < buckets[i].length; j++) {
            const newIndex = data.hash(buckets[i][j][0]) % newBuckets.length;
            if (!newBuckets[newIndex]) {
              newBuckets[newIndex] = [];
            }
            newBuckets[newIndex].push(buckets[i][j]);
          }
        }
      }
      buckets = newBuckets;
    },
  };
  return data;
}

function HashSet() {
  const buckets = new Array(16);
  let size = 0;
  let loadFactor = 0.7;

  const data = {
    hash: (key) => {
      let hashCode = 0;
      const primeNumber = 31;
      for (let i = 0; i < key.length; i++) {
        hashCode =
          (primeNumber * hashCode + key.charCodeAt(i)) % buckets.length;
      }
      return hashCode;
    },

    add: (key) => {
      const index = data.hash(key);
      if (index < 0 || index >= buckets.length) {
        throw new Error('Index out of bounds');
      }
      if (!buckets[index]) {
        buckets[index] = [];
      }
      if (!buckets[index].includes(key)) {
        buckets[index].push(key);
        size++;
        if (size / buckets.length > loadFactor) {
          data.resize();
        }
      }
    },

    has: (key) => {
      const index = data.hash(key);
      if (!buckets[index]) {
        return false;
      }
      return buckets[index].includes(key);
    },

    remove: (key) => {
      const index = data.hash(key);
      if (buckets[index]) {
        const indexInBucket = buckets[index].indexOf(key);
        if (indexInBucket !== -1) {
          buckets[index].splice(indexInBucket, 1);
          size--;
          if (buckets[index].length === 0) {
            buckets[index] = null;
          }
          return true;
        }
      }
      return false;
    },

    length: () => size,

    clear: () => {
      buckets.fill(null);
      size = 0;
    },

    keys: () => {
      return buckets.reduce((acc, bucket) => {
        if (bucket) {
          acc.push(...bucket);
        }
        return acc;
      }, []);
    },

    resize: () => {
      const newBuckets = new Array(buckets.length * 2);
      for (let i = 0; i < buckets.length; i++) {
        if (buckets[i]) {
          for (let j = 0; j < buckets[i].length; j++) {
            const newIndex = data.hash(buckets[i][j]) % newBuckets.length;
            if (!newBuckets[newIndex]) {
              newBuckets[newIndex] = [];
            }
            newBuckets[newIndex].push(buckets[i][j]);
          }
        }
      }
      buckets = newBuckets;
    },
  };
  return data;
}

// Testing HashMap
const hashMap = HashMap();

console.log('hashMap: Initial size:', hashMap.length()); // 0

hashMap.set('key1', 'value1');
hashMap.set('key2', 'value2');
hashMap.set('key3', 'value3');

console.log('hashMap: Size after adding 3 entries:', hashMap.length()); // 3

console.log('hashMap: Get value for key1:', hashMap.get('key1')); // value1
console.log('hashMap: Get value for key2:', hashMap.get('key2')); // value2
console.log('hashMap: Get value for key3:', hashMap.get('key3')); // value3

console.log('hashMap: Has key1:', hashMap.has('key1')); // true
console.log('hashMap: Has key4:', hashMap.has('key4')); // false

hashMap.remove('key2');
console.log('hashMap: Size after removing 1 entry:', hashMap.length()); // 2

console.log('hashMap: Get value for key2 after removal:', hashMap.get('key2')); // null

console.log('hashMap: Keys:', hashMap.keys()); // [ 'key1', 'key3' ]
console.log('hashMap: Values:', hashMap.values()); // [ 'value1', 'value3' ]
console.log('hashMap: Entries:', hashMap.entries()); // [ [ 'key1', 'value1' ], [ 'key3', 'value3' ] ]

hashMap.clear();
console.log('hashMap: Size after clearing:', hashMap.length()); // 0

// Testing HashSet
const hashSet = HashSet();

console.log('hashSet: Initial size:', hashSet.length()); // 0

hashSet.add('hashSet: key1');
hashSet.add('hashSet: key2');
hashSet.add('hashSet: key3');

console.log('hashSet: Size after adding 3 entries:', hashSet.length()); // 3

console.log('hashSet: Has key1:', hashSet.has('hashSet: key1')); // true
console.log('hashSet: Has key4:', hashSet.has('hashSet: key4')); // false

hashSet.remove('hashSet: key2');
console.log('hashSet: Size after removing 1 entry:', hashSet.length()); // 2

console.log('hashSet: Has key2 after removal:', hashSet.has('hashSet: key2')); // false

console.log('hashSet: Keys:', hashSet.keys()); // [ 'hashSet: key1', 'hashSet: key3' ]

hashSet.clear();
console.log('hashSet: Size after clearing:', hashSet.length()); // 0
