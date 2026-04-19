module {
  /// Variant representing the category of a blog article.
  public type BlogCategory = {
    #Debt;
    #Landlord;
    #Employment;
    #Refund;
    #PropertyDamage;
    #CeaseDesist;
    #Insurance;
    #Contractor;
  };

  /// A published or draft blog article stored in the canister.
  public type BlogArticle = {
    id          : Text;
    slug        : Text;
    title       : Text;
    excerpt     : Text;
    content     : Text; // full HTML or markdown body
    category    : BlogCategory;
    authorName  : Text;
    publishedAt : Int;  // Common.Timestamp (nanoseconds)
    updatedAt   : Int;  // Common.Timestamp (nanoseconds)
    isPublished : Bool;
  };

  /// Input required to create a new article.
  public type CreateArticleInput = {
    slug        : Text;
    title       : Text;
    excerpt     : Text;
    content     : Text;
    category    : BlogCategory;
    authorName  : Text;
    isPublished : Bool;
  };

  /// Input for updating an existing article — all fields optional.
  public type UpdateArticleInput = {
    title       : ?Text;
    excerpt     : ?Text;
    content     : ?Text;
    category    : ?BlogCategory;
    authorName  : ?Text;
    isPublished : ?Bool;
  };
};
