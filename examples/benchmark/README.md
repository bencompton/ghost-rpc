# Benchmark: Ghost RPC Fastify vs. Plain Fastify

## Overview

This benchmark leverages the `productSearchService.getFeaturedProducts` service operation from the Shopping Cart App example, pitting this operation being called from a plain Fastify HTTP endpoint against calling it from a Ghost RPC Fastify endpoint.

To execute this benchmark, clone this repository and run the following:

```bash
cd examples/benchmark/
npm install
npm start
```

## Results

 The Ghost RPC Fastify plug-in is an abstraction on top of Fastify, and as one might expect, introduces a slight performance penalty. The current version of Ghost RPC has not undergone any performance tuning to date, so performance is likely to improve in the future. In addition, support for a stand-alone Ghost RPC HTTP server is planned, which will likely improve performance.

These results were obtained by running this benchmark in Git Bash on a Windows 10 machine with an Intel Core i7-8850H CPU and 32GB of RAM. With 10 connections, Ghost RPC running in Fastify had 1.2x higher average latency per request than Fastify alone and yielded 10% fewer requests per second. With 100 connections, Ghost RPC had 1.03x higher latency than plain Fastify, with 5% fewer requests per second.

Above 100 connections, a lot of the requests appeared to time out with both plain Fastify and Ghost RPC, which would likely be mitigated by running more than one autocannon worker in this benchmark. The results with > 100 connections are not particularly valid, and are therefore omitted here.

### 10 Connections

```bash
Running benchmark for "Ghost RPC - 10 connections"

Running 60s test @ http://localhost:8080
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 2 ms │ 3 ms │ 5 ms  │ 6 ms │ 3.19 ms │ 1.08 ms │ 48 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 1300   │ 1900   │ 2913    │ 3009    │ 2835.74 │ 259.73 │ 1300   │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 514 kB │ 751 kB │ 1.15 MB │ 1.19 MB │ 1.12 MB │ 103 kB │ 514 kB │
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴────────┴────────┘

Req/Bytes counts sampled once per second.

170k requests in 60.06s, 67.2 MB read

Benchmark "Ghost RPC - 10 connections" complete
```

```bash
Running benchmark for "Fastify - 10 connections"

Running 60s test @ http://localhost:8080/featured-products
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 2 ms │ 3 ms │ 4 ms  │ 5 ms │ 2.62 ms │ 1.05 ms │ 43 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min    │
├───────────┼────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┤
│ Req/Sec   │ 2131   │ 2921    │ 3181    │ 3359    │ 3137.74 │ 171.9   │ 2130   │
├───────────┼────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┤
│ Bytes/Sec │ 778 kB │ 1.07 MB │ 1.16 MB │ 1.23 MB │ 1.14 MB │ 62.8 kB │ 777 kB │
└───────────┴────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

188k requests in 60.05s, 68.7 MB read
```

### 100 Connections

```bash
Running benchmark for "Ghost RPC - 100 connections"

Running 60s test @ http://localhost:8080
100 connections

┌─────────┬───────┬───────┬───────┬───────┬───────┬─────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg   │ Stdev   │ Max    │
├─────────┼───────┼───────┼───────┼───────┼───────┼─────────┼────────┤
│ Latency │ 31 ms │ 34 ms │ 46 ms │ 64 ms │ 35 ms │ 5.25 ms │ 106 ms │
└─────────┴───────┴───────┴───────┴───────┴───────┴─────────┴────────┘
┌───────────┬────────┬─────────┬─────────┬────────┬─────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%    │ 50%     │ 97.5%  │ Avg     │ Stdev   │ Min    │
├───────────┼────────┼─────────┼─────────┼────────┼─────────┼─────────┼────────┤
│ Req/Sec   │ 2429   │ 2601    │ 2865    │ 3037   │ 2844.8  │ 124.26  │ 2428   │
├───────────┼────────┼─────────┼─────────┼────────┼─────────┼─────────┼────────┤
│ Bytes/Sec │ 959 kB │ 1.03 MB │ 1.13 MB │ 1.2 MB │ 1.12 MB │ 49.1 kB │ 959 kB │
└───────────┴────────┴─────────┴─────────┴────────┴─────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

171k requests in 60.6s, 67.4 MB read
```

```bash
Benchmark "Ghost RPC - 100 connections" complete

Running benchmark for "Fastify - 100 connections"

Running 60s test @ http://localhost:8080/featured-products
100 connections

┌─────────┬───────┬───────┬───────┬───────┬──────────┬─────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼─────────┼────────┤
│ Latency │ 29 ms │ 33 ms │ 42 ms │ 48 ms │ 33.74 ms │ 4.05 ms │ 114 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min    │
├───────────┼────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┤
│ Req/Sec   │ 2729   │ 2801    │ 2937    │ 3201    │ 2947.07 │ 91.5    │ 2728   │
├───────────┼────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┤
│ Bytes/Sec │ 996 kB │ 1.02 MB │ 1.07 MB │ 1.17 MB │ 1.08 MB │ 33.5 kB │ 996 kB │
└───────────┴────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

177k requests in 60.56s, 64.5 MB read

Benchmark "Fastify - 100 connections" complete
```
