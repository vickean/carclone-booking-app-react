export interface Action<TType = string, TPayload = any> {
   type: TType;
   payload: TPayload;
}
