# Layered Architecture Rules (Generic Project Standard)

## Purpose

This document defines the architectural layering rules for this
project.\
These rules are mandatory and are intended to ensure scalability,
testability, maintainability, and strict separation of concerns.

---

# Core Layers

The system is divided into four primary layers:

1.  Handlers (Transport Layer)
2.  Workflows (Application Layer)
3.  Services (Domain Layer)
4.  Repositories (Data Access Layer)

Each layer has clearly defined responsibilities and strict interaction
rules.

---

# 1. Handlers

## Responsibility

Handlers act as the transport boundary of the system. They adapt
external requests (HTTP, RPC, etc.) into application-level workflow
calls.

## Allowed To:

- Validate and parse input
- Extract session/context data
- Call a single workflow
- Map domain errors to transport responses
- Return serialized output

## Not Allowed To:

- Contain business logic
- Access the database directly
- Call repositories
- Orchestrate multiple workflows
- Contain domain rules

## Mental Model

Handler = Thin entry adapter

---

# 2. Workflows

## Responsibility

Workflows represent complete business use cases. They orchestrate domain
services and repositories to fulfill a user-driven operation.

## Allowed To:

- Coordinate services
- Call repositories
- Enforce high-level process rules
- Manage transactions
- Emit side effects (notifications, events)

## Not Allowed To:

- Access transport layer concepts (HTTP, sessions)
- Contain raw SQL or direct database logic
- Call other workflows
- Bypass domain services

## Mental Model

Workflow = Full business operation

---

# 3. Services

## Responsibility

Services encapsulate reusable domain logic and business rules.

## Allowed To:

- Perform calculations
- Validate invariants
- Enforce state transitions
- Apply policy logic
- Be reused across workflows

## Not Allowed To:

- Access transport concerns
- Call handlers
- Access the database directly
- Orchestrate full workflows

## Mental Model

Service = Business rules engine

---

# 4. Repositories

## Responsibility

Repositories abstract all database access and persistence operations.

## Allowed To:

- Execute queries
- Map persistence errors
- Return domain-compatible models

## Not Allowed To:

- Contain business rules
- Call services
- Call workflows
- Access transport concerns

## Mental Model

Repository = Database adapter

---

# Strict Layer Interaction Rules

## 1. Downward-Only Dependency Rule

Layers may only depend on layers below them:

Transport (Handler) ↓ Application (Workflow) ↓ Domain (Service) ↓ Data
(Repository)

Upward calls are forbidden.

---

## 2. No Sibling Communication Rule

A layer may NOT call another component within the same layer.

Examples of forbidden interactions:

- A workflow calling another workflow
- A service calling another service directly for orchestration
- A repository calling another repository for logic coordination
- A handler calling another handler

If coordination is required, it must be elevated to the appropriate
higher layer.

---

## 3. No Layer Skipping

Each layer must respect the boundary below it.

Examples:

- Handlers cannot call repositories directly.
- Workflows cannot bypass services to embed business rules in
  repositories.
- Services cannot directly execute database operations.

---

# Execution Flow

Standard request execution order:

External Request → Handler → Workflow → Services → Repositories →
Database

Side effects are triggered inside the Workflow layer only.

---

# Architectural Benefits

Following these rules ensures:

- Deterministic behavior
- High testability
- Replaceable persistence layer
- Clear domain modeling
- Reduced coupling
- Predictable dependency graph
- Long-term scalability

---

# Enforcement Guidelines

- All database calls must live inside repositories.
- All business rules must live inside services.
- All orchestration must live inside workflows.
- All transport logic must live inside handlers.
- No sibling calls are allowed.
- No upward calls are allowed.
- No cross-layer shortcuts are allowed.

Violations must be refactored immediately.

---

End of Document
