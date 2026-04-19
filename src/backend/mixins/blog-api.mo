import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BlogTypes "../types/blog";

mixin (
  accessControlState : AccessControl.AccessControlState,
  articles           : Map.Map<Text, BlogTypes.BlogArticle>,
  articleCounter     : { var value : Nat },
) {

  // ── Admin: create a new blog article ────────────────────────────────────────

  public shared ({ caller }) func createArticle(
    input : BlogTypes.CreateArticleInput,
  ) : async { #ok : BlogTypes.BlogArticle; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: Admin access required");
    };

    // Generate a unique id
    articleCounter.value += 1;
    let id = "article-" # articleCounter.value.toText();
    let now = Time.now();

    let article : BlogTypes.BlogArticle = {
      id;
      slug        = input.slug;
      title       = input.title;
      excerpt     = input.excerpt;
      content     = input.content;
      category    = input.category;
      authorName  = input.authorName;
      publishedAt = now;
      updatedAt   = now;
      isPublished = input.isPublished;
    };

    articles.add(id, article);
    #ok(article);
  };

  // ── Admin: update an existing blog article ───────────────────────────────────

  public shared ({ caller }) func updateArticle(
    id      : Text,
    updates : BlogTypes.UpdateArticleInput,
  ) : async { #ok : BlogTypes.BlogArticle; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: Admin access required");
    };

    switch (articles.get(id)) {
      case (null) { #err("Article not found: " # id) };
      case (?existing) {
        let updated : BlogTypes.BlogArticle = {
          existing with
          title       = switch (updates.title)       { case (?v) v; case null existing.title };
          excerpt     = switch (updates.excerpt)     { case (?v) v; case null existing.excerpt };
          content     = switch (updates.content)     { case (?v) v; case null existing.content };
          category    = switch (updates.category)    { case (?v) v; case null existing.category };
          authorName  = switch (updates.authorName)  { case (?v) v; case null existing.authorName };
          isPublished = switch (updates.isPublished) { case (?v) v; case null existing.isPublished };
          updatedAt   = Time.now();
        };
        articles.add(id, updated);
        #ok(updated);
      };
    };
  };

  // ── Public: list published articles, optionally filtered by category ─────────

  public query func listArticles(
    categoryFilter : ?Text,
  ) : async [BlogTypes.BlogArticle] {
    let matched = List.empty<BlogTypes.BlogArticle>();

    articles.forEach(func(_ : Text, article : BlogTypes.BlogArticle) {
      if (not article.isPublished) { return };
      switch (categoryFilter) {
        case (null) { matched.add(article) };
        case (?cat) {
          let articleCat = switch (article.category) {
            case (#Debt)          "Debt";
            case (#Landlord)      "Landlord";
            case (#Employment)    "Employment";
            case (#Refund)        "Refund";
            case (#PropertyDamage) "PropertyDamage";
            case (#CeaseDesist)   "CeaseDesist";
            case (#Insurance)     "Insurance";
            case (#Contractor)    "Contractor";
          };
          if (articleCat == cat) { matched.add(article) };
        };
      };
    });

    // Sort newest first by publishedAt (descending)
    let sorted = matched.sort(func(a : BlogTypes.BlogArticle, b : BlogTypes.BlogArticle) : Order.Order {
      if (a.publishedAt > b.publishedAt)      #less
      else if (a.publishedAt < b.publishedAt) #greater
      else                                     #equal
    });
    sorted.toArray();
  };

  // ── Public: get a single published article by slug ───────────────────────────

  public query func getArticleBySlug(slug : Text) : async ?BlogTypes.BlogArticle {
    var result : ?BlogTypes.BlogArticle = null;
    articles.forEach(func(_ : Text, article : BlogTypes.BlogArticle) {
      if (article.slug == slug and article.isPublished) {
        result := ?article;
      };
    });
    result;
  };
};
