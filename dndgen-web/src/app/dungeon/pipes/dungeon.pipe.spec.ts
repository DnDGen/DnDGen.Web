import { EncounterPipe } from "../../encounter/pipes/encounter.pipe";
import { TestHelper } from "../../testHelper.spec";
import { Good } from "../../treasure/models/good.model";
import { Item } from "../../treasure/models/item.model";
import { Treasure } from "../../treasure/models/treasure.model";
import { TreasurePipe } from "../../treasure/pipes/treasure.pipe";
import { Area } from "../models/area.model";
import { Contents } from "../models/contents.model";
import { DungeonTreasure } from "../models/dungeonTreasure.model";
import { Encounter } from "../../encounter/models/encounter.model";
import { Pool } from "../models/pool.model";
import { Trap } from "../models/trap.model";
import { DungeonPipe } from "./dungeon.pipe";

describe('Dungeon Pipe', () => {
    describe('unit', () => {
        let pipe: DungeonPipe;
        let encounterPipeSpy: jasmine.SpyObj<EncounterPipe>;
        let treasurePipeSpy: jasmine.SpyObj<TreasurePipe>;
        let encounterCount: number;
        let dungeonTreasureCount: number;
        let trapCount: number;
        let treasureCount: number;
        let areas: Area[];

        beforeEach(() => {
            treasurePipeSpy = jasmine.createSpyObj('TreasurePipe', ['transform']);
            encounterPipeSpy = jasmine.createSpyObj('EncounterPipe', ['transform']);
            pipe = new DungeonPipe(encounterPipeSpy, treasurePipeSpy);

            treasurePipeSpy.transform.and.callFake((treasure, prefix) => {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = `${prefix}formatted treasure:\r\n`;
                formattedTreasure += `${prefix}\tcoins: ${treasure.coin.quantity} ${treasure.coin.currency}\r\n`;

                return formattedTreasure;
            });

            encounterPipeSpy.transform.and.callFake((encounter, prefix) => {
                if (!prefix)
                    prefix = '';

                let formattedEncounter = `${prefix}formatted encounter:\r\n`;
                formattedEncounter += `${prefix}\tdescription: ${encounter.description}\r\n`;

                return formattedEncounter;
            });

            encounterCount = 0;
            dungeonTreasureCount = 0;
            trapCount = 0;
            treasureCount = 0;

            areas = [createArea(), createArea()];
    
            areas[0].type = 'Room';
            areas[0].descriptions.push('description 1');
            areas[0].descriptions.push('description 2');
            areas[0].length = 9266;
            areas[0].width = 90210;
            areas[0].contents.encounters.push(createEncounter());
            areas[0].contents.encounters.push(createEncounter());
            areas[0].contents.treasures.push(createDungeonTreasure());
            areas[0].contents.treasures.push(createDungeonTreasure());
            areas[0].contents.miscellaneous.push("contents 1");
            areas[0].contents.miscellaneous.push("contents 2");
            areas[0].contents.pool = createPool();
            areas[0].contents.pool.magicPower = 'super strength';
            areas[0].contents.isEmpty = false;
    
            areas[1].type = 'Exit';
            areas[1].descriptions.push('description 3');
            areas[1].descriptions.push('description 4');
            areas[1].length = 0;
            areas[1].width = 0;
            areas[1].contents.miscellaneous.push("contents 3");
            areas[1].contents.miscellaneous.push("contents 4");
            areas[1].contents.traps.push(createTrap());
            areas[1].contents.traps.push(createTrap());
            areas[1].contents.isEmpty = false;
        });

        function createArea(): Area {
            var area = new Area('my area type');
    
            return area;
        }
    
        function createEncounter() {
            encounterCount++;

            return new Encounter(`encounter ${encounterCount}`);
        }
    
        function createDungeonTreasure() {
            dungeonTreasureCount++;
            var dungeonTreasure = new DungeonTreasure();
    
            dungeonTreasure.container = "container " + dungeonTreasureCount;
            dungeonTreasure.concealment = "concealment " + dungeonTreasureCount;
            dungeonTreasure.treasure = createTreasure();
    
            return dungeonTreasure;
        }
    
        function createPool() {
            var pool = new Pool();
    
            pool.encounter = createEncounter();
            pool.treasure = createDungeonTreasure();
    
            return pool;
        }
    
        function createTrap() {
            var trap = new Trap();
            trapCount++;
            
            trap.name = 'trap ' + trapCount,
            trap.challengeRating = 6789 + trapCount,
            trap.searchDC = 7890 + trapCount,
            trap.disableDeviceDC = 8901 + trapCount,
            trap.descriptions.push('trap description ' + trapCount);
            trap.descriptions.push('other trap description ' + trapCount);
    
            return trap;
        }
    
        function createTreasure() {
            treasureCount++;
    
            var treasure = new Treasure();
    
            treasure.coin.currency = 'gold ' + treasureCount;
            treasure.coin.quantity = treasureCount;
            treasure.goods.push(new Good('goods description ' + treasureCount, treasureCount * 2));
            treasure.goods.push(new Good('other goods description ' + treasureCount, treasureCount * 3));
            treasure.items.push(new Item('item ' + treasureCount, 'item type ' + treasureCount));
            treasure.items.push(new Item('other item ' + treasureCount, 'other item type ' + treasureCount));
            treasure.isAny = true;
    
            return treasure;
        }
    
        it('formats areas', function () {
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats continuing width', function () {
            areas[0].width = 0;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: continues 9266\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats no descriptions', function () {
            areas[0].descriptions = [];
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats no contents', function () {
            areas[0].contents.isEmpty = true;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats special area dimensions', function () {
            areas[0].width = 1;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: about 9266 square feet',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats pool without encounter', function () {
            areas[0].contents.pool!.encounter = null;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats pool without treasure', function () {
            areas[0].contents.pool!.treasure = null;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats pool with only a treasure container', function () {
            areas[0].contents.pool!.treasure!.treasure.isAny = false;
            areas[0].contents.pool!.treasure!.concealment = '';
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure: None',
                '\t\t\t\tContainer: container 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats pool without magic powers', function () {
            areas[0].contents.pool!.magicPower = '';
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats ordinary pool', function () {
            areas[0].contents.pool!.magicPower = '';
            areas[0].contents.pool!.encounter = null;
            areas[0].contents.pool!.treasure = null;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats uncontained treasure', function () {
            areas[0].contents.treasures[0].container = "";
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats unhidden treasure', function () {
            areas[0].contents.treasures[0].concealment = "";
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1:',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 1 gold 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats empty treasure', function () {
            areas[0].contents.treasures[0].treasure.isAny = false;
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'Room:',
                '\tDescriptions:',
                '\t\tdescription 1',
                '\t\tdescription 2',
                '\tDimensions: 9266\' x 90210\'',
                '\tContents:',
                '\t\tcontents 1',
                '\t\tcontents 2',
                '\t\tEncounters:',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 1',
                '\t\t\tformatted encounter:',
                '\t\t\t\tdescription: encounter 2',
                '\t\tTreasures:',
                '\t\t\tTreasure 1: None',
                '\t\t\t\tContainer: container 1',
                '\t\t\t\tConcealment: concealment 1',
                '\t\t\tTreasure 2:',
                '\t\t\t\tContainer: container 2',
                '\t\t\t\tConcealment: concealment 2',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 2 gold 2',
                '\t\tPool:',
                '\t\t\tEncounter:',
                '\t\t\t\tformatted encounter:',
                '\t\t\t\t\tdescription: encounter 3',
                '\t\t\tTreasure:',
                '\t\t\t\tContainer: container 3',
                '\t\t\t\tConcealment: concealment 3',
                '\t\t\t\tformatted treasure:',
                '\t\t\t\t\tcoins: 3 gold 3',
                '\t\t\tMagic Power: super strength',
                'Exit:',
                '\tDescriptions:',
                '\t\tdescription 3',
                '\t\tdescription 4',
                '\tContents:',
                '\t\tcontents 3',
                '\t\tcontents 4',
                '\t\tTraps:',
                '\t\t\ttrap 1:',
                '\t\t\t\ttrap description 1',
                '\t\t\t\tother trap description 1',
                '\t\t\t\tChallenge Rating: 6790',
                '\t\t\t\tSearch DC: 7891',
                '\t\t\t\tDisable Device DC: 8902',
                '\t\t\ttrap 2:',
                '\t\t\t\ttrap description 2',
                '\t\t\t\tother trap description 2',
                '\t\t\t\tChallenge Rating: 6791',
                '\t\t\t\tSearch DC: 7892',
                '\t\t\t\tDisable Device DC: 8903',
                ''
            ];
    
            TestHelper.expectLines(expected, lines);
        });
    
        it('formats completely empty area', function () {
            areas = [{
                type: 'area type',
                descriptions: [],
                length: 0,
                width: 0,
                contents: new Contents()
            }];
    
            var formattedDungeonAreas = pipe.transform(areas);
            var lines = formattedDungeonAreas.split('\r\n');
            var expected = [
                'area type',
                ''
            ];
            
            TestHelper.expectLines(expected, lines);
        });
    });
});