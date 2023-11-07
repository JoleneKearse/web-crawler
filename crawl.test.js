const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl.js");

// 7 normalizeURL tests
test("secure protocol included", () => {
  expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
    "blog.boot.dev/path"
  );
});

test("secure protocol with no ending slash", () => {
  expect(normalizeURL("https://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("unsecure protocol with slash", () => {
  expect(normalizeURL("http://blog.boot.dev/path/")).toBe("blog.boot.dev/path");
});

test("unsecure protocol with no slash", () => {
  expect(normalizeURL("http://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("mixed cases used", () => {
  expect(normalizeURL("http://Blog.Boot.dev/path")).toBe("blog.boot.dev/path");
});

test("port included", () => {
  expect(normalizeURL("http://Blog.Boot.dev:8000/path")).toBe(
    "blog.boot.dev/path"
  );
});

test("query parameters included", () => {
  expect(normalizeURL("http://Blog.Boot.dev:8000/path?query=param")).toBe(
    "blog.boot.dev/path"
  );
});

// 4 getURLsFromHTML tests
test("basic functionality", () => {
  const htmlBody = `
    <html>
        <body>
          <a href="/relative-path-1"></a>
          <a href="https://boot.dev/absolute-path-1"></a>
        </body>
      </html>
    `;
  const baseURL = "https://boot.dev";
  const result = getURLsFromHTML(htmlBody, baseURL);
  expect(result).toEqual([
    "https://boot.dev/relative-path-1",
    "https://boot.dev/absolute-path-1",
  ]);
});

test("empty input", () => {
  expect(getURLsFromHTML("", "")).toEqual([]);
});

test("absolute links returned unchanged", () => {
  expect(
    getURLsFromHTML(
      "<a href='http://boot.dev/happy-fun-time'></a>",
      "https://boot.dev"
    )
  ).toEqual(["http://boot.dev/happy-fun-time"]);
});

test("only relative links", () => {
  expect(
    getURLsFromHTML("<a href='/happy-fun-time'></a>", "https://boot.dev")
  ).toEqual(["https://boot.dev/happy-fun-time"]);
});
