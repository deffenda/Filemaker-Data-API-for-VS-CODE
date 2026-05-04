import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConnectionProfile } from '../../../src/types/fm';
import {
  parseSavedQueryArg,
  resolveProfileFromArg
} from '../../../src/commands/common';

vi.mock('vscode', () => {
  const showErrorMessage = vi.fn();
  const showWarningMessage = vi.fn();
  const showQuickPick = vi.fn();
  return {
    window: {
      showErrorMessage,
      showWarningMessage,
      showQuickPick
    }
  };
});

import * as vscode from 'vscode';

interface MockProfileStore {
  profiles: ConnectionProfile[];
  activeProfileId?: string;
  getProfile: (id: string) => Promise<ConnectionProfile | undefined>;
  listProfiles: () => Promise<ConnectionProfile[]>;
  getActiveProfileId: () => string | undefined;
}

function createProfile(overrides: Partial<ConnectionProfile> = {}): ConnectionProfile {
  return {
    id: 'p1',
    name: 'Profile 1',
    authMode: 'direct',
    serverUrl: 'https://fm.example.com',
    database: 'TestDB',
    apiBasePath: '/fmi/data',
    apiVersionPath: 'vLatest',
    username: 'user',
    ...overrides
  };
}

function createStore(profiles: ConnectionProfile[], activeProfileId?: string): MockProfileStore {
  return {
    profiles,
    activeProfileId,
    async getProfile(id: string) {
      return profiles.find((p) => p.id === id);
    },
    async listProfiles() {
      return [...profiles];
    },
    getActiveProfileId() {
      return activeProfileId;
    }
  };
}

describe('resolveProfileFromArg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the profile by id when arg specifies an existing profileId', async () => {
    const store = createStore([createProfile({ id: 'p1' }), createProfile({ id: 'p2', name: 'P2' })]);
    const result = await resolveProfileFromArg({ profileId: 'p1' }, store as never);
    expect(result?.id).toBe('p1');
    expect((vscode.window.showErrorMessage as ReturnType<typeof vi.fn>)).not.toHaveBeenCalled();
  });

  it('shows error when profileId is provided but missing', async () => {
    const store = createStore([createProfile({ id: 'p1' })]);
    const result = await resolveProfileFromArg({ profileId: 'missing' }, store as never);
    expect(result).toBeUndefined();
    expect((vscode.window.showErrorMessage as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(
      expect.stringContaining('missing')
    );
  });

  it('shows quick pick when arg has no profileId and falls through to picker selection', async () => {
    const store = createStore([
      createProfile({ id: 'p1', name: 'A' }),
      createProfile({ id: 'p2', name: 'B' })
    ]);
    (vscode.window.showQuickPick as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      label: 'B',
      profile: store.profiles[1]
    });
    const result = await resolveProfileFromArg(undefined, store as never);
    expect(result?.id).toBe('p2');
    expect(vscode.window.showQuickPick).toHaveBeenCalledTimes(1);
  });

  it('warns when no profiles are configured', async () => {
    const store = createStore([]);
    const result = await resolveProfileFromArg(undefined, store as never);
    expect(result).toBeUndefined();
    expect((vscode.window.showWarningMessage as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
  });

  it('preferActive returns the active profile without prompting', async () => {
    const store = createStore(
      [createProfile({ id: 'p1' }), createProfile({ id: 'p2', name: 'P2' })],
      'p2'
    );
    const result = await resolveProfileFromArg(undefined, store as never, true);
    expect(result?.id).toBe('p2');
    expect(vscode.window.showQuickPick).not.toHaveBeenCalled();
  });

  it('preferActive falls through to picker when activeProfileId is stale', async () => {
    const store = createStore([createProfile({ id: 'p1' })], 'p-deleted');
    (vscode.window.showQuickPick as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      label: 'P1',
      profile: store.profiles[0]
    });
    const result = await resolveProfileFromArg(undefined, store as never, true);
    expect(result?.id).toBe('p1');
    expect(vscode.window.showQuickPick).toHaveBeenCalledTimes(1);
  });

  it('returns undefined when user cancels the quick pick', async () => {
    const store = createStore([createProfile({ id: 'p1' })]);
    (vscode.window.showQuickPick as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    const result = await resolveProfileFromArg(undefined, store as never);
    expect(result).toBeUndefined();
  });
});

describe('parseSavedQueryArg', () => {
  it('returns empty result for non-objects', () => {
    expect(parseSavedQueryArg(null)).toEqual({});
    expect(parseSavedQueryArg(undefined)).toEqual({});
    expect(parseSavedQueryArg(42)).toEqual({});
    expect(parseSavedQueryArg('x')).toEqual({});
  });

  it('reads profileId and queryId', () => {
    expect(parseSavedQueryArg({ profileId: 'p1', queryId: 'q1' })).toEqual({
      profileId: 'p1',
      queryId: 'q1'
    });
  });

  it('falls back to savedQueryId when queryId is missing', () => {
    expect(parseSavedQueryArg({ savedQueryId: 'sq1' })).toEqual({
      profileId: undefined,
      queryId: 'sq1'
    });
  });

  it('prefers queryId over savedQueryId when both are present', () => {
    expect(parseSavedQueryArg({ queryId: 'q1', savedQueryId: 'sq1' })).toEqual({
      profileId: undefined,
      queryId: 'q1'
    });
  });

  it('ignores non-string ids', () => {
    expect(parseSavedQueryArg({ profileId: 42, queryId: { foo: 'bar' } })).toEqual({});
  });
});
