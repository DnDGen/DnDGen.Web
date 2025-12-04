# Design Document

## Overview

The CreatureGen API is an Azure Functions-based REST API that provides endpoints for generating and validating D&D creatures. It follows the established architectural patterns used across all DnDGen APIs, including:

- Azure Functions with HTTP triggers for serverless execution
- OpenAPI attributes for automatic Swagger documentation generation
- Dependency injection using Ninject via the DnDGen.CreatureGen NuGet package
- Comprehensive unit and integration testing
- CI/CD pipeline integration with automated deployment and post-deployment testing

The API exposes four primary endpoints:
1. Generate a specific creature with optional filters
2. Validate parameters for specific creature generation
3. Generate a random creature with optional constraints
4. Validate parameters for random creature generation

## Architecture

### Technology Stack

- **Runtime**: .NET 8 (Azure Functions v4)
- **API Framework**: Azure Functions with HTTP triggers
- **Documentation**: OpenAPI/Swagger via Microsoft.Azure.WebJobs.Extensions.OpenApi
- **Dependency Injection**: Ninject (via DnDGen.CreatureGen.IoC)
- **Core Library**: DnDGen.CreatureGen NuGet package
- **Testing**: NUnit for unit and integration tests
- **Mocking**: Moq for unit test dependencies
- **Deployment**: Azure Functions on Azure

### Project Structure

```
DnDGen.Api.CreatureGen/
├── Dependencies/
│   ├── IDependencyFactory.cs
│   └── NinjectDependencyFactory.cs
├── Functions/
│   ├── GenerateCreatureFunction.cs (existing, needs completion)
│   ├── ValidateCreatureFunction.cs (existing, needs completion)
│   ├── GenerateRandomCreatureFunction.cs (new)
│   └── ValidateRandomCreatureFunction.cs (new)
├── Models/
│   └── CreatureSpecifications.cs (existing, may need updates)
├── Validators/
│   └── CreatureValidator.cs (existing, may need updates)
├── Program.cs
├── Startup.cs
└── host.json

DnDGen.Api.CreatureGen.Tests.Unit/
├── Functions/ (test classes for each function)
├── Models/ (test classes for models)
└── Validators/ (test classes for validators)

DnDGen.Api.CreatureGen.Tests.Integration/
├── Functions/ (integration tests for each function)
├── IntegrationTests.cs (base class)
├── IoCTests.cs (dependency injection tests)
└── StartupTests.cs (startup configuration tests)
```

## Components and Interfaces

### 1. Azure Functions (Endpoints)

#### GenerateCreatureFunction
- **Route**: `GET /v1/creature/{creatureName}/generate`
- **Parameters**:
  - `creatureName` (path, required): The creature to generate
  - `alignment` (query, optional): Desired alignment filter
  - `templates` (query, optional, array): Templates to apply in order
- **Response**: 200 OK with Creature object, or 400 Bad Request on invalid parameters
- **Dependencies**: ICreatureVerifier, ICreatureGenerator
- **Note**: creatureType and challengeRating parameters are NOT supported for specific creature generation - they only apply to random generation. asCharacter is NOT supported at all - use CharacterGen API for character generation

#### ValidateCreatureFunction
- **Route**: `GET /v1/creature/{creatureName}/validate`
- **Parameters**:
  - `creatureName` (path, required): The creature to validate
  - `alignment` (query, optional): Desired alignment filter
  - `templates` (query, optional, array): Templates to validate
- **Response**: 200 OK with boolean indicating validity
- **Dependencies**: ICreatureVerifier
- **Note**: creatureType and challengeRating parameters are NOT supported for specific creature validation. asCharacter is NOT supported at all - use CharacterGen API for character generation

#### GenerateRandomCreatureFunction
- **Route**: `GET /v1/creature/random/generate`
- **Parameters**:
  - `creatureName` (query, optional): Base creature name
  - `alignment` (query, optional): Alignment constraint
  - `creatureType` (query, optional): Creature type constraint
  - `challengeRating` (query, optional): Challenge rating constraint
  - `templates` (query, optional, array): Templates to apply
- **Response**: 200 OK with Creature object, or 400 Bad Request on invalid parameters
- **Dependencies**: ICreatureVerifier, ICreatureGenerator
- **Note**: asCharacter parameter is NOT supported - use CharacterGen API for character generation

