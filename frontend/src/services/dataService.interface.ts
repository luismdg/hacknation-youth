// /src/services/dataService.interface.ts
export interface TechCommunity {
  country: string;
  events_count: number;
  repos_count: number;
  contributors_count: number;
  avg_salary: number;
  youth_employment_rate: number;
  automation_risk?: number;
  wage_growth?: number;
}

export interface IDataService {
  fetchData(): Promise<Record<string, TechCommunity>>;
  getSourceInfo(): { name: string; badgeColor: string };
}

// Local implementation (current)
export class LocalDataService implements IDataService {
  async fetchData(): Promise<Record<string, TechCommunity>> {
    const { fetchRealWorldData } = await import('./realDataService');
    return fetchRealWorldData();
  }
  
  getSourceInfo() {
    return { name: 'GitHub + World Bank (Live)', badgeColor: 'green' };
  }
}

// Backend API implementation (future)
export class BackendDataService implements IDataService {
  private apiUrl: string;
  
  constructor(apiUrl: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.apiUrl = apiUrl;
  }
  
  async fetchData(): Promise<Record<string, TechCommunity>> {
    const response = await fetch(`${this.apiUrl}/econometric-data`);
    if (!response.ok) throw new Error('Failed to fetch from backend');
    return response.json();
  }
  
  getSourceInfo() {
    return { name: 'Backend API', badgeColor: 'blue' };
  }
}

// Mock data service (for testing/demo)
export class MockDataService implements IDataService {
  async fetchData(): Promise<Record<string, TechCommunity>> {
    // Return your hardcoded data
    return {
      "Kenya": {
        country: "Kenya",
        events_count: 45,
        repos_count: 890,
        contributors_count: 2340,
        avg_salary: 412,
        youth_employment_rate: 77.7,
      },
      // ... more countries
    };
  }
  
  getSourceInfo() {
    return { name: 'Sample Data', badgeColor: 'amber' };
  }
}