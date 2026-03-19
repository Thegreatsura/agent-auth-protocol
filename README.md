# Agent Auth Protocol

The open-source standard and implementation for AI agent authentication, capability-based authorization, and service discovery.

**Website:** [agent-auth-protocol.com](https://agent-auth-protocol.com)

## Overview

AI agents are becoming long-lived actors — copilots, background workers, scheduled automations, and multi-step systems that call external services without constant human supervision. Today's auth models were not designed with this in mind.

The Agent Auth Protocol solves three fundamental problems:

- **Delegated agents** — When agents act on behalf of users, there's no visibility, scoping, or isolation between agents sharing the same credentials.
- **Autonomous agents** — There's no identity model for agents operating without a human in the loop. Agents are forced to impersonate human users just to use a service.
- **Discovery** — There's no standard way for a service to advertise that it supports agents, what capabilities it offers, or how an agent should authenticate.

The root cause is simple: **agents today do not have identity.** This protocol gives them one.

## Specification

Read the full specification at [agent-auth-protocol.com/specification](https://agent-auth-protocol.com/specification).

## SDKs & Implementation

The protocol has official implementations covering all parts of the specification, maintained by the team behind [Better Auth](https://better-auth.com).

See [agent-auth-protocol.com/docs/sdks](https://agent-auth-protocol.com/docs/sdks) for available SDKs.

## Authors

- Paola Estefanía de Campos
- Bereket Engida

## License

MIT
