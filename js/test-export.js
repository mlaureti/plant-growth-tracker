// Minimalist Jest-like mock function
global.jest = {
    fn: (impl = () => {}) => {
        const mockFn = (...args) => {
            mockFn.mock.calls.push(args);
            return impl(...args);
        };
        mockFn.mock = { calls: [] };
        mockFn.isCalled = () => mockFn.mock.calls.length > 0;
        mockFn.isCalledWith = (...expectedArgs) =>
            mockFn.mock.calls.some(callArgs =>
                expectedArgs.length === callArgs.length &&
                expectedArgs.every((arg, i) => {
                    // Handle functions without stringifying them
                    if (typeof arg === 'function' && typeof callArgs[i] === 'function') {
                        return arg.toString() === callArgs[i].toString();
                    }
                    // Handle cases where arguments might be DOM elements or complex objects
                    if (typeof arg === 'object' && arg !== null && typeof callArgs[i] === 'object' && callArgs[i] !== null) {
                        // For anchor elements, checking a property like 'download' might be enough if objects are different instances
                        if (arg.hasOwnProperty('download') && callArgs[i].hasOwnProperty('download')) {
                             return arg.download === callArgs[i].download && arg.href === callArgs[i].href;
                        }
                        try {
                            return JSON.stringify(arg) === JSON.stringify(callArgs[i]);
                        } catch (e) {
                            return false; // Cannot stringify, assume not equal
                        }
                    }
                    return arg === callArgs[i];
                })
            );
        return mockFn;
    },
    clearAllMocks: () => {
        // Simplified clearAllMocks
        const mocksToClear = [
            global.localStorage.getItem, global.localStorage.setItem, global.localStorage.clear,
            global.document.createElement, global.document.body.appendChild, global.document.body.removeChild,
            global.Blob, global.URL.createObjectURL, global.URL.revokeObjectURL,
            global.console.log, global.console.error
        ];
        mocksToClear.forEach(mock => {
            if (mock && mock.mock && mock.mock.calls) {
                mock.mock.calls = [];
            }
        });
    }
};

// Mock localStorage
global.localStorage = {
    items: {},
    getItem: jest.fn(function(key) { return this.items[key] || null; }),
    setItem: jest.fn(function(key, value) { this.items[key] = value.toString(); }),
    clear: jest.fn(function() { this.items = {}; })
};

// Mock DOM
global.document = {
    createElementInstance: null, // To store the instance of the anchor
    createElement: jest.fn(function(tagName) {
        if (tagName === 'a') {
            this.createElementInstance = { // Store the instance
                href: '',
                download: '',
                click: jest.fn(),
                style: {}
            };
            return this.createElementInstance;
        }
        return { style: {} }; // Default for other elements
    }),
    body: {
        appendChild: jest.fn(),
        removeChild: jest.fn()
    }
};

global.Blob = jest.fn((data, options) => {
    return { data, options, size: data && data[0] ? data[0].length : 0, type: options ? options.type : '' };
});

global.URL = {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn()
};

