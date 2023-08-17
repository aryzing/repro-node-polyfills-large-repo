# Reproduction: large project failing with vite-plugin-node-polyfills

This project fails to build when `vite-plugin-node-polyfills` is included as a Vite plugin.

Note that this reproduction repo is a fork of https://github.com/hirosystems/wallet, and is a PoC for migrating from Webpack to Vite. There may be other errors during/after the build, although this reproduction repo is solely aimed at helping debug issues with `vite-plugin-node-polyfills`.

Building for dev:

```
yarn && yarn vite
```

The error generated as of `vite-plugin-node-polyfills` `v0.11.2` is

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory

 1: 0xc98550 node::Abort() [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 2: 0xb700a7  [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 3: 0xebae80 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 4: 0xebb167 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, v8::OOMDetails const&) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 5: 0x10cc7d5  [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 6: 0x10e4658 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 7: 0x10ba771 v8::internal::HeapAllocator::AllocateRawWithLightRetrySlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 8: 0x10bb905 v8::internal::HeapAllocator::AllocateRawWithRetryOrFailSlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
 9: 0x1098e76 v8::internal::Factory::NewFillerObject(int, v8::internal::AllocationAlignment, v8::internal::AllocationType, v8::internal::AllocationOrigin) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
10: 0x14f3ca6 v8::internal::Runtime_AllocateInYoungGeneration(int, unsigned long*, v8::internal::Isolate*) [/home/user/.nvm/versions/node/v20.5.1/bin/node]
11: 0x7f93f7ed9ef6
Aborted (core dumped)
```
