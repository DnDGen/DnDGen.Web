import 'jasmine';
import { RollService } from "../../../../../DnDGen.Web.New/ClientApp/src/app/roll/roll.service"
import { HttpClient, HttpParams } from '../../../../wwwroot/lib/angular/common/http';
import { Observable } from '../../../../wwwroot/lib/rxjs/rxjs.umd';

describe('Roll Service', () => {
    let rollService: RollService;
    let http: HttpClient;
    let spy: any;

    beforeEach(() => {
        http = new HttpClient();
        rollService = new RollService(http);
    });

    beforeEach(() => {
        spy = spyOn(http, 'get').and.returnValue(new Observable(666));
    });

    it('validates a roll - valid', () => {
        spy = spyOn(http, 'get').and.returnValue(Observable.of(true));

        var result = rollService.validateRoll(9266, 90210);
        expect(result).not.toBeNull();
        expect(http.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');

        let valid: boolean;
        result.subscribe(val => valid = val);
        expect(valid).toBeTruthy();
    });

    it('validates a roll - invalid', () => {
        spy = spyOn(http, 'get').and.returnValue(Observable.of(false));

        var result = rollService.validateRoll(9266, 90210);
        expect(result).not.toBeNull();
        expect(http.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/validate');

        let valid: boolean;
        result.subscribe(val => valid = val);
        expect(valid).toBeFalsy();
    });

    it('gets a roll', () => {
        spy = spyOn(http, 'get').and.returnValue(Observable.of(9266));

        var result = rollService.getRoll(9266, 90210);
        expect(result).not.toBeNull();
        expect(http.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/9266/d/90210/roll');

        let roll: number;
        result.subscribe(val => roll = val);
        expect(roll).toBe(9266);
    });

    it('validates an expression - valid', () => {
        spy = spyOn(http, 'get').and.returnValue(Observable.of(true));

        var result = rollService.validateExpression("my expression");
        expect(result).not.toBeNull();

        let params = new HttpParams().set('expression', "my expression");
        expect(http.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/validate', { params: params });
        let valid: boolean;
        result.subscribe(val => valid = val);
        expect(valid).toBeTruthy();
    });

    it('validates an expression - invalid', function () {
        spy = spyOn(http, 'get').and.returnValue(Observable.of(false));

        var result = rollService.validateExpression("my expression");
        expect(result).not.toBeNull();

        let params = new HttpParams().set('expression', "my expression");
        expect(http.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/validate', { params: params });
        let valid: boolean;
        result.subscribe(val => valid = val);
        expect(valid).toBeFalsy();
    });

    it('gets an expression roll', function () {
        spy = spyOn(http, 'get').and.returnValue(Observable.of(9266));

        var result = rollService.getExpressionRoll("my expression");
        expect(result).not.toBeNull();

        let params = new HttpParams().set('expression', "my expression");
        expect(http.get).toHaveBeenCalledWith('https://roll.dndgen.com/api/v2/expression/roll', { params: params });

        let roll: number;
        result.subscribe(val => roll = val);
        expect(roll).toBe(9266);
    });
});