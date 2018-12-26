export interface HandlePayload<
  AP extends {[x: string]: any},
  P extends keyof AP
> {
  (payload: AP[P]): {type: P; payload: AP[P]};
  type: P;
}

export type CreateAction<AP extends {[x: string]: any}> = <
  P extends keyof AP = keyof AP
>(
  type: P,
) => HandlePayload<AP, P>;

export const createAction: CreateAction<any> = type => {
  const symbolType = Symbol(type as string) as any;

  const payloadFn: HandlePayload<any, any> = function(payload: any) {
    return {
      type: symbolType,
      payload,
    };
  };
  payloadFn.type = symbolType;

  return payloadFn;
};

export type ActionUnion<
  T extends {[x: string]: (...args: any[]) => any},
  U extends {[P in keyof T]: ReturnType<T[P]>} = {
    [P in keyof T]: ReturnType<T[P]>
  }
> = U[keyof U];