// Function to be tested
function exportAllData() {
    const plantsData = localStorage.getItem('plants');
    if (!plantsData) {
        console.log('No plant data found to export.');
        return;
    }
    try {
        const parsedData = JSON.parse(plantsData);
        const jsonData = JSON.stringify(parsedData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plant_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Plant data exported successfully.');
    } catch (error) {
        console.error('Error exporting plant data:', error);
    }
}

// --- Test Globals ---
const tests = [];
let currentBeforeEach = () => {};
global.describe = (name, fn) => { console.log(`\nDESCRIBE: ${name}`); fn(); };
global.test = (name, fn) => { tests.push({ name, fn }); };
global.beforeEach = (fn) => { currentBeforeEach = fn; };

global.expect = (actual) => {
    const self = { actual, isNot: false };
    const check = (condition, message) => {
        if (self.isNot ? condition : !condition) {
            const actualCalls = self.actual && self.actual.mock && self.actual.mock.calls 
                ? ` Actual calls: ${JSON.stringify(self.actual.mock.calls)}.`
                : '';
            throw new Error(message + actualCalls);
        }
    };
    return {
        get not() { self.isNot = !self.isNot; return this; },
        toHaveBeenCalled: () => check(self.actual.isCalled && self.actual.isCalled(), `Expected function ${self.isNot ? 'not ' : ''}to have been called.`),
        toHaveBeenCalledWith: (...args) => check(self.actual.isCalledWith && self.actual.isCalledWith(...args), `Expected function ${self.isNot ? 'not ' : ''}to have been called with ${JSON.stringify(args)} (or matching complex objects).`)
    };
};

// --- Test Suite ---
describe('exportAllData', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear call history for all known mocks
        localStorage.items = {}; // Explicitly reset localStorage items

        // Re-mock document.createElement to get a fresh instance for anchor checks
        global.document.createElement = jest.fn(function(tagName) {
            if (tagName === 'a') {
                global.document.createElementInstance = {
                    href: '',
                    download: '',
                    click: jest.fn(),
                    style: {}
                };
                return global.document.createElementInstance;
            }
            return { style: {} };
        });
        // Ensure other global mocks are also reset if they maintain state beyond .mock.calls
        global.console.log = jest.fn();
        global.console.error = jest.fn();
        global.Blob = jest.fn((data, options) => ({ data, options, size: data && data[0] ? data[0].length : 0, type: options ? options.type : '' }));
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        global.URL.revokeObjectURL = jest.fn();

    });

    const samplePlantData = [{
        "id": "123", "name": "Test Plant", "species": "Test Species", "description": "A plant for testing",
        "photo": null, "startDate": "2023-01-01T00:00:00.000Z",
        "phases": [{"id": "p1", "name": "Germination", "notes": "Test phase", "photo": null, "date": "2023-01-02T00:00:00.000Z"}]
    }];
    const stringifiedSamplePlantData = JSON.stringify(samplePlantData, null, 2);

    test('should export data when localStorage has plant data', () => {
        localStorage.items['plants'] = JSON.stringify(samplePlantData); // Store as a simple string initially

        exportAllData();
        
        expect(console.error).not.toHaveBeenCalled();
        expect(localStorage.getItem).toHaveBeenCalledWith('plants');
        
        expect(global.Blob).toHaveBeenCalledWith([stringifiedSamplePlantData], { type: 'application/json' });
        expect(global.URL.createObjectURL).toHaveBeenCalled(); // Blob instance is tricky to match exactly, so just check if called
        
        expect(global.document.createElement).toHaveBeenCalledWith('a');
        const mockAnchorInstance = global.document.createElementInstance; // Retrieve the stored instance
        expect(mockAnchorInstance).not.toBe(null); // Ensure an instance was created and stored
        expect(mockAnchorInstance.click).toHaveBeenCalled();
        expect(global.document.body.appendChild).toHaveBeenCalledWith(mockAnchorInstance);
        expect(global.document.body.removeChild).toHaveBeenCalledWith(mockAnchorInstance);
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
        expect(console.log).toHaveBeenCalledWith('Plant data exported successfully.');
    });

    test('should not export if no data is in localStorage', () => {
        localStorage.items['plants'] = null; 
        
        exportAllData();

        expect(localStorage.getItem).toHaveBeenCalledWith('plants');
        expect(console.log).toHaveBeenCalledWith('No plant data found to export.');
        expect(global.Blob).not.toHaveBeenCalled();
        expect(global.URL.createObjectURL).not.toHaveBeenCalled();
        expect(global.document.createElement).not.toHaveBeenCalledWith('a');
        expect(console.error).not.toHaveBeenCalled();
    });
});

// --- Test Runner ---
async function runTests() {
    let passed = 0, failed = 0;
    for (const t of tests) {
        console.log(`\nRUNNING TEST: ${t.name}`);
        try {
            currentBeforeEach(); 
            await t.fn(); 
            console.log(`  PASSED: ${t.name}`);
            passed++;
        } catch (e) {
            console.error(`  FAILED: ${t.name}`);
            console.error(e.message); 
            if (e.stack) console.error(e.stack.split('\n').slice(0, 5).join('\n'));
            failed++;
        }
    }
    console.log(`\n\n--- Test Summary ---`);
    console.log(`Total tests: ${tests.length}, Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) process.exitCode = 1;
}

runTests();
