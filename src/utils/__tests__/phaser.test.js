const {
    calculateGameSize,
    asyncLoader,
    prepareScene,
    getScenesModules,
} = require('../phaser');

describe('calculateGameSize', () => {
    beforeEach(() => {
        window.innerWidth = 500;
        window.innerHeight = 500;
    });

    it('calculates the game size correctly', () => {
        const result = calculateGameSize(400, 300, 10, 20);
        expect(result.zoom).toEqual(1);
        expect(result.width).toEqual(400);
        expect(result.height).toEqual(300);
    });

    it('calculates the zoom correctly', () => {
        const result = calculateGameSize(1000, 1000, 10, 20);
        expect(result.zoom).toEqual(2);
        expect(result.width).toEqual(500);
        expect(result.height).toEqual(500);
    });

    it('uses the threshold values', () => {
        const result = calculateGameSize(400, 300, 10, 20, 0.1, 0.2);
        expect(result.width).toEqual(440);
        expect(result.height).toEqual(360);
    });
});

describe('asyncLoader', () => {
    it('resolves with the result', (done) => {
        const plugin = {
            on: jest.fn((event, callback) => {
                if (event === 'filecomplete') {
                    // eslint-disable-next-line n/no-callback-literal
                    callback({ name: 'test', type: 'image' });
                }
            }),
            start: jest.fn(),
        };
        asyncLoader(plugin)
            .then((result) => {
                expect(result).toEqual({ name: 'test', type: 'image' });
                done();
            });
    });

    it('rejects with an error', (done) => {
        const plugin = {
            on: jest.fn((event, callback) => {
                if (event === 'loaderror') {
                    callback(new Error('Load error'));
                }
            }),
            start: jest.fn(),
        };
        asyncLoader(plugin)
            .catch((error) => {
                expect(error).toEqual(new Error('Load error'));
                done();
            });
    });
});

describe('prepareScene', () => {
    it('should return the default property of a module if it has a prototype', () => {
        const defaultExport = () => {};
        const module = { default: defaultExport };
        const result = prepareScene(module, './testModule.js');

        expect(result).toBe(defaultExport);
    });

    it('should return an object with init method and key/name properties if the module does not have a prototype', () => {
        const module = {};
        const result = prepareScene(module, './testModule.js');

        expect(result.init).toBeDefined();
        expect(result.key).toBeDefined();
        expect(result.name).toBeDefined();
    });

    it('should use the module key property as the key/name if it is defined', () => {
        const key = 'testKey';
        const module = { key };
        const result = prepareScene(module, './testModule.js');

        expect(result.key).toBe(key);
        expect(result.name).toBe(key);
    });

    it('should use the filename without extension as the key/name if the module key property is not defined', () => {
        const module = {};
        const result = prepareScene(module, './testModule.js');

        expect(result.key).toBe('testModule');
        expect(result.name).toBe('testModule');
    });
});

describe('getScenesModules', () => {
    jest.mock('../phaser.js', () => ({
        prepareScene: jest.fn(() => ({})),
    }));

    it('should return an array of scenes modules', () => {
        require.context = jest.fn(() => ({
            keys: jest.fn(() => ['./bootScene.js', './testScene1.js', './testScene2.js']),
        }));

        const result = getScenesModules();

        expect(result).toHaveLength(3);
    });

    it('should call prepareScene for each scene module', () => {
        const contextResolver = {
            keys: jest.fn(() => [
                './bootScene.js',
                './testScene1.js',
                './testScene2.js',
            ]),
        };

        require.context = jest.fn(() => contextResolver);
        getScenesModules();

        expect(prepareScene).toHaveBeenCalledWith(contextResolver['./bootScene.js'], './bootScene.js');
        expect(prepareScene).toHaveBeenCalledWith(contextResolver['./testScene1.js'], './testScene1.js');
        expect(prepareScene).toHaveBeenCalledWith(contextResolver['./testScene2.js'], './testScene2.js');
    });

    it('should return the boot scene as the first element of the array', () => {
        const contextResolver = {
            keys: jest.fn(() => [
                './bootScene.js',
                './testScene1.js',
                './testScene2.js',
            ]),
        };

        require.context = jest.fn(() => contextResolver);

        const result = getScenesModules();

        expect(result[0]).toBeDefined();
        expect(prepareScene).toHaveBeenCalledWith(contextResolver['./bootScene.js'], './bootScene.js');
    });
});
