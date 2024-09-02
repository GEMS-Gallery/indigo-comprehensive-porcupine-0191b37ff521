export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const File = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'createdAt' : Time,
    'size' : IDL.Nat,
    'isFolder' : IDL.Bool,
  });
  return IDL.Service({
    'addFile' : IDL.Func([IDL.Text, IDL.Nat, IDL.Bool], [Result_1], []),
    'deleteFile' : IDL.Func([IDL.Nat], [Result], []),
    'getFiles' : IDL.Func([], [IDL.Vec(File)], ['query']),
    'healthCheck' : IDL.Func([], [IDL.Text], ['query']),
    'init' : IDL.Func([], [], []),
    'throwError' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
