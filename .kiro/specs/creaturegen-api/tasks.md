# Implementation Plan

- [x] 1. Fix and complete existing specific creature endpoints





  - Fix the async/await bug in GenerateCreatureFunction
  - Remove unsupported parameters (asCharacter, creatureType, challengeRating) from specific creature endpoints
  - Update OpenAPI attributes to only document supported parameters
  - Ensure alignment filter is properly applied
  - Ensure templates are properly applied in order
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.1 Write unit tests for GenerateCreatureFunction


  - Test valid creature generation with various creature names
  - Test creature generation with templates
  - Test creature generation with alignment filter
  - Test error handling for invalid parameters
  - Test HTTP response codes
  - Mock ICreatureVerifier and ICreatureGenerator
  - _Requirements: 6.1_

- [x] 1.2 Write integration tests for GenerateCreatureFunction


  - Test end-to-end generation with real CreatureGen dependencies
  - Test various creature names and filter combinations
  - Test OpenAPI attribute configuration
  - _Requirements: 7.1, 7.4_

- [ ] 2. Fix and complete ValidateCreatureFunction
  - Remove unsupported parameters (asCharacter, creatureType, challengeRating)
  - Update OpenAPI attributes to only document supported parameters
  - Ensure validation logic matches generation logic
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2.1 Write unit tests for ValidateCreatureFunction
  - Test validation with valid parameters returns true
  - Test validation with invalid creature name returns false
  - Test validation with incompatible templates returns false
  - Test HTTP response codes
  - Mock ICreatureVerifier
  - _Requirements: 6.1_

- [ ] 2.2 Write integration tests for ValidateCreatureFunction
  - Test end-to-end validation with real CreatureGen dependencies
  - Test various parameter combinations
  - Test OpenAPI attribute configuration
  - _Requirements: 7.1, 7.4_

- [ ] 3. Create GenerateRandomCreatureFunction
  - Implement HTTP trigger with route `/v1/creature/random/generate`
  - Support all optional parameters: creatureName, alignment, creatureType, challengeRating, templates
  - Add comprehensive OpenAPI attributes for all parameters
  - Do NOT support asCharacter parameter - users should use CharacterGen API
  - Use CreatureValidator to validate parameters
  - Use ICreatureVerifier to check compatibility
  - Use ICreatureGenerator to generate random creature with constraints
  - Return HTTP 200 with creature on success, HTTP 400 on invalid parameters
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3.1 Write unit tests for GenerateRandomCreatureFunction
  - Test random generation with no constraints
  - Test random generation with creature name
  - Test random generation with various filters
  - Test error handling for invalid parameters
  - Test HTTP response codes
  - Mock ICreatureVerifier and ICreatureGenerator
  - _Requirements: 6.1_

- [ ] 3.2 Write integration tests for GenerateRandomCreatureFunction
  - Test end-to-end random generation with real CreatureGen dependencies
  - Test various constraint combinations
  - Test OpenAPI attribute configuration
  - _Requirements: 7.1, 7.4_

- [ ] 4. Create ValidateRandomCreatureFunction
  - Implement HTTP trigger with route `/v1/creature/random/validate`
  - Support all optional parameters matching GenerateRandomCreatureFunction
  - Add comprehensive OpenAPI attributes for all parameters
  - Use CreatureValidator to validate parameters
  - Use ICreatureVerifier to check if valid creatures exist matching constraints
  - Return HTTP 200 with boolean indicating validity
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 4.1 Write unit tests for ValidateRandomCreatureFunction
  - Test validation with no constraints returns true
  - Test validation with valid constraints returns true
  - Test validation with impossible constraints returns false
  - Test validation with invalid parameters returns false
  - Test HTTP response codes
  - Mock ICreatureVerifier
  - _Requirements: 6.1_

- [ ] 4.2 Write integration tests for ValidateRandomCreatureFunction
  - Test end-to-end validation with real CreatureGen dependencies
  - Test various constraint combinations
  - Test OpenAPI attribute configuration
  - _Requirements: 7.1, 7.4_

- [ ] 5. Update CreatureSpecifications model if needed
  - Ensure model properly handles all parameters for both specific and random endpoints
  - Ensure validation logic correctly identifies which parameters apply to which endpoints
  - Add comments documenting which parameters apply to which endpoint types
  - Ensure asCharacter is ignored/not used by the API
  - _Requirements: 1.4, 1.5_

- [ ] 5.1 Write unit tests for CreatureSpecifications
  - Test setting and validating creature names
  - Test setting and validating alignment filter
  - Test setting and validating creature type filter
  - Test setting and validating challenge rating filter
  - Test setting and validating templates
  - Test IsValid() method for various combinations
  - Test CleanTemplates filtering
  - Test case-insensitive matching
  - _Requirements: 6.3_

- [ ] 6. Update CreatureValidator if needed
  - Ensure validator properly extracts all parameters from HttpRequestData
  - Ensure validator provides helpful error messages for invalid parameters
  - Add support for random endpoint parameter validation
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 6.1 Write unit tests for CreatureValidator
  - Test parameter extraction from HttpRequestData
  - Test creature name validation (valid, invalid, partial matches)
  - Test filter validation for all filter types
  - Test error message generation
  - Test edge cases (null, empty, whitespace)
  - _Requirements: 6.2_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Add CreatureGen API to CI/CD build pipeline
  - Add new job to cicd/build.yml for CreatureGen API
  - Configure build step for DnDGen.Api.CreatureGen project
  - Configure unit test execution step
  - Configure integration test execution step
  - Configure artifact publishing for main branch
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Add CreatureGen API to release pipeline
  - Add new deployment job to cicd/release.yml for CreatureGen API
  - Configure Azure Function App deployment to creaturegen-api
  - Configure Newman installation and Postman test execution
  - Configure test result publishing
  - Configure rollback on failure
  - Note: Website tests will be added in future phase
  - _Requirements: 8.5, 8.6, 8.7_

- [ ] 10. Create Postman post-deployment test collection
  - Create cicd/post-deployment-tests/CreatureGen-API.postman_collection.json
  - Add tests for specific creature generation (valid cases expect 200)
  - Add tests for specific creature generation (invalid cases expect 400)
  - Add tests for specific creature validation (valid cases expect true)
  - Add tests for specific creature validation (invalid cases expect false)
  - Add tests for random creature generation (valid cases expect 200)
  - Add tests for random creature generation (invalid cases expect 400)
  - Add tests for random creature validation (valid cases expect true)
  - Add tests for random creature validation (invalid cases expect false)
  - Ensure validate tests mirror generate tests (validate returns true when generate returns 200, false when generate returns 400)
  - Add assertions for HTTP status codes, response structure, and data correctness
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 11. Verify OpenAPI documentation
  - Deploy API and verify Swagger UI is accessible
  - Verify all endpoints are documented
  - Verify all parameters have descriptions and types
  - Verify response types are documented
  - Verify valid parameter values are documented
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
