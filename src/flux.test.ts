import {createAction, CreateAction, ActionUnion} from './flux';

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

test('', () => {
  const aAction: FooActionUnion = {type: 'hoge', payload: {aaa: 'aaa'}} as any;

  if (aAction.type === 'hoge') {
    expect(aAction.payload.aaa).toBe('aaa');
  }

  expect(action.hoge({aaa: 'aaa'}).payload.aaa).toBe('aaa');
});
