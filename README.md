# flux

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
import {createAction, CreateAction, ActionUnion} from '@nju33/flux';
````

## Example

```ts
interface FooState {
  aaa: string;
  bbb: string;
}

interface FooActionPayload {
  hoge: {
    aaa: FooState['aaa'];
  };
  fuga: {
    bbb: FooState['bbb'];
  };
}

const createFooAction = createAction as CreateAction<FooActionPayload>;
const action = {
  hoge: createFooAction('hoge'),
  fuga: createFooAction('fuga'),
};

type FooActionUnion = ActionUnion<typeof action>;

const aAction: FooActionUnion = {type: 'hoge', payload: {aaa: 'aaa'}} as any;

if (aAction.type === 'hoge') {
  expect(aAction.payload.aaa).toBe('aaa');
}

expect(action.hoge({aaa: 'aaa'}).payload.aaa).toBe('aaa');

// action.hoge({aaa: 'aaa'});
// -> {type: Symbol(hoge), payload: {aaa: 'aaa'}}
```
