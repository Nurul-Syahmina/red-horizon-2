import test from 'node:test';
import assert from 'node:assert/strict';
import { ResourceManager } from '../src/game/systems/ResourceManager.js';
import { INITIAL_RESOURCES, MISSIONS } from '../src/game/data/missions.js';

test('every mission choice changes only its assigned resource by 15 points', () => {
  const expected = [
    [['water', 'power'], ['food', 'power'], ['power', 'water']],
  ][0];
  MISSIONS.forEach((mission, missionIndex) => {
    mission.choices.forEach((choice, choiceIndex) => {
      const manager = new ResourceManager();
      const before = manager.snapshot();
      manager.deduct(choice.resource, 15);
      const after = manager.snapshot();
      assert.equal(choice.resource, expected[missionIndex][choiceIndex]);
      assert.equal(after[choice.resource], 85);
      for (const key of Object.keys(before)) {
        if (key !== choice.resource) assert.equal(after[key], before[key]);
      }
    });
  });
});

test('example playthrough carries resource values between missions', () => {
  const manager = new ResourceManager();
  manager.deduct(MISSIONS[0].choices[0].resource, 15);
  manager.deduct(MISSIONS[1].choices[0].resource, 15);
  manager.deduct(MISSIONS[2].choices[1].resource, 15);
  assert.deepEqual(manager.snapshot(), { power: 100, water: 70, food: 85 });
});

test('resources stay within bounds and a new playthrough resets them', () => {
  const manager = new ResourceManager();
  for (let i = 0; i < 9; i++) manager.deduct('power', 15);
  assert.equal(manager.snapshot().power, 0);
  manager.deduct('power', 15);
  assert.equal(manager.snapshot().power, 0);
  manager.reset();
  assert.deepEqual(manager.snapshot(), INITIAL_RESOURCES);
});
