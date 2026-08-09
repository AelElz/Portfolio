---
title: "Rebuilding minishell, three years later"
date: "2026-06-12"
excerpt: "I went back to a project I finished in 2023 and rewrote the parser from scratch. Here's what I'd do differently, and why the second attempt was harder than the first."
---

Every so often I reopen an old repository and try to read it as if someone else wrote it. `minishell` was the one that made me wince the most — not because the code was wrong, but because the parser and the executor were tangled together in a way that made every new feature a negotiation.

## The original design

The first version parsed and executed in a single pass. Tokens came off the input, and as soon as the tokenizer recognised a pipe it forked. That works right up until you need to handle a heredoc inside a pipeline, at which point you're reading from stdin while you're also trying to wire up file descriptors.

It shipped, it passed the tests, and I moved on.

## What changed on the rewrite

The rewrite splits the work into three clean stages:

1. **Lex** — turn the raw line into a token stream, resolving quotes and expansions but nothing structural.
2. **Parse** — build an AST of commands, pipelines, and redirections. No syscalls happen here at all.
3. **Execute** — walk the tree, fork where the tree says to fork, and wire descriptors from the node's own redirection list.

The surprising part was that stage two took longer than the entire original project. Once you commit to a real AST you have to answer questions the single-pass version let you dodge — what does an empty pipeline segment mean, where do syntax errors get reported, how does a subshell inherit its parent's redirections.

## The lesson

The first version was faster to write because it let the shape of the input drive the shape of the program. The second version is slower to write and far easier to change. I don't think either is universally correct, but I now know which one I want when the project is going to outlive the deadline.
