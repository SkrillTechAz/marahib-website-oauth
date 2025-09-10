import {
  DesignLook,
  DesignLookImage,
  Product,
  ImageSpot,
  DesignLookFilters,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class DesignLooksApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all approved design looks with filters
  async getDesignLooks(filters?: {
    style?: string;
    room_type?: string;
    designer_id?: string;
  }): Promise<DesignLook[]> {
    const params = new URLSearchParams();

    if (filters?.style && filters.style !== "all") {
      params.append("style", filters.style);
    }
    if (filters?.room_type && filters.room_type !== "all") {
      params.append("room_type", filters.room_type);
    }
    if (filters?.designer_id && filters.designer_id !== "all") {
      params.append("designer_id", filters.designer_id);
    }

    const queryString = params.toString();
    const endpoint = `/api/public/design-looks${
      queryString ? `?${queryString}` : ""
    }`;

    return this.fetchApi<DesignLook[]>(endpoint);
  }

  // Get all images for a specific design look
  async getLookImages(lookId: string): Promise<DesignLookImage[]> {
    return this.fetchApi<DesignLookImage[]>(
      `/api/public/design-looks/${lookId}/images`
    );
  }

  // Get spots for a specific image
  async getImageSpots(lookId: string, imageId: string): Promise<ImageSpot[]> {
    return this.fetchApi<ImageSpot[]>(
      `/api/public/design-looks/${lookId}/spots/${imageId}`
    );
  }

  // Get products by IDs
  async getProducts(productIds: string[]): Promise<Product[]> {
    if (productIds.length === 0) return [];

    const params = new URLSearchParams();
    productIds.forEach((id) => params.append("product_ids", id));

    return this.fetchApi<Product[]>(
      `/api/public/design-looks/products?${params.toString()}`
    );
  }

  // Get filter options
  async getFilters(): Promise<DesignLookFilters> {
    return this.fetchApi<DesignLookFilters>("/api/public/design-looks/filters");
  }

  // Get complete look data (images, spots, products)
  async getCompleteLookData(lookId: string) {
    try {
      const [images, look] = await Promise.all([
        this.getLookImages(lookId),
        // You might want to get individual look details if needed
      ]);

      const lookData = {
        images,
        spots: {} as { [imageId: string]: ImageSpot[] },
        products: [] as Product[],
      };

      // Get spots for each image
      if (images.length > 0) {
        const spotsPromises = images.map((image) =>
          this.getImageSpots(lookId, image.id).then((spots) => ({
            imageId: image.id,
            spots,
          }))
        );

        const spotsResults = await Promise.all(spotsPromises);
        spotsResults.forEach(({ imageId, spots }) => {
          lookData.spots[imageId] = spots;
        });

        // Get all unique product IDs from spots
        const productIds = Array.from(
          new Set(
            Object.values(lookData.spots)
              .flat()
              .map((spot) => spot.product_id)
              .filter(Boolean) as string[]
          )
        );

        if (productIds.length > 0) {
          lookData.products = await this.getProducts(productIds);
        }
      }

      return lookData;
    } catch (error) {
      console.error("Error fetching complete look data:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const designLooksApi = new DesignLooksApiService();

// Export the class for testing or custom instances
export default DesignLooksApiService;
