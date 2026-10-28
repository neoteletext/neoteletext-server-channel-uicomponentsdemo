// A control's onChange that keeps its value in one field of a component's
// state, for the many pages whose controls each own a field.

import type { Component } from "neoteletext-server-ts-ui-components";

/** A change of state to build field by field. */
type Change<S> = { -readonly [Key in keyof S]?: S[Key] };

export function setterOf<S extends object, Key extends keyof S>(component: Component<object, S>, key: Key): (value: S[Key]) => void {
  return (value) => {
    const change: Change<S> = {};
    // oxlint-disable-next-line unicorn/no-immediate-mutation -- TypeScript refuses a generic key in an object literal (TS2322: the literal's type is an index signature), so the one field is set on an empty change.
    change[key] = value;
    component.setState(change);
  };
}
