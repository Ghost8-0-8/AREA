class ApiService {
    private baseUrl: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    async get(endpoint: string, headers: Record<string, string> = {}) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
        return await this.handleResponse(response);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    async post(endpoint: string, body: any, headers: Record<string, string> = {}) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
        });
        return await this.handleResponse(response);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    async put(endpoint: string, body: any, headers: Record<string, string> = {}) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
        });
        return await this.handleResponse(response);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    async patch(endpoint: string, body: any, headers: Record<string, string> = {}) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
        });
        return await this.handleResponse(response);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    async delete(endpoint: string, headers: Record<string, string> = {}) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
        return await this.handleResponse(response);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    private async handleResponse(response: Response) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP Error: ${response.status}, ${JSON.stringify(errorData)}`);
      }
      return response.json();
    }
  
    private handleError(error: any) {
      console.error('API Error:', error);
      throw new Error('Something went wrong with the API request.');
    }
  }
  
  export default ApiService;
  