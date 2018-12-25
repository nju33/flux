export type CreateAction<AP extends {[x: string]: any}> = <
  P extends keyof AP = keyof AP
>(
  type: P,
) => (payload: AP[P]) => {type: P; payload: AP[P]};

export const createAction: CreateAction<any> = type => payload => {
  return {
    type: Symbol(type as string) as any,
    payload,
  };
};

export type ActionUnion<
  T extends {[x: string]: (...args: any[]) => any},
  U extends {[P in keyof T]: ReturnType<T[P]>} = {
    [P in keyof T]: ReturnType<T[P]>
  }
> = U[keyof U];
