module {
  // Cross-cutting primitive type aliases
  public type Timestamp = Int; // nanoseconds since epoch (Time.now())
  public type LetterId = Text;
  public type UserId = Text; // Principal.toText() string

  // Shared Result alias
  public type Result<T, E> = { #ok : T; #err : E };
};