#### ValidateRandomCreatureFunction
- **Route**: `GET /v1/creature/random/validate`
- **Parameters**: Same as GenerateRandomCreatureFunction
- **Response**: 200 OK with boolean indicating validity
- **Dependencies**: ICreatureVerifier
- **Note**: asCharacter parameter is NOT supported - use CharacterGen API for character generation

### 2. Models

#### CreatureSpecifications
Encapsulates and validates all creature generation parameters:
- `Creature`: string (validated creature name)
- `Filters`: Filters object containing alignment, type, challenge rating, and templates
- Note: AsCharacter is not used by the API - CharacterGen API should be used for character generation

The model provides methods to:
- Set and validate creature name against known creatures
- Set and validate filters against known values
- Check overall validity of the specification

### 3. Validators

#### CreatureValidator
Static helper class that:
- Extracts parameters from HttpRequestData
- Creates and populates CreatureSpecifications
- Validates parameter combinations
- Returns validation results with error messages

### 4. Dependencies

#### IDependencyFactory
Interface for dependency resolution, implemented by NinjectDependencyFactory which loads the CreatureGen IoC modules.

## Data Models

### Input Models

**CreatureSpecifications**
```csharp
{
    Creature: string,
    Filters: {
        Alignment: string,
        Type: string, // Only used for random generation
        ChallengeRating: string, // Only used for random generation
        Templates: string[],
        CleanTemplates: IEnumerable<string> // Filters out null/empty
    }
}
```

### Output Models

