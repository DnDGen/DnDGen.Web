# DnDGen.Web Constitution
<!-- Example: DnDGen.Web Constitution -->

> **Read the [DnDGen constitution](https://github.com/DnDGen/.github/blob/main/constitution/CONSTITUTION.md)
> first, in full, every time this file is read.** Fetch it from
> https://raw.githubusercontent.com/DnDGen/.github/main/constitution/CONSTITUTION.md rather than
> relying on memory or an earlier copy. Its principles, constraints, workflow, and governance apply
> to this repository, and every plan, task list, analysis, and review is checked against it as well
> as against this file. This file adds only what is specific to this repository, under the DnDGen
> constitution's labels. If the DnDGen constitution can't be read, stop and say so: don't continue
> from this file alone.
<!-- Keep the pointer above exactly as written: it is what makes every Spec Kit command read the
DnDGen constitution. See https://github.com/DnDGen/.github/tree/main/constitution -->

## Core Principles

### I. Consistency Is King

No additions.

### II. Tests Are the Spec

**II.2.c (Web)** Coverage is the combined line and branch coverage of each API's production DLL
(`DnDGen.Api.dll`, and one per API), and the coverage of the Angular website (dndgen-web/), across
each project's unit and integration tests. It stays at 100% per DLL and for the website. An
uncovered line is either a missing case or code that can never run.

### III. Leave It Better Than You Found It

**III.1.a (Web)** Packages are updated per-project, not solution-wide. This mono-repo contains
APIs targeting different .NET versions, so a package version valid for one API may not be
compatible with another. An update to a package that has a different valid range per API is applied
to each API independently, with the reason stated in the pull request.

## Technology & Release Constraints

- **Stack**: Seven C# Azure Function App APIs (isolated worker process) targeting LTS .NET
  releases, with Ninject for dependency injection. NUnit and Moq for unit and integration tests.
  The Angular website (dndgen-web/) with Vitest for tests.
- **Versioning and release**: Not a NuGet package. Deployed to Azure via CI/CD (Azure Pipelines).
  Each build on `main` is tagged with the pipeline build number. `cicd/build.yml` builds, tests,
  and smoke-tests all seven APIs and the website in parallel; `cicd/release.yml` deploys to Azure.
- **README as contract**: Documents the live website (DnDGen.com) and each of the seven public
  APIs: their base URL, Swagger UI link, and a summary of their V1 and V2 HTTP routes (method,
  path, parameters, return value). Swagger UI is the authoritative per-API reference; the README's
  route tables are a quick reference kept in step with the code. The theme song is in
  `docs/theme-song`. README tests live in `DnDGen.Web.Tests.Integration` and verify the theme song
  badge, section, and song links.

## Governance

This repository follows the DnDGen constitution's Governance. The additions in this file are
amended by pull request to this repository and versioned the same way.

**Version**: 1.0.0 | **Ratified**: TODO | **Last Amended**: 2026-11-02
