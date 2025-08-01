const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export interface MoveResponse {
  move: string;
  cube_string: string;
}

export interface SolutionResponse {
  solutionString: string;
  parsedMoves: string[];
}

export class RubikAPI {
  static async postMove(move: string): Promise<MoveResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ move }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to send move to backend.');
        return null;
      }
    } catch (error) {
      console.error('Error sending move to backend:', error);
      return null;
    }
  }

  static async getSolution(): Promise<SolutionResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}/solve`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch solution.');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching solution:', error);
      return null;
    }
  }

  static async resetCube(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/reset-cube`, { 
        method: 'POST' 
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error resetting cube:', error);
      return false;
    }
  }
}
