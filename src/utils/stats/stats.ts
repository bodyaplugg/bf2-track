import { main } from './index';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export type Project = 'bf2hub' | 'playbf2';
type Source = 'getplayerinfo' | 'getrankinfo' | 'getawardsinfo' | 'getunlocksinfo' | 'getleaderboard' | 'searchforplayers';

async function apiRequest(source: Source, params: Record<string, string>) {
    const mockEvent: Partial<APIGatewayProxyEventV2> = {
        rawPath: `/${source}`,
        queryStringParameters: params,
        requestContext: { http: { method: 'GET' } } as any
    };

    try {
        const result = await main(mockEvent as APIGatewayProxyEventV2) as APIGatewayProxyResultV2;

        if (typeof result === 'object' && result !== null && 'body' in result) {
            const body = JSON.parse(result.body as string);

            if (result.statusCode !== 200) {
                const errorMessage = (body.errors && body.errors[0]) || `API error: Status ${result.statusCode}`;
                throw new Error(errorMessage);
            }

            return body;
        }
        throw new Error('Invalid API response format');
    } catch (error) {
        // Re-throw the error to be handled by the calling component
        throw error;
    }
}

export const stats = {
    getPlayer: (pid: string, project: Project = 'bf2hub') =>
        apiRequest('getplayerinfo', { pid, project, groupValues: 'true' }),

    getRank: (pid: string, project: Project = 'bf2hub') =>
        apiRequest('getrankinfo', { pid, project }),

    getAwards: (pid: string, project: Project = 'bf2hub') =>
        apiRequest('getawardsinfo', { pid, project }),

    getUnlocks: (pid: string, project: Project = 'bf2hub') =>
        apiRequest('getunlocksinfo', { pid, project }),

    getLeaderboard: (type: string = 'score', id: string = 'overall', project: Project = 'bf2hub') =>
        apiRequest('getleaderboard', { type, id, project }),

    search: (nick: string, project: Project = 'bf2hub') =>
        apiRequest('searchforplayers', { nick, project })
};
