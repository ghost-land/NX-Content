// metadataCache.ts

// Caching logic for metadata to avoid redundant API calls
class MetadataCache {
    private cache: Record<string, any> = {};

    // Method to get metadata from cache or fetch it
    public async getMetadata(key: string, fetchFunction: () => Promise<any>): Promise<any> {
        if (this.cache[key]) {
            console.log(`Returning cached metadata for key: ${key}`);
            return this.cache[key];
        }
        console.log(`Fetching metadata for key: ${key}`);
        const data = await fetchFunction();
        this.cache[key] = data;
        return data;
    }

    // Method to clear cache
    public clearCache(): void {
        this.cache = {};
        console.log('Cache cleared');
    }
}

export default new MetadataCache();
