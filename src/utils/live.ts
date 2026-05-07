async function fetchFromApi<T>(path: string): Promise<T | null> {
    try {
        const response = await fetch('/live-stats/' + path);
        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const body = await response.json();
        return body;

    } catch (error) {
        console.error(`Fetch error for ${path}:`, error);
        return null;
    }
}

export async function getLivePlayer(name: string) {
    return fetchFromApi(`players/${encodeURIComponent(name)}`);
}

export async function getPlayerServer(name: string) {
    return fetchFromApi(`players/${encodeURIComponent(name)}/server`);
}

export async function getServers(page: number | string) {
    return fetchFromApi(`servers/${page}`);
}

export async function getServer(ip: string, port: string | number) {
    return fetchFromApi(`servers/${ip}:${port}`);
}