**Creature** (from DnDGen.CreatureGen)
```csharp
{
    Name: string,
    Summary: string,
    Size: string,
    Type: { Name: string, SubTypes: string[] },
    Alignment: { Full: string },
    ChallengeRating: string,
    HitPoints: { Total: int, ... },
    Abilities: { Strength: {...}, Dexterity: {...}, ... },
    Skills: Skill[],
    Attacks: Attack[],
    SpecialQualities: SpecialQuality[],
    // ... additional creature properties
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid creature names produce successful generation
*For any* valid creature name from the CreatureConstants collection, when passed to the generate endpoint with no filters, the API should return HTTP 200 with a fully populated Creature object.
**Validates: Requirements 1.1, 5.4**

### Property 2: Invalid creature names are rejected
*For any* string that is not a valid creature name, when passed to the generate or validate endpoint, the API should return HTTP 400 or validation false.
**Validates: Requirements 2.2, 5.1**

### Property 3: Template application order is preserved
*For any* valid creature and any ordered list of valid templates, when templates are applied during generation, they should be applied in the exact order specified in the request.
**Validates: Requirements 1.2, 3.3**

### Property 4: Specific generation respects alignment filter
*For any* valid creature and any valid alignment, when specific creature generation is requested with that alignment filter, the returned creature should have that alignment if compatible.
**Validates: Requirements 1.3**

### Property 5: Random generation respects all filter constraints
*For any* combination of valid filters (alignment, creature type, challenge rating), when random creature generation is requested with those filters, the returned creature should satisfy all provided filter constraints.
**Validates: Requirements 3.4**

### Property 6: Validation matches generation compatibility
*For any* set of parameters, if the validate endpoint returns true, then the generate endpoint with the same parameters should successfully return a creature (not fail with incompatibility).
**Validates: Requirements 2.1, 2.3, 4.1**

### Property 7: Invalid filter values are rejected with details
*For any* request containing an invalid filter value (alignment or template), the API should return HTTP 400 with an error message identifying which filter is invalid.
**Validates: Requirements 5.2, 5.3**

### Property 8: Random generation with creature name uses that creature
*For any* valid creature name provided to the random generation endpoint, the returned creature should be based on that creature name.
**Validates: Requirements 3.2**

## Error Handling

### Validation Errors
- Invalid creature names: Return HTTP 400 with error message listing valid creatures
- Invalid filter values: Return HTTP 400 with error message specifying which filter is invalid and listing valid values
- Incompatible parameter combinations: Return HTTP 400 indicating incompatibility

### Generation Errors
- If validation passes but generation fails (edge case): Log error and return HTTP 500
- If CreatureGen library throws exception: Catch, log, and return HTTP 500

### Response Patterns
- **Success**: HTTP 200 with JSON body
- **Validation Failure**: HTTP 400 (for generate endpoints) or HTTP 200 with false (for validate endpoints)
- **Server Error**: HTTP 500 with error details in logs

## Testing Strategy

### Unit Testing Framework
- **Framework**: NUnit
- **Mocking**: Moq for mocking ICreatureVerifier and ICreatureGenerator
- **Coverage Target**: 100% of API code (excluding Program.cs and Startup.cs)

### Unit Test Categories

#### Function Tests
Each function class should have unit tests covering:
- Valid parameter combinations return expected results
- Invalid parameters are handled correctly
- Mocked dependencies are called with correct arguments
- HTTP response codes are correct
- Response bodies are correctly serialized
- Logging occurs at appropriate points

#### Validator Tests
CreatureValidator should have unit tests covering:
- Parameter extraction from HttpRequestData
- Creature name validation (valid, invalid, partial matches)
- Filter validation (alignment, type, challenge rating, templates)
- Error message generation
- Edge cases (null values, empty strings, whitespace)

#### Model Tests
CreatureSpecifications should have unit tests covering:
- Setting and validating creature names
- Setting and validating each filter type
- IsValid() method for various combinations
- CleanTemplates filtering logic
- Case-insensitive matching

### Integration Testing Framework
- **Framework**: NUnit
- **Dependencies**: Real CreatureGen library (no mocking)
- **Test Helpers**: Fake HTTP request/response classes from DnDGen.Api.Tests.Integration

### Integration Test Categories

#### Function Integration Tests
Each function should have integration tests covering:
- End-to-end request processing with real CreatureGen dependencies
- Various valid creature names and filter combinations
- Invalid parameter handling
- OpenAPI attribute validation
- Actual creature generation and validation

#### IoC Tests
- Verify all dependencies can be resolved from Ninject kernel
- Verify CreatureGen modules are loaded correctly
- Verify IDependencyFactory returns correct instances

#### Startup Tests
- Verify host configuration
- Verify service registration
- Verify Functions Worker configuration

### Post-Deployment Testing (Postman)
Postman collection should include tests for:

**Specific Creature Generation Tests:**
- Generate creature with various creature names (Dragon, Goblin, Orc, etc.) - expect 200 OK with creature
- Generate creature with single template - expect 200 OK with creature
- Generate creature with multiple templates - expect 200 OK with creature
- Generate creature with alignment filter - expect 200 OK with creature
- Generate creature with invalid creature name - expect 400 Bad Request
- Generate creature with invalid template - expect 400 Bad Request
- Generate creature with invalid alignment - expect 400 Bad Request
- Generate creature with incompatible template combination - expect 400 Bad Request

**Specific Creature Validation Tests (mirror generation tests):**
- Validate creature with various valid creature names - expect 200 OK with true
- Validate creature with single valid template - expect 200 OK with true
- Validate creature with multiple valid templates - expect 200 OK with true
- Validate creature with valid alignment filter - expect 200 OK with true
- Validate creature with invalid creature name - expect 200 OK with false
- Validate creature with invalid template - expect 200 OK with false
- Validate creature with invalid alignment - expect 200 OK with false
- Validate creature with incompatible template combination - expect 200 OK with false

**Random Creature Generation Tests:**
- Generate random creature with no constraints - expect 200 OK with creature
- Generate random creature with creature name - expect 200 OK with creature
- Generate random creature with alignment filter - expect 200 OK with creature
- Generate random creature with creature type filter - expect 200 OK with creature
- Generate random creature with challenge rating filter - expect 200 OK with creature
- Generate random creature with single template - expect 200 OK with creature
- Generate random creature with multiple templates - expect 200 OK with creature

- Generate random creature with combined filters - expect 200 OK with creature
- Generate random creature with invalid creature name - expect 400 Bad Request
- Generate random creature with invalid template - expect 400 Bad Request
- Generate random creature with invalid alignment - expect 400 Bad Request
- Generate random creature with invalid creature type - expect 400 Bad Request
- Generate random creature with invalid challenge rating - expect 400 Bad Request
- Generate random creature with impossible constraint combination - expect 400 Bad Request

**Random Creature Validation Tests (mirror random generation tests):**
- Validate random creature with no constraints - expect 200 OK with true
- Validate random creature with creature name - expect 200 OK with true
- Validate random creature with alignment filter - expect 200 OK with true
- Validate random creature with creature type filter - expect 200 OK with true
- Validate random creature with challenge rating filter - expect 200 OK with true
- Validate random creature with single template - expect 200 OK with true
- Validate random creature with multiple templates - expect 200 OK with true

- Validate random creature with combined filters - expect 200 OK with true
- Validate random creature with invalid creature name - expect 200 OK with false
- Validate random creature with invalid template - expect 200 OK with false
- Validate random creature with invalid alignment - expect 200 OK with false
- Validate random creature with invalid creature type - expect 200 OK with false
- Validate random creature with invalid challenge rating - expect 200 OK with false
- Validate random creature with impossible constraint combination - expect 200 OK with false

Each test should:
- Verify HTTP status code (200 for all validate endpoints, 200 or 400 for generate endpoints)
- Verify response structure
- Verify response contains expected data (creature object or boolean)
- Use assertions to validate correctness
- For validate tests: ensure the result matches what the corresponding generate endpoint would return (true if generate succeeds with 200, false if generate returns 400)
- Verify HTTP status code
- Verify response structure
- Verify response contains expected data
- Use assertions to validate correctness

## CI/CD Integration

### Build Pipeline (cicd/build.yml)
Add new job for CreatureGen API:
```yaml
- job: CreatureGen_Api
  displayName: CreatureGen API
  steps:
  - Build DnDGen.Api.CreatureGen project
  - Run unit tests with code coverage
  - Run integration tests with code coverage
  - Publish artifacts (on main branch only)
