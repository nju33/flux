# @nju33/flux

A Flux utility.

[![github](https://badgen.net/badge//nju33,flux/000?icon=github&list=1)](https://github.com/nju33/flux)
[![npm:version](https://badgen.net/npm/v/@nju33/flux?icon=npm&label=)](https://www.npmjs.com/package/@nju33/flux)
[![typescript](https://badgen.net/badge/lang/typescript/0376c6?icon=npm)](https://www.typescriptlang.org/)
[![ci:status](https://badgen.net/circleci/github/nju33/flux)](https://circleci.com/gh/nju33/flux)
[![dependencies Status](https://david-dm.org/nju33/flux/status.svg)](https://david-dm.org/nju33/flux)
[![devDependencies Status](https://david-dm.org/nju33/flux/dev-status.svg)](https://david-dm.org/nju33/flux?type=dev)
[![document:typedoc](https://badgen.net/badge/document/typedoc/9602ff)](https://docs--nju33-flux.netlify.com/)
[![license](https://badgen.net/npm/license/@nju33/flux)](https://github.com/nju33/flux/blob/master/LICENSE)
[![browserslist](https://badgen.net/badge/browserslist/chrome,edge/ffd539?list=1)](https://browserl.ist/?q=last+1+chrome+version%2C+last+1+edge+version)

## Usage

````js
/**
 * To prepare of using the `Flux`
 * ```sh
 * yarn add @nju33/flux
 * ```
 */
import Flux from '@nju33/flux';
````

or

```html
<script src="https://unpkg.com/@nju33/flux/flux.js"></script>
<script>
  // Can use the `Flux` here.
</script>
```

## Example by TypeScript

```ts
interface State {
  str: string;
  num: number;
  bool: boolean;
}

/**
 * define  in the form of `{[actionName]: payload}`
 */
interface ActionPayload {
  foo: {
    str: State['str'];
  };
  bar: {
    num: State['num'];
  };
  baz: {
    bool: State['bool'];
  };
}

type NameSpace = 'something';

const flux = new Flux<State, ActionPayload, NameSpace>({
  str: '',
  num: -1,
  bool: false,
});

const reducer = flux
  .addAction('foo', (state, payload) => {
    // produce === `immer`
    return produce(state, draft => {
      draft.str = payload.str;
    });
  })
  .addAction('bar', (state, payload) => {
    return produce(state, draft => {
      draft.num = payload.num;
    });
  })
  .addAction(
    'baz',
    (state, payload) => {
      return produce(state, draft => {
        draft.bool = payload.bool;
      });
    },
    // belongs to the 'something' scope
    ['something'],
  )
  .createReducer();

// For example, when using with the Redux.
const store = createStore(reducer);

// By function
store.dispatch(flux.act(({foo}) => [foo({str: 'foo'})]));
console.log('1. ', store.getState());

// By curried
const multiAct = flux.act('foo', 'bar');
store.dispatch(multiAct({str: 'foo2'}, {num: 222}));
console.log('2. ', store.getState());

// It does not process actions belonging to the 'something' scope
// Thus, `bool` remaining `false`
flux.off('something');
store.dispatch(flux.act(({baz}) => [baz({bool: true})]));
console.log('3. ', store.getState());

flux.allOn();
store.dispatch(flux.act(({baz}) => [baz({bool: true})]));
console.log('4. ', store.getState());
```

[![Edit @nju33/flux](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/52p9oy8lyx?module=%2Fsrc%2Findex.ts)

#### Tips / I want to define a action which have not payload nothing.

You should use `void` as type of payload. Here is an example.

```ts
interface ActionPayload {
  voidIncrement: void;
  undefinedIncrement: undefined;
}

// ...

flux.act(({voidIncrement}) => [
  increment(),

  // Expected 1 arguments, but got 0.
  // undefinedIncrement(),
  undefinedIncrement(undefined),
]);
```

### Very useful functions

In addition, [camelcase-keys](https://github.com/sindresorhus/camelcase-keys) and [snakecase-keys](https://github.com/bendrucker/snakecase-keys) packages are included in this, because it is used a lot.

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
