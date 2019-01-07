# @nju33/flux

A Flux utility.

[![github](https://badgen.net/badge//nju33,flux/000?icon=github&list=1)](https://github.com/nju33/flux)
[![npm:version](https://badgen.net/npm/v/@nju33/flux?icon=npm&label=)](https://www.npmjs.com/package/@nju33/flux)
[![typescript](https://badgen.net/badge/lang/typescript/0376c6?icon=npm)](https://www.typescriptlang.org/)
[![ci:status](https://badgen.net/circleci/github/nju33/flux)](https://circleci.com/gh/nju33/flux)
[![document:typedoc](https://badgen.net/badge/document/typedoc/9602ff)](https://docs--nju33-flux.netlify.com/)
[![license](https://badgen.net/npm/license/@nju33/flux)](https://github.com/nju33/flux/blob/master/LICENSE)
[![browserslist](https://badgen.net/badge/browserslist/chrome,edge/ffd539?list=1)](https://browserl.ist/?q=last+1+chrome+version%2C+last+1+edge+version)

## Usage

````js
/**
 * To prepare of using the `@nju33/flux`
 * ```sh
 * yarn add @nju33/flux
 * ```
 */
import Flux from '@nju33/flux';
````

## Example

```ts
interface FooState {
  str: string;
  num: number;
  bool: boolean;
}

/**
 * define  in the form of `{[actionName]: payload}`
 */
interface FooActionPayload {
  hoge: {
    str: FooState['str'];
  };
  fuga: {
    num: FooState['num'];
  };
  piyo: {
    bool: FooState['bool'];
  }
}

const flux = new Flux<FooState, FooActionPayload>({str: '', num: -1: bool: false});
flux
  .addAction('hoge', (state, payload) => {
    const nextState = {...state};
    nextState.str = payload.str;
    return nextState;
  })
  .addAction('fuga', (state, payload) => {
    // When with the `immer`
    return produce(state, draft => {
      draft.num = payload.num;
    });
  })

// add the piyo action in the `something` scope.
flux.scope('something').addAction('piyo', (state, payload) => {
  const nextState = {...state};
  nextState.bool = payload.bool;
  return nextState;
})
//
// or
//
// ```
// flux.addAction('piyo', fn, ['something']);
// ```
//

// For example, when using with the Redux.
const store = redux.createStore(flux.createReducer());

// In the below, A three action is executed at the same times.
store.dispatch(flux.act('hoge', 'fuga', 'piyo')({str: 'str'}, {num: 111}, {bool: true}));
//
// One action only.
//
// ```
// store.dispatch(flux.act('hoge')({str: 'str'}));
// ```
//

// Assert
expect(store.getState()).toMatchObject({str: 'str', num: 111, bool: true});

// All `something` scope action process removes from the reducer.
flux.off('something');
store.dispatch(flux.act('hoge', 'piyo')({str: 'str2'}, {bool: false}));
// `bool` does not change
expect(store.getState()).toMatchObject({str: 'str2', num: 111, bool: true});
```

In addition, `camelcase-keys` and `snakecase-keys` packages are included in this.

```ts
// If they are necessary.
import {camelcaseKeys, snakecaseKeys} from '@nju33/flux';

// ...

store.dispatch(
  flux.act('...')(
    camelcaseKeys({
      /* ... */
    }),
  ),
);
```
