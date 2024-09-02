import Bool "mo:base/Bool";
import Result "mo:base/Result";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Error "mo:base/Error";

actor {
  type File = {
    id: Nat;
    name: Text;
    size: Nat;
    createdAt: Time.Time;
    isFolder: Bool;
  };

  stable var nextId : Nat = 0;
  stable var files : [File] = [];

  public func init() : async () {
    Debug.print("Initializing canister");
  };

  system func preupgrade() {
    Debug.print("Executing pre-upgrade hook");
  };

  system func postupgrade() {
    Debug.print("Executing post-upgrade hook");
  };

  public query func getFiles() : async [File] {
    files
  };

  public func addFile(name: Text, size: Nat, isFolder: Bool) : async Result.Result<Nat, Text> {
    if (Text.size(name) == 0) {
      return #err("File name cannot be empty");
    };
    if (size == 0 and not isFolder) {
      return #err("File size must be greater than 0");
    };
    let newFile : File = {
      id = nextId;
      name = name;
      size = size;
      createdAt = Time.now();
      isFolder = isFolder;
    };
    files := Array.append(files, [newFile]);
    nextId += 1;
    #ok(newFile.id)
  };

  public func deleteFile(id: Nat) : async Result.Result<(), Text> {
    let index = Array.indexOf<File>({ id = id; name = ""; size = 0; createdAt = 0; isFolder = false }, files, func(a: File, b: File) : Bool { a.id == b.id });
    switch (index) {
      case (?i) {
        files := Array.tabulate<File>(files.size() - 1, func(j: Nat) : File {
          if (j < i) { files[j] } else { files[j + 1] }
        });
        #ok()
      };
      case null { #err("File not found") };
    }
  };

  public query func healthCheck() : async Text {
    "Canister is healthy"
  };

  public shared func throwError() : async () {
    Debug.print("Throwing a test error");
    throw Error.reject("This is a test error");
  };
}