```

### Release Pipeline (cicd/release.yml)
Add new deployment job for CreatureGen API:
```yaml
- deployment: CreatureGen_Api
  displayName: Deploy CreatureGen API
  environment: Prod
  strategy:
    runOnce:
      deploy:
        - Deploy to Azure Function App (creaturegen-api)
        - Install Newman
        - Run Postman tests (CreatureGen-API.postman_collection.json)
        - Publish test results
        - NOTE: Website tests for CreatureGen will be added in a future phase
      on:
        failure:
          - Download previous release
          - Rollback to previous version
```

### Post-Deployment Test File
Create `cicd/post-deployment-tests/CreatureGen-API.postman_collection.json` following the pattern of existing API test collections.

## Implementation Notes

### Existing Code Status
- `GenerateCreatureFunction.cs`: Partially implemented, needs completion and bug fixes
- `ValidateCreatureFunction.cs`: Partially implemented, needs completion
- `CreatureSpecifications.cs`: Implemented, may need minor updates
- `CreatureValidator.cs`: Implemented, may need minor updates
- Two new functions need to be created for random generation

### Key Implementation Details

1. **Async/Await**: The existing GenerateCreatureFunction has a bug - it calls `GenerateAsync` but doesn't await it. This must be fixed.

2. **Filter Application**: 
   - For specific creature generation: Only alignment and templates are used
   - For random creature generation: All filters (alignment, type, challenge rating, templates) are used
   - The existing code needs to be updated to ignore creatureType, challengeRating, and asCharacter for all endpoints
   - asCharacter is NOT supported - users should use CharacterGen API instead

3. **Response Serialization**: Use the `WriteDnDGenModelAsJsonAsync` extension method for consistent serialization across all DnDGen APIs.

4. **Parameter Validation**: The CreatureValidator.GetValid method returns a tuple with (Valid, Error, CreatureSpecifications). This pattern should be used consistently.

5. **Random Generation**: For random endpoints, when no creature name is provided, the CreatureGenerator should select a random creature. When constraints are provided, they should filter the available options.

6. **OpenAPI Documentation**: All parameters must have complete OpenAPI attributes including descriptions, types, and valid value examples. Note that specific creature endpoints should NOT document creatureType or challengeRating parameters. asCharacter should NOT be documented on any endpoint - users should use CharacterGen API for character generation.

7. **Parameter Scope**: The existing code has parameters that should only apply to random generation. The specific creature endpoints should be simplified to only accept creature name, alignment, and templates.

## Dependencies

### NuGet Packages
- DnDGen.CreatureGen (core library)
- Microsoft.Azure.Functions.Worker
- Microsoft.Azure.Functions.Worker.Extensions.Http
- Microsoft.Azure.WebJobs.Extensions.OpenApi
- Ninject (via CreatureGen)

### External Services
- Azure Functions runtime
- Azure Application Insights (for logging)

## Security Considerations

- All endpoints use Anonymous authorization level (consistent with other DnDGen APIs)
- No sensitive data is processed or stored
- Input validation prevents injection attacks
- Rate limiting handled by Azure Functions infrastructure

## Performance Considerations

- Creature generation can be computationally expensive for complex creatures with multiple templates
- Consider cold start times for Azure Functions
- Ninject kernel is initialized once per function app instance
- No caching is implemented (stateless generation)

## Monitoring and Logging

- Use ILogger for all logging
- Log at Information level for successful operations
- Log at Error level for validation failures and exceptions
- Include relevant context (creature name, parameters) in log messages
- Application Insights automatically collects logs, metrics, and traces
