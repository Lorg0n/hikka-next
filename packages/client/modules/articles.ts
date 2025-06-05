import { DEFAULT_PAGINATION } from '../constants';
import {
    ArticleArgs,
    ArticleResponse,
    ArticlesListArgs,
    ArticlesListResponse,
    ArticlesTopResponse,
} from '../types/articles';
import { BaseRequestOptionsArgs, PaginationArgs } from '../types/common';
import { BaseModule } from './base';

/**
 * Module for handling articles
 */
export class ArticlesModule extends BaseModule {
    /**
     * Search for articles with filtering criteria
     */
    public async searchArticles(
        args: ArticlesListArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArticlesListResponse> {
        return this.client.post<ArticlesListResponse>('/articles', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Get article details by slug
     */
    public async getArticleBySlug(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArticleResponse> {
        return this.client.get<ArticleResponse>(`/articles/${slug}`, options);
    }

    /**
     * Create a new article
     */
    public async createArticle(
        args: ArticleArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArticleResponse> {
        return this.client.post<ArticleResponse>(
            '/articles/create',
            args,
            options,
        );
    }

    /**
     * Update an existing article
     */
    public async updateArticle(
        slug: string,
        args: ArticleArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ArticleResponse> {
        return this.client.put<ArticleResponse>(
            `/articles/${slug}`,
            args,
            options,
        );
    }

    /**
     * Delete an article
     */
    public async deleteArticle(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<void> {
        return this.client.delete(`/articles/${slug}`, options);
    }

    /**
     * Get article statistics
     */
    public async getArticleStats(
        options?: BaseRequestOptionsArgs,
    ): Promise<ArticlesTopResponse> {
        return this.client.get<ArticlesTopResponse>('/articles/stats', options);
    }
}
