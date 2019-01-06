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
  aaa: string;
  bbb: number;
}

/**
 * define  in the form of `{[actionName]: payload}`
 */
interface FooActionPayload {
  hoge: {
    aaa: FooState['aaa'];
  };
  fuga: {
    bbb: FooState['bbb'];
  };
}

const flux = new Flux<FooState, FooActionPayload>({aaa: '', bbb: -1});
flux
  .addAction('hoge', (state, payload) => {
    const nextState = {...state};
    nextState.aaa = payload.aaa;
    return nextState;
  })
  .addAction('fuga', (state, payload) => {
    // When with the `immer`
    return produce(state, draft => {
      draft.bbb = payload.bbb;
    });
  });

// For example, when using with the Redux.
const store = redux.createStore(flux.createReducer());

// In the below, A two action is executed at the same times.
store.dispatch(flux.act('hoge', 'fuga')({aaa: 'aaa'}, {bbb: 111}));
//
// One action only.
// store.dispatch(flux.act('hoge')({aaa: 'aaa'}));
//

// Assert
expect(store.getState()).toMatchObject({aaa: 'aaa', bbb: 111});
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
