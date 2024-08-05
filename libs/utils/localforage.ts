import LocalForage from 'localforage';

const localforage = LocalForage.createInstance({
  name: 'tgmedia',
  storeName: 'db',
});

export { localforage };
