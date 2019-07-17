# graphql2ts

Transform .graphql files to graphql-js typescript code

## History
We first had [graphql-js](https://github.com/graphql/graphql-js) implementation, but developers weren't happy with it.
So it was born schema first with [graphql-tools](), [merge-graphql-schemas](https://github.com/Urigo/merge-graphql-schemas), [graphql-modules](https://github.com/Urigo/graphql-modules).

There is also a codemod to transform your .js files to .graphql files: 
[jscodeshift-graphql-files](https://github.com/withspectrum/jscodeshift-graphql-files).

After a lot of time, schema first showed some scaling problems, [Schema First Problems](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3), mostly because it does not colocate schema with resolvers, and code is much more powerful to implement abstraction on top of it.

This codemod exists to helps us move back to code first approach (graphql-js and related tools).

It will transform a .graphql file and transform in a graphql-js .ts declartion


## How to run
```bash
npx graphql2ts myschema.graphql mySchemaOutput.ts
```

## How to test
```
yarn jest
```
