---
title: "Cutting a container image from 1.2 GB to 40 MB"
date: "2026-07-04"
excerpt: "A walkthrough of the multi-stage build, base image swap, and layer ordering that took one of my deployment images down by 96%."
---

I inherited a Dockerfile that produced a 1.2 GB image for a service whose compiled binary was under 8 MB. Nothing about it was unusual — it was the shape most Dockerfiles drift into when nobody measures them.

## Where the weight was

Running `docker history` on the image told the whole story in about four lines:

- The base image was a full distribution with a package manager, docs, and locales.
- The build toolchain — compiler, headers, build deps — stayed in the final image.
- Source, intermediate objects, and the package cache were all baked into layers.
- Each `RUN` that installed something added its own cache layer that a later `rm` couldn't actually remove.

That last point is the one that catches people. Deleting a file in a later layer doesn't reclaim the space; it just adds a whiteout entry. The bytes are still in the image.

## The three changes

**Multi-stage build.** The build stage keeps the compiler and the sources. The final stage starts fresh and copies in exactly one artifact — the binary. Everything the build needed simply never exists in the shipped image.

**A smaller base.** Swapping the full distribution for a minimal one removed the package manager and the locale data. For a statically linked binary you can go further and use a distroless or scratch base, though you give up having a shell to debug with.

**Layer ordering.** Dependencies change rarely, application code changes constantly. Putting the dependency install above the source copy means a code change reuses the cached dependency layer instead of rebuilding it. This doesn't shrink the image, but it took rebuild times from minutes to seconds.

## The result

40 MB, and a build that finishes fast enough that I stopped avoiding it. The image is also meaningfully safer — there's no shell, no package manager, and no compiler sitting in a production container waiting to be useful to someone else.

The general lesson: measure before optimising. `docker history` and `dive` answered in five minutes a question I'd have guessed wrong about for an hour.
