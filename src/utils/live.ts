async function fetchFromApi<T>(path: string, params?: Record<string, any>): Promise<T | null> {
    try {
        const url = new URL('/live-stats/' + path, window.location.origin);
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
    return fetchFromApi(`players/${encodeURIComponent(name)}`);
}

export async function getPlayerServer(name: string) {
    return fetchFromApi(`players/${encodeURIComponent(name)}/server`);
}

export async function getServers(perPage?: number, cursor?: string, after?: string) {
    return fetchFromApi('servers', { perPage, cursor, after, fields: 'ranked,voip,pba' });
}

export async function getServer(ip: string, port: string | number) {
    return fetchFromApi(`servers/${ip}:${port}`);
}

export async function getInfo() {
    return fetchFromApi('livestats')
}