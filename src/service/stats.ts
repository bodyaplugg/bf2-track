type ApiUrl = '/live-stats' | '/static-stats-v1' | '/static-stats-v2'
export type Project = 'bf2hub' | 'playbf2' | 'b2bf2';
type LeaderboardsType = 'weapon' | 'vehicle' | 'kit'
type LeaderboardId = 'overall' | 'commander' | 'team' | 'combat'

interface LeaderboardQuery {
    position?: number,
    before?: number,
    after?: number,
    pid?: string,
}

async function fetchFromApi<T>(api: ApiUrl, path: string, params?: Record<string, any>): Promise<T | null> {
    try {
        const url = new URL(api + '/' + path, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const response = await fetch(url.toString());

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            try {
                (error as any).data = await response.json();
            } catch (e) {

            }
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error(`Fetch error for ${path}:`, error);
        throw error;
    }
}

export async function getLivePlayer(name: string) {
    return fetchFromApi('/live-stats', `players/${encodeURIComponent(name)}`);
}

export async function getPlayerServer(name: string) {
    return fetchFromApi('/live-stats', `players/${encodeURIComponent(name)}/server`);
}

export async function getServers(perPage?: number, cursor?: string, after?: string) {
    return fetchFromApi('/live-stats', 'servers', { perPage, cursor, after, fields: 'ranked,voip,pba' });
}

export async function getServer(ip: string, port: string | number) {
    return fetchFromApi('/live-stats', `servers/${ip}:${port}`);
}

export async function getInfo() {
    return fetchFromApi('/live-stats', 'livestats')
}

export async function searchPlayers(nick: string, project: Project = 'bf2hub', where: string = 'a') {
    return fetchFromApi('/static-stats-v2', `players/${project}/search-nick/${nick}`, { where })
}

export async function getPlayer(pid: string, project: Project = 'bf2hub') {
    return fetchFromApi('/static-stats-v2', `players/${project}/by-id/${pid}/stats`)
}

export async function getPlayerMaps(pid: string, project: Project = 'bf2hub') {
    return fetchFromApi('/static-stats-v2', `players/${project}/by-id/${pid}/maps`)
}

export async function getScoreLeaderboard(id: LeaderboardId, project: Project = 'bf2hub', query?: LeaderboardQuery) {
    return fetchFromApi('/static-stats-v2', `leaderboards/${project}/score/${id}`, query)
}

export async function getRisingLeaderboard(project: Project = 'bf2hub', query?: LeaderboardQuery) {
    return fetchFromApi('/static-stats-v2', `leaderboards/${project}/risingstar`, query)
}

export async function getSpecificLeaderboard(type: LeaderboardsType, target: string, project: Project = 'bf2hub', query?: LeaderboardQuery) {
    return fetchFromApi('/static-stats-v2', `leaderboards/${project}/${type}/${target}`, query)
}

export async function getPlayerAwards(pid: string, project: Project = 'bf2hub') {
    return fetchFromApi('/static-stats-v1', `players/${project}/by-id/${pid}/awards`)
}

export async function getPlayerUnlocks(pid: string, project: Project = 'bf2hub') {
    return fetchFromApi('/static-stats-v1', `players/${project}/by-id/${pid}/unlocks`)
}

export async function getPlayerRank(pid: string, project: Project = 'bf2hub') {
    return fetchFromApi('/static-stats-v1', `players/${project}/by-id/${pid}/rank`)
}