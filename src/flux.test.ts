import {createStore} from 'redux';
import {Flux} from './flux';
import produce from 'immer';

interface FooState {
  aaa: string;
  bbb: number;
  ccc: boolean;
}

interface FooActionPayload {
  hoge: {
    aaa: FooState['aaa'];
  };
  fuga: {
    bbb: FooState['bbb'];
  };
  piyo: {
    ccc: FooState['ccc'];
  };
}

let flux: Flux<FooState, FooActionPayload>;
let hogeProcess = jest.fn();
let fugaProcess = jest.fn();
let piyoProcess = jest.fn();
beforeEach(() => {
  flux = new Flux<FooState, FooActionPayload>({aaa: '', bbb: -1, ccc: false});
  flux
    .addAction('hoge', (state, payload) => {
      hogeProcess(state, payload);
      state.aaa = payload.aaa;
    })
    .addAction('fuga', (state, payload) => {
      fugaProcess(state, payload);
      return produce(state, draft => {
        draft.bbb = payload.bbb;
      });
    })
    .addAction('piyo', (state, payload) => {
      piyoProcess(state, payload);

      return produce(state, draft => {
        draft.ccc = payload.ccc;
      });
    }, ['baz'])
});

test('', () => {
  expect(flux.act('hoge')({aaa: 'aaa'})).toMatchObject({
    type: flux.rootType,
    actions: [
      {
        type: flux.types.hoge,
        payload: {aaa: 'aaa'},
      },
    ],
  });

  expect(flux.act('hoge', 'fuga')({aaa: 'aaa'}, {bbb: 111})).toMatchObject({
    type: flux.rootType,
    actions: [
      {
        type: flux.types.hoge,
        payload: {aaa: 'aaa'},
      },
      {
        type: flux.types.fuga,
        payload: {bbb: 111},
      },
    ],
  });
});

test('with redux', () => {
  const store = createStore(flux.createReducer());
  store.dispatch(flux.act('hoge')({aaa: 'aaa'}));
  expect(store.getState()).toMatchObject({aaa: 'aaa', bbb: -1});
});

test('with redux2', () => {
  const store = createStore(flux.createReducer());
  store.dispatch(
    flux.act('hoge', 'fuga', 'piyo')({aaa: 'aaa'}, {bbb: 111}, {ccc: true}),
  );
  expect(store.getState()).toMatchObject({aaa: 'aaa', bbb: 111, ccc: true});
});

describe('reducerItems', () => {
  test('do nothing', () => {
    expect(flux.getReducerItems()).toHaveLength(3);

    const store = createStore(flux.createReducer());
    store.dispatch(flux.act('piyo')({ccc: true}));
    expect(store.getState()).toMatchObject({aaa: '', bbb: -1, ccc: true});
  });

  test(`allOff().on('baz')`, () => {
    expect(flux.getReducerItems()).toHaveLength(3);
    flux.allOff().on('baz');
    expect(flux.getReducerItems()).toHaveLength(3);

    const store = createStore(flux.createReducer());
    store.dispatch(flux.act('piyo')({ccc: true}));
    expect(store.getState()).toMatchObject({aaa: '', bbb: -1, ccc: true});
  });

  test(`off('baz')`, () => {
    expect(flux.getReducerItems()).toHaveLength(3);
    flux.off('baz');
    expect(flux.getReducerItems()).toHaveLength(2);

    const store = createStore(flux.createReducer());
    store.dispatch(flux.act('hoge', 'piyo')({aaa: 'aaa'}, {ccc: true}));
    expect(store.getState()).toMatchObject({aaa: 'aaa', bbb: -1, ccc: false});
  });
});
