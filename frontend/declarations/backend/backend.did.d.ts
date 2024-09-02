import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface File {
  'id' : bigint,
  'name' : string,
  'createdAt' : Time,
  'size' : bigint,
  'isFolder' : boolean,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'addFile' : ActorMethod<[string, bigint, boolean], Result_1>,
  'deleteFile' : ActorMethod<[bigint], Result>,
  'getFiles' : ActorMethod<[], Array<File>>,
  'healthCheck' : ActorMethod<[], string>,
  'init' : ActorMethod<[], undefined>,
  'throwError' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
