function getMock(mockName) {
    jasmine.getJSONFixtures().fixturesPath = '../../mocks';

    var newMock = getJSONFixture(mockName + '.json');
    var stringified = JSON.stringify(newMock);

    return JSON.parse(stringified);
}