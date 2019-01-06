import {createStore} from 'redux';
import {Flux} from './flux';
import produce from 'immer';

interface FooState {
  aaa: string;
  bbb: number;
}

interface FooActionPayload {
  hoge: {
    aaa: FooState['aaa'];
  };
  fuga: {
    bbb: FooState['bbb'];
  };
}

let flux: Flux<FooState, FooActionPayload>;
beforeEach(() => {
  flux = new Flux<FooState, FooActionPayload>({aaa: '', bbb: -1});
  flux
    .addAction('hoge', (state, payload) => {
      state.aaa = payload.aaa;
    })
    .addAction('fuga', (state, payload) => {
      return produce(state, draft => {
        draft.bbb = payload.bbb;
      });
    });
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
  store.dispatch(flux.act('hoge', 'fuga')({aaa: 'aaa'}, {bbb: 111}));
  expect(store.getState()).toMatchObject({aaa: 'aaa', bbb: 111});
});
