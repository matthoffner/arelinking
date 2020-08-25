# arelinking

Simple cli to check if a page is linking to another domain.

```sh
node arelinking.js mydomain https://theirdomain.com
```

Additionally will attempt to crawl one level deeper if domain found on the initial page, defaulting to a random 5 links.

## Credits

[pagelinks](https://github.com/zrrrzzt/pagelinks